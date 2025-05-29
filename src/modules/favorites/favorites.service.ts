import { SortOrder, Types } from "mongoose";
import { FavoritesListWithMetadata, MediaItem } from "../../interfaces/favorites.interface";
import favoritesSchema from "../../models/favorites";
import userSchema from "../../models/user";
import descriptionSchema from "../../models/description";
import { ApiError } from "../../errors/apiError";


class FavoritesService {
  async createFavorite(userId: string, movie: MediaItem): Promise<MediaItem> {
    const user = await userSchema.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    }
    let favorite;
    const existingFavorite = await favoritesSchema.findOne({
      imdbID: movie.imdbID,
    });
    const userIdObjectId = new Types.ObjectId(userId);
    if (!existingFavorite) {
      movie.user = [userIdObjectId];
      favorite = await favoritesSchema.create(movie);
      user.favorites.push(favorite._id as Types.ObjectId);
    } else {

      if (user.favorites.includes(existingFavorite._id as Types.ObjectId)) {
        throw new ApiError(409, "Favorite already exist for this user", "FAVORITE_EXISTS");
      }
      user.favorites.push(existingFavorite._id as Types.ObjectId);
      favorite = existingFavorite;
      existingFavorite.user.push(userIdObjectId as Types.ObjectId);
      await existingFavorite.save();
    }
    await user.save();
    return favorite;
  }

  async getFavorites(userId: string, page: number, pageSize: number, sortField: string, sortOrder: number, mediaType?: string, searchTerm?: string): Promise<FavoritesListWithMetadata> {
    const user = await userSchema.findById(userId);
    if (!user) {
       throw new ApiError(404, "User not found", "USER_NOT_FOUND");
    }
    const sorting: Record<string, SortOrder> = { [sortField]: sortOrder as SortOrder };
    const filter = {
      user: userId,
      ...(mediaType && { type: mediaType }),
      ...(searchTerm && {
        title: {
          $regex: `^${searchTerm}`,
          $options: 'i'
        }
      })
    };
    const favoritesWithoutDescriptions = await favoritesSchema.find(filter)
      .sort(sorting)
      .limit(pageSize * 1)
      .skip((page - 1) * pageSize)
      .exec();
    const count = await favoritesSchema.countDocuments(filter);

    const favorites = await this.addUserDescriptionsToFavorites(userId, favoritesWithoutDescriptions);

    return {
      favorites,
      totalFavorites: count,
      currentPage: page,
      pageSize: pageSize,
    }
  }

  async deleteFavorite(movieId: string, userId: string): Promise<void> {
    const favorite = await favoritesSchema.findById(movieId);
    if (!favorite) throw new ApiError(400, "Favorite not found", "FAVORITE_NOT_FOUND");

    const user = await userSchema.findById(userId);
    if (!user) throw new ApiError(404, "User not found", "USER_NOT_FOUND");

    user.favorites = user.favorites.filter(fav => fav.toString() !== movieId);
    await user.save();

    favorite.user = favorite.user.filter(u => u.toString() !== userId);
    await favorite.save();

    await descriptionSchema.deleteOne({
      userId: userId,
      favoriteId: movieId
    });

    if (favorite.user.length === 0) {
      await favoritesSchema.findByIdAndDelete(movieId);
    }
  }

  async updateFavorite(movieId: string, userId: string, description: string): Promise<any> {

    let existingDescription = await descriptionSchema.findOne({ userId, favoriteId: movieId });
    if (!existingDescription) {
      existingDescription = await descriptionSchema.create({
        userId: new Types.ObjectId(userId),
        favoriteId: new Types.ObjectId(movieId),
        description: description,
      });
    } else {
      existingDescription.description = description;
      await existingDescription.save();
    }

    const updatedFavorite = await favoritesSchema.findByIdAndUpdate(
      movieId,
      { $addToSet: { descriptions: existingDescription._id } },
      { new: true, projection: { descriptions: 0, user: 0, __v: 0 } }
    ).lean();

    if (!updatedFavorite) {
      throw new ApiError(404, "Favorite not found or could not be updated", "FAVORITE_NOT_FOUND");
    }
    const result = {
      ...updatedFavorite,
      description: existingDescription.description
    };

    return result;
  }

  private async addUserDescriptionsToFavorites(userId: string, favorites: MediaItem[]): Promise<MediaItem[]> {
    return Promise.all(favorites.map(async (favorite) => {
      const descriptionDoc = await descriptionSchema.findOne({
        userId,
        favoriteId: favorite._id
      });

      const { descriptions, user, ...cleanFavorite } = favorite.toObject ?
        favorite.toObject() :
        favorite;

      return {
        ...cleanFavorite,
        description: descriptionDoc?.description || ''
      };
    }));
  }
}


export default new FavoritesService();
