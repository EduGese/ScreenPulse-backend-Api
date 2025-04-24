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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const favorites_1 = __importDefault(require("../../models/favorites"));
const user_1 = __importDefault(require("../../models/user"));
const description_1 = __importDefault(require("../../models/description"));
class FavoritesService {
    createFavorite(userId, movie) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof userId !== 'string')
                throw new Error("Invalid input type");
            const user = yield user_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            let favorite;
            const existingFavorite = yield favorites_1.default.findOne({
                imdbID: movie.imdbID,
            });
            const userIdObjectId = new mongoose_1.Types.ObjectId(userId);
            if (!existingFavorite) {
                movie.user = [userIdObjectId];
                favorite = yield favorites_1.default.create(movie);
                user.favorites.push(favorite._id);
            }
            else {
                if (user.favorites.includes(existingFavorite._id)) {
                    throw new Error("Favorite already exists for this user");
                }
                user.favorites.push(existingFavorite._id);
                favorite = existingFavorite;
                existingFavorite.user.push(userIdObjectId);
                yield existingFavorite.save();
            }
            yield user.save();
            return favorite;
        });
    }
    getFavorites(userId, page, pageSize, sortField, sortOrder, mediaType, searchTerm) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getFavorites", userId, page, pageSize, sortField, sortOrder, mediaType, searchTerm);
            if (typeof userId !== 'string')
                throw new Error("Invalid input type");
            const user = yield user_1.default.findById(userId);
            if (!user) {
                throw new Error("User not found");
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
    deleteFavorite(movieId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof movieId !== 'string' || typeof userId !== 'string') {
                throw new Error("Invalid input type");
            }
            const favorite = yield favorites_1.default.findById(movieId);
            if (!favorite)
                throw new Error("Favorite not found");
            const user = yield user_1.default.findById(userId);
            if (!user)
                throw new Error("User not found");
            user.favorites = user.favorites.filter(fav => fav.toString() !== movieId);
            yield user.save();
            favorite.user = favorite.user.filter(u => u.toString() !== userId);
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
    updateFavorite(movieId, userId, description) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof movieId !== 'string' || typeof userId !== 'string' || typeof description !== 'string')
                throw new Error("Invalid input type");
            if (description.length > 200)
                throw new Error("Description is too long");
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
                throw new Error("Failed to update favorite");
            }
            const result = Object.assign(Object.assign({}, updatedFavorite), { description: existingDescription.description });
            return result;
        });
    }
    getDescriptions(userId, favoriteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const descriptions = yield description_1.default.find({ userId, favoriteId });
            return descriptions;
        });
    }
    addUserDescriptionsToFavorites(userId, favorites) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.all(favorites.map((favorite) => __awaiter(this, void 0, void 0, function* () {
                const descriptionDoc = yield description_1.default.findOne({
                    userId,
                    favoriteId: favorite._id
                });
                const _a = favorite.toObject ?
                    favorite.toObject() :
                    favorite, { descriptions, user } = _a, cleanFavorite = __rest(_a, ["descriptions", "user"]);
                return Object.assign(Object.assign({}, cleanFavorite), { description: (descriptionDoc === null || descriptionDoc === void 0 ? void 0 : descriptionDoc.description) || '' });
            })));
        });
    }
}
exports.default = new FavoritesService();
