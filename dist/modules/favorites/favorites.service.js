"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const favorites_1 = __importDefault(require("../../models/favorites"));
const user_1 = __importDefault(require("../../models/user"));
const description_1 = __importDefault(require("../../models/description"));
const apiError_1 = require("../../errors/apiError");
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
    createFavorite(userId, mediaItem) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findById(userId);
            if (!user) {
                throw new apiError_1.ApiError(404, "User not found", "USER_NOT_FOUND");
            }
            let favorite;
            const existingFavorite = yield favorites_1.default.findOne({
                imdbID: mediaItem.imdbID,
            });
            const userIdObjectId = new mongoose_1.Types.ObjectId(userId);
            if (!existingFavorite) {
                const newFavoriteData = Object.assign(Object.assign({}, mediaItem), { user: [userIdObjectId], descriptions: [] });
                favorite = yield favorites_1.default.create(newFavoriteData);
                user.favorites.push(favorite._id);
            }
            else {
                if (user.favorites.includes(existingFavorite._id)) {
                    throw new apiError_1.ApiError(409, "Favorite already exist for this user", "FAVORITE_EXISTS");
                }
                user.favorites.push(existingFavorite._id);
                favorite = existingFavorite;
                existingFavorite.user.push(userIdObjectId);
                yield existingFavorite.save();
            }
            yield user.save();
            const favoriteResponse = {
                _id: favorite._id,
                title: favorite.title,
                year: favorite.year,
                imdbID: favorite.imdbID,
                type: favorite.type,
                poster: favorite.poster
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
        });
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
    getFavorites(userId, page, pageSize, sortField, sortOrder, mediaType, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findById(userId);
            if (!user) {
                throw new apiError_1.ApiError(404, "User not found", "USER_NOT_FOUND");
            }
            const sorting = { [sortField]: sortOrder };
            const filter = Object.assign(Object.assign({ user: userId }, (mediaType && { type: mediaType })), (searchTerm && {
                title: {
                    $regex: `^${searchTerm}`,
                    $options: 'i'
                }
            }));
            const favoritesWithoutDescriptions = yield favorites_1.default.find(filter)
                .sort(sorting)
                .limit(pageSize * 1)
                .skip((page - 1) * pageSize)
                .exec();
            const count = yield favorites_1.default.countDocuments(filter);
            const favorites = yield this.addUserDescriptionsToFavorites(userId, favoritesWithoutDescriptions);
            return {
                favorites,
                totalFavorites: count,
                currentPage: page,
                pageSize: pageSize,
            };
        });
    }
    /**
    * Deletes a favorite mediaItem from a user's favorites list.
    * If the favorite is the last one associated with the mediaItem, the mediaItem is also deleted.
    * @param {string} movieId - The ID of the favorite mediaItem to be deleted.
    * @param {string} userId - The ID of the user from whose favorites the mediaItem is to be removed.
    * @returns {Promise<void>} A promise that resolves when the favorite is successfully deleted.
    * @throws {ApiError} If the favorite is not found (400), the user is not found (404), or if there is an error during deletion.
    * */
    deleteFavorite(movieId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const favorite = yield favorites_1.default.findById(movieId);
            if (!favorite)
                throw new apiError_1.ApiError(404, "Favorite not found", "FAVORITE_NOT_FOUND");
            const user = yield user_1.default.findById(userId);
            if (!user)
                throw new apiError_1.ApiError(404, "User not found", "USER_NOT_FOUND");
            user.favorites = user.favorites.filter(fav => fav.toString() !== movieId);
            yield user.save();
            favorite.user = favorite.user.filter((u) => u.toString() !== userId);
            yield favorite.save();
            yield description_1.default.deleteOne({
                userId: userId,
                favoriteId: movieId
            });
            if (favorite.user.length === 0) {
                yield favorites_1.default.findByIdAndDelete(movieId);
            }
        });
    }
    /**
     * Updates the description of a favorite mediaItem for a specific user.
     * If the description does not exist, it creates a new one.
     * @param {string} movieId - The ID of the favorite mediaItem to be updated.
     * @param {string} userId - The ID of the user for whom the favorite mediaItem description is being updated.
     * @param {string} description - The new description to be set for the favorite mediaItem.
     * @returns {Promise<MediaItemDocument>} A promise that resolves to the updated favorite mediaItem object with the new description.
     */
    updateFavorite(movieId, userId, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findById(userId);
            if (!user)
                throw new apiError_1.ApiError(404, "User not found", "USER_NOT_FOUND");
            let existingDescription = yield description_1.default.findOne({ userId, favoriteId: movieId });
            if (!existingDescription) {
                existingDescription = yield description_1.default.create({
                    userId: new mongoose_1.Types.ObjectId(userId),
                    favoriteId: new mongoose_1.Types.ObjectId(movieId),
                    description: description,
                });
            }
            else {
                existingDescription.description = description;
                yield existingDescription.save();
            }
            const updatedFavorite = yield favorites_1.default.findByIdAndUpdate(movieId, { $addToSet: { descriptions: existingDescription._id } }, { new: true, projection: { descriptions: 0, user: 0, __v: 0 } }).lean();
            if (!updatedFavorite) {
                throw new apiError_1.ApiError(404, "Favorite not found or could not be updated", "FAVORITE_NOT_FOUND");
            }
            const result = Object.assign(Object.assign({}, updatedFavorite), { description: existingDescription.description });
            return result;
        });
    }
    /**
     * Adds user-specific descriptions to each favorite media item.
     * This method retrieves the description for each favorite media item based on the user ID and appends it to the favorite item.
     * @param {string} userId - The ID of the user whose descriptions are to be added.
     * @param {MediaItemDocument[]} favorites - An array of favorite media items to which user descriptions will be added.
     * @return {Promise<MediaItemDocument[]>} A promise that resolves to an array of favorite media items with user descriptions added.
     */
    addUserDescriptionsToFavorites(userId, favorites) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(favorites.map((favorite) => __awaiter(this, void 0, void 0, function* () {
                const descriptionDoc = yield description_1.default.findOne({
                    userId,
                    favoriteId: favorite._id
                });
                // const { descriptions, user, ...cleanFavorite } = favorite.toObject ? favorite.toObject() : favorite;
                // return {
                //   ...favorite,
                //   description: descriptionDoc?.description || ''
                // };
                const baseFavorite = favorite.toObject ? favorite.toObject() : favorite;
                const cleanFavorite = this.omit(baseFavorite, ['descriptions', 'user']);
                return Object.assign(Object.assign({}, cleanFavorite), { description: (descriptionDoc === null || descriptionDoc === void 0 ? void 0 : descriptionDoc.description) || '' });
            })));
        });
    }
    omit(obj, keys) {
        const clone = Object.assign({}, obj);
        for (const key of keys) {
            delete clone[key];
        }
        return clone;
    }
}
exports.default = new FavoritesService();
