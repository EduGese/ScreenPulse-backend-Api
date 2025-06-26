import { SortOrder, Types } from 'mongoose';
import {
  FavoriteResponse,
  FavoritesListWithMetadata,
  MediaItemDocument,
  MediaItemInput,
  MediaItemWithMetaData,
} from '../../interfaces/favorites.interface';
import favoritesSchema from '../../models/favorites';
import userSchema from '../../models/user';
import descriptionSchema from '../../models/description';
import { ApiError } from '../../errors/apiError';

class FavoritesService {
  /**
   * Adds a new favorite mediaItem to a user's list of favorites.
   * If the mediaItem is not already in the favorites collection, it is created.
   * If the mediaItem exists but is not yet a favorite for this user, it is added to the user's favorites.
   * @param {string} userId - The ID of the user.
   * @param {MediaItem} mediaItem - The mediaItem object to be added as a favorite.
   * @returns {Promise<FavoriteResponse>} The created or updated favorite mediaItem object.
   * @throws {ApiError} If the user does not exist (404) or the favorite already exists for this user (409).
   */
  async createFavorite(userId: string, mediaItem: MediaItemInput): Promise<FavoriteResponse> {
    const user = await userSchema.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
    let favorite;
    const existingFavorite = await favoritesSchema.findOne({
      imdbID: mediaItem.imdbID,
    });
    const userIdObjectId = new Types.ObjectId(userId);
    if (!existingFavorite) {
      const newFavoriteData = {
        ...mediaItem,
        user: [userIdObjectId],
        descriptions: [],
      };
      favorite = await favoritesSchema.create(newFavoriteData);
      user.favorites.push(favorite._id as Types.ObjectId);
    } else {
      if (user.favorites.includes(existingFavorite._id as Types.ObjectId)) {
        throw new ApiError(409, 'Favorite already exist for this user', 'FAVORITE_EXISTS');
      }
      user.favorites.push(existingFavorite._id as Types.ObjectId);
      favorite = existingFavorite;
      existingFavorite.user.push(userIdObjectId as Types.ObjectId);
      await existingFavorite.save();
    }
    await user.save();
    const favoriteResponse = {
      _id: favorite._id,
      title: favorite.title,
      year: favorite.year,
      imdbID: favorite.imdbID,
      type: favorite.type,
      poster: favorite.poster,
    };
    return favoriteResponse;

    // return {
    //   _id: favorite._id,
    //   title: favorite.title,
    //   year: favorite.year,
    //   imdbID: favorite.imdbID,
    //   type: favorite.type,
    //   poster: favorite.poster
    // }
  }

  /**
   * Retrieves a paginated list of favorites for a user, with optional filtering and sorting.
   * @param {string} userId - The ID of the user whose favorites are to be retrieved.
   * @param {number} page - The page number for pagination.
   * @param {number} pageSize - The number of items per page.
   * @param {string} sortField - The field by which to sort the favorites ('title' or 'year').
   * @param {number} sortOrder - The order of sorting (1 for ascending, -1 for descending).
   * @param {string} [mediaType] - Optional filter for media type (e.g., 'movie', 'series').
   * @param {string} [searchTerm] - Optional search term to filter favorites by title.
   * @returns {Promise<FavoritesListWithMetadata>} A promise that resolves to an object containing the list of favorites, total count, current page, and page size.
   * @throws {ApiError} If the user is not found (404) or if there is an error retrieving the favorites.
   *
   */
  async getFavorites(
    userId: string,
    page: number,
    pageSize: number,
    sortField: string,
    sortOrder: number,
    mediaType?: string,
    searchTerm?: string,
  ): Promise<FavoritesListWithMetadata> {
    const user = await userSchema.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }
    const sorting: Record<string, SortOrder> = { [sortField]: sortOrder as SortOrder };
    const filter = {
      user: userId,
      ...(mediaType && { type: mediaType }),
      ...(searchTerm && {
        title: {
          $regex: `^${searchTerm}`,
          $options: 'i',
        },
      }),
    };
    const favoritesWithoutDescriptions = await favoritesSchema
      .find(filter)
      .sort(sorting)
      .limit(pageSize * 1)
      .skip((page - 1) * pageSize)
      .exec();
    const count = await favoritesSchema.countDocuments(filter);

