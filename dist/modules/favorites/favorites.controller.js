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
const favorites_service_1 = __importDefault(require("./favorites.service"));
class FavoritesController {
    /**
     * @summary Controller for creating a new favorite for a user.
     * @description This method handles the creation of a new favorite media item for a user.
     * @param {Request} req - HTTP request containing the userId as a route parameter and the movie data in the body.
     * @param {Response} res - HTTP response object.
     * @param {NextFunction} next - Express callback to pass control to the error handler.
     * @returns {Promise<void>}
     * @throws {ApiError} If the user is not found or the favorite already exists for this user.
     */
    createFavorite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdFavorite = yield favorites_service_1.default.createFavorite(req.params.userId, req.body);
                res.status(201).json(createdFavorite);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @summary Get documents
     * @description Get a list of favorites for a user with pagination, sorting, and filtering options.
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Promise<void>} Returns object containing the list of favorites, total count, current page, and page size.
     */
    getFavorites(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = req.query.page ? parseInt(req.query.page) : 1;
                const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
                const sortField = req.query.sortField ? req.query.sortField : 'createdAt';
                const sortOrder = req.query.sortOrder ? parseInt(req.query.sortOrder) : -1;
                const mediaType = req.query.type ? req.query.type : undefined;
                const searchTerm = req.query.searchTerm ? req.query.searchTerm : undefined;
                const userId = req.params.userId;
                const favoritesListWithMetadata = yield favorites_service_1.default.getFavorites(userId, page, pageSize, sortField, sortOrder, mediaType, searchTerm);
                res.status(200).json(favoritesListWithMetadata);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
    * @summary Delete a favorite
    * @description Deletes a favorite item by its ID for a specific user.
    * @param {express.Request} req is the request of the operation
    * @param {express.Response} res is the response of the operation
    * @param {express.Next} next is the middleware to continue with code execution
    * @returns {Promise<void>} Returns a success message if the operation was successful.
       */
    deleteFavorite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield favorites_service_1.default.deleteFavorite(req.params.id, req.params.userId);
                res.status(200).json({ message: 'Element deleted successfully', data: {} });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
    * @summary Update a favorite
    * @description Updates the description of a favorite item for a specific user.
    * @param {express.Request} req is the request of the operation
    * @param {express.Response} res is the response of the operation
    * @param {express.Next} next is the middleware to continue with code execution
    * @returns {Promise<void>} Returns the updated favorite item.
    */
    updateFavorite(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedItem = yield favorites_service_1.default.updateFavorite(req.params.id, req.params.userId, req.body.description);
                res.status(200).json(updatedItem);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new FavoritesController();
