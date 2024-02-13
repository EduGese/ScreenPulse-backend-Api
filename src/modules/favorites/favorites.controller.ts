import { Request, Response, NextFunction } from "express";

import { Favorites } from "../../interfaces/favorites.interface";
import favoritesService from "./favorites.service";

class FavoritesController {
    
  /**
     * @summary Create new document
     * @description Create and insert a new document in a collection.
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Array} with created document
     */
  async createFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (
        !req.body ||
         typeof req.body !== 'object' || Object.keys(req.body).length === 0) {//Check that body is undefined or null, is an object type and not empty
        const error = new Error('A non-empty JSON body is mandatory.');
        return next(error);
      }
      const createdFavorite = await favoritesService.createFavorite(req.body)
      res.status(201).json({ message: 'Element saved succesfully', data: createdFavorite });
    } catch (error) {
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
      const favorites: Favorites[] = await favoritesService.getFavorites();
      res.status(200).json(favorites);
    } catch (error) {
      next(error);
      return;
    }
  }

    /**
     * @summary Find document by its id from a collection
     * @description Get document
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Array} with all documents matching the conditions
     */
  async getFavoriteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const favorite: any = await favoritesService.getFavoriteById(req.params.id);
      res.status(200).json({ message: 'Element retrieved successfully', data: favorite });
    } catch (error) {
      next(error);
      return;
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
      await favoritesService.deleteFavorite(req.params.id);
      res.status(200).json({ message: 'Element deleted successfully', data: {} });
    } catch (error) {
      next(error);
      return;
    }
  }

  /**
     * @summary Update a document
     * @description Update a document by id
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Object} Empty object if the operation went well
     */
  async updateFavorite(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0){
        const error = new Error('A non-empty JSON body is mandatory.');
        return next(error);
      }
      // const documentId = req.params.id;
      // const updatedData = { description: req.body.description };
      // await favoritesSchema.updateOne( { _id: documentId },updatedData );
      await favoritesService.updateFavorite(req.params.id, req.body.description);

      res.status(200).json({ message: 'Element updated successfully'});
    } catch (error) {
      next(error);
      return;
    }
  }
}

export default new FavoritesController();