import { Request, Response, NextFunction } from "express";

import { FavoritesListWithMetadata } from "../../interfaces/favorites.interface";
import favoritesService from "./favorites.service";


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
  async createFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createdFavorite = await favoritesService.createFavorite(req.params.userId, req.body);
      res.status(201).json(createdFavorite);

    } catch (error: unknown) {
      next(error);
    }
  }


  /**
   * @summary Get documents 
   * @description Get a list of favorites for a user with pagination, sorting, and filtering options.
   * @param {express.Request} req is the request of the operation
   * @param {express.Response} res is the response of the operation
   * @param {express.Next} next is the middleware to continue with code execution
   * @returns {Promise<void>} Returns object containing the list of favorites, total count, current page, and page size.
   */
  async getFavorites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
      const sortField = req.query.sortField ? req.query.sortField as string : 'createdAt';
      const sortOrder = req.query.sortOrder ? parseInt(req.query.sortOrder as string) : -1;
      const mediaType = req.query.type ? req.query.type as string : undefined;
      const searchTerm = req.query.searchTerm ? req.query.searchTerm as string : undefined;
      const userId = req.params.userId;

      const favoritesListWithMetadata: FavoritesListWithMetadata = await favoritesService.getFavorites(userId, page, pageSize, sortField, sortOrder, mediaType, searchTerm);

      res.status(200).json(favoritesListWithMetadata);

    } catch (error: unknown) {
      next(error);
    }
  }

  /**
  * @summary Delete a favorite
  * @description Deletes a favorite item by its ID for a specific user.
  * @param {express.Request} req is the request of the operation
  * @param {express.Response} res is the response of the operation
  * @param {express.Next} next is the middleware to continue with code execution
  * @returns {Promise<void>} Returns a success message if the operation was successful.
     */
  async deleteFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await favoritesService.deleteFavorite(req.params.id, req.params.userId);

      res.status(200).json({ message: 'Element deleted successfully', data: {} });


    } catch (error: unknown) {
      next(error);
    }
  }


  /** 
  * @summary Update a favorite
  * @description Updates the description of a favorite item for a specific user.
  * @param {express.Request} req is the request of the operation
  * @param {express.Response} res is the response of the operation
  * @param {express.Next} next is the middleware to continue with code execution
  * @returns {Promise<void>} Returns the updated favorite item.
  */ 
  async updateFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const updatedItem = await favoritesService.updateFavorite(
        req.params.id,
        req.params.userId,
        req.body.description
      );

      res.status(200).json(updatedItem);

    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new FavoritesController();
