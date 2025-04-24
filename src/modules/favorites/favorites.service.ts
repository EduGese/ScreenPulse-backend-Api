import { SortOrder, Types } from "mongoose";
import { MediaItem } from "../../interfaces/favorites.interface";
import favoritesSchema from "../../models/favorites";
import userSchema from "../../models/user";
import descriptionSchema from "../../models/description";


class FavoritesService {
  async createFavorite(userId: string, movie: MediaItem): Promise<any> {
    if (typeof userId !== 'string') throw new Error("Invalid input type");
    const user = await userSchema.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    let favorite;

    const existingFavorite = await favoritesSchema.findOne({
      imdbID: movie.imdbID,
    });
    const userIdObjectId = new Types.ObjectId(userId);
    if (!existingFavorite) {

      movie.user = [userIdObjectId];
      favorite = await favoritesSchema.create(movie);
      user.favorites.push(favorite._id);
    } else {

      if (user.favorites.includes(existingFavorite._id)) {
        throw new Error("Favorite already exists for this user");
      }

      user.favorites.push(existingFavorite._id);
      favorite = existingFavorite;
      existingFavorite.user.push(userIdObjectId);
      await existingFavorite.save();
    }

    await user.save();
    return favorite;
  }


  async getFavorites(userId: string, page: number, pageSize: number, sortField: string, sortOrder: number, mediaType?: string, searchTerm?: string): Promise<any> {
    console.log("getFavorites", userId, page, pageSize, sortField, sortOrder, mediaType, searchTerm);
    if (typeof userId !== 'string') throw new Error("Invalid input type");
    const user = await userSchema.findById(userId);
    if (!user) {
      throw new Error("User not found");
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

  async deleteFavorite(movieId: string, userId: string): Promise<any> {
    if (typeof movieId !== 'string' || typeof userId !== 'string') {
      throw new Error("Invalid input type");
    }

    const favorite = await favoritesSchema.findById(movieId);
    if (!favorite) throw new Error("Favorite not found");

    const user = await userSchema.findById(userId);
    if (!user) throw new Error("User not found");

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
    if (typeof movieId !== 'string' || typeof userId !== 'string' || typeof description !== 'string') throw new Error("Invalid input type");
    if (description.length > 200) throw new Error("Description is too long");

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
      throw new Error("Failed to update favorite");
    }
    const result = {
      ...updatedFavorite,
      description: existingDescription.description
    };

    return result;
  }


  async getDescriptions(userId: string, favoriteId: string): Promise<any> {
    const descriptions = await descriptionSchema.find({ userId, favoriteId });
    return descriptions;
  }

  async addUserDescriptionsToFavorites(userId: string, favorites: MediaItem[]): Promise<MediaItem[]> {
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
