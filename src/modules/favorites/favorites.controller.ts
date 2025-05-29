import { Request, Response, NextFunction } from "express";

import { FavoritesListWithMetadata } from "../../interfaces/favorites.interface";
import favoritesService from "./favorites.service";


class FavoritesController {

  /**
     * @summary Create new document
     * @description Create and insert a new document in a collection.
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Object}  created document
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
   * @summary Find documents from a collection 
   * @description Get documents
   * @param {express.Request} req is the request of the operation
   * @param {express.Response} res is the response of the operation
   * @param {express.Next} next is the middleware to continue with code execution
   * @returns {Array} with all documents matching the conditions
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
     * @summary Delete a document
     * @description Delete a document by id
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Object} Empty object if the operation went well
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
     * @summary Update a document
     * @description Update a document by id
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Object} Updated object if the operation went well
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