    const favorites = await this.addUserDescriptionsToFavorites(
      userId,
      favoritesWithoutDescriptions,
    );
    return {
      favorites,
      totalFavorites: count,
      currentPage: page,
      pageSize: pageSize,
    };
  }

  /**
   * Deletes a favorite mediaItem from a user's favorites list.
   * If the favorite is the last one associated with the mediaItem, the mediaItem is also deleted.
   * @param {string} movieId - The ID of the favorite mediaItem to be deleted.
   * @param {string} userId - The ID of the user from whose favorites the mediaItem is to be removed.
   * @returns {Promise<void>} A promise that resolves when the favorite is successfully deleted.
   * @throws {ApiError} If the favorite is not found (400), the user is not found (404), or if there is an error during deletion.
   * */
  async deleteFavorite(movieId: string, userId: string): Promise<void> {
    const favorite = await favoritesSchema.findById(movieId);
    if (!favorite) throw new ApiError(404, 'Favorite not found', 'FAVORITE_NOT_FOUND');

    const user = await userSchema.findById(userId);
    if (!user) throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');

    user.favorites = user.favorites.filter((fav) => fav.toString() !== movieId);
    await user.save();

    favorite.user = favorite.user.filter(
      (u: { toString: () => string }) => u.toString() !== userId,
    );
    await favorite.save();

    await descriptionSchema.deleteOne({
      userId: userId,
      favoriteId: movieId,
    });

    if (favorite.user.length === 0) {
      await favoritesSchema.findByIdAndDelete(movieId);
    }
  }
  /**
   * Updates the description of a favorite mediaItem for a specific user.
   * If the description does not exist, it creates a new one.
   * @param {string} movieId - The ID of the favorite mediaItem to be updated.
   * @param {string} userId - The ID of the user for whom the favorite mediaItem description is being updated.
   * @param {string} description - The new description to be set for the favorite mediaItem.
   * @returns {Promise<MediaItemDocument>} A promise that resolves to the updated favorite mediaItem object with the new description.
   */
  async updateFavorite(
    movieId: string,
    userId: string,
    description: string,
  ): Promise<MediaItemWithMetaData> {
    const user = await userSchema.findById(userId);
    if (!user) throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');

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

    const updatedFavorite = await favoritesSchema
      .findByIdAndUpdate(
        movieId,
        { $addToSet: { descriptions: existingDescription._id } },
        { new: true, projection: { descriptions: 0, user: 0, __v: 0 } },
      )
      .lean();

    if (!updatedFavorite) {
      throw new ApiError(404, 'Favorite not found or could not be updated', 'FAVORITE_NOT_FOUND');
    }
    const result = {
      ...updatedFavorite,
      description: existingDescription.description,
    };
    return result;
  }
  /**
   * Adds user-specific descriptions to each favorite media item.
   * This method retrieves the description for each favorite media item based on the user ID and appends it to the favorite item.
   * @param {string} userId - The ID of the user whose descriptions are to be added.
   * @param {MediaItemDocument[]} favorites - An array of favorite media items to which user descriptions will be added.
   * @return {Promise<MediaItemDocument[]>} A promise that resolves to an array of favorite media items with user descriptions added.
   */
  private async addUserDescriptionsToFavorites(
    userId: string,
    favorites: MediaItemDocument[],
  ): Promise<MediaItemWithMetaData[]> {
    return Promise.all(
      favorites.map(async (favorite) => {
        const descriptionDoc = await descriptionSchema.findOne({
          userId,
          favoriteId: favorite._id,
        });

        // const { descriptions, user, ...cleanFavorite } = favorite.toObject ? favorite.toObject() : favorite;

        // return {
        //   ...favorite,
        //   description: descriptionDoc?.description || ''
        // };
        const baseFavorite = favorite.toObject ? favorite.toObject() : favorite;
        const cleanFavorite = this.omit(baseFavorite, ['descriptions', 'user']);

        return {
          ...cleanFavorite,
          description: descriptionDoc?.description || '',
        } as MediaItemWithMetaData;
      }),
    );
  }
  private omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const clone = { ...obj };
    for (const key of keys) {
      delete clone[key];
    }
    return clone;
  }
}

export default new FavoritesService();
