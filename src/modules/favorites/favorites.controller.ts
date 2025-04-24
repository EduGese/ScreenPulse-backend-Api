import { Request, Response, NextFunction } from "express";

import { MediaItem } from "../../interfaces/favorites.interface";
import favoritesService from "./favorites.service";
import mongoose from "mongoose";

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
      if (
        !req.body ||
        typeof req.body !== 'object' || Object.keys(req.body).length === 0) {  
        const error = new Error('A non-empty JSON body is mandatory.');
        res.status(400).json({
          message: error.message,
          code: 'BAD_REQUEST',
        });
        return;
      }
      
      const createdFavorite = await favoritesService.createFavorite(req.params.userId, req.body);
      
      res.status(201).json(createdFavorite);
      
    } catch (error: any) {
      if (error.message === 'Invalid input type') {
        res.status(400).json({
          message: 'Bad request: Invalid input type',
          code: 'INVALID_INPUT_TYPE',
        });
        return;
      }
      
      if (error.message === 'Favorite already exists for this user') {
        res.status(409).json({
          message: 'Conflict: Favorite already exists for this user',
          code: 'FAVORITE_EXISTS',
        });
        return;
      }
      
      res.status(500).json({
        message: 'An unexpected error occurred. Please try again later.',
        code: 'INTERNAL_ERROR',
      });
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
  async getFavorites(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize as string) : 10;
      const sortField = req.query.sortField ? req.query.sortField as string : 'createdAt';
      const sortOrder = req.query.sortOrder ? parseInt(req.query.sortOrder as string) : -1;
      const mediaType = req.query.type ? req.query.type as string : undefined;
      const searchTerm = req.query.searchTerm ? req.query.searchTerm as string : undefined;
      const userId = req.params.userId;
  
      /* VALIDACIONES */
  
      if (!userId || typeof userId !== 'string' || !mongoose.Types.ObjectId.isValid(userId)) {
        res.status(400).json({
          message: "Invalid user ID format",
          code: "INVALID_USER_ID"
        });
        return;
      }
  
      if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1 || pageSize > 100) {
        res.status(400).json({
          message: "Invalid pagination parameters. Page must be ≥ 1 and pageSize between 1-100",
          code: "INVALID_PAGINATION"
        });
        return;
      }
  
      const allowedSortFields = ['createdAt', 'title', 'year']; 
      if (!allowedSortFields.includes(sortField)) {
        res.status(400).json({
          message: `Invalid sortField. Allowed values: ${allowedSortFields.join(', ')}`,
          code: "INVALID_SORT_FIELD"
        });
        return;
      }
  
      if (sortOrder !== 1 && sortOrder !== -1) {
        res.status(400).json({
          message: "sortOrder must be 1 (asc) or -1 (desc)",
          code: "INVALID_SORT_ORDER"
        });
        return;
      }
  
      if (mediaType) {
        const allowedTypes = ['movie', 'series', 'game']; 
        if (!allowedTypes.includes(mediaType.toLowerCase())) {
          res.status(400).json({
            message: `Invalid media type. Allowed values: ${allowedTypes.join(', ')}`,
            code: "INVALID_MEDIA_TYPE"
          });
          return;
        }
      }
      const favorites: MediaItem[] = await favoritesService.getFavorites(userId, page, pageSize, sortField, sortOrder, mediaType, searchTerm);
    
      res.status(200).json(favorites); 
  
    } catch (error: any) {
      if (error.message === 'Invalid input type') {
        res.status(400).json({
          message: 'Bad request',
          code: 'INVALID_INPUT_TYPE'
        });
        return;
      }
      res.status(500).json({
        message: 'An unexpected error occurred. Please try again later.',
        code: 'INTERNAL_ERROR'
      });
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
  async deleteFavorite(req: Request, res: Response): Promise<void> {
    try {
      await favoritesService.deleteFavorite(req.params.id, req.params.userId);
  
      res.status(200).json({ message: 'Element deleted successfully', data: {} });

      
    } catch (error: any) {
      if (error.message === 'Invalid input type') {
        res.status(400).json({
          message: 'Bad request',
          code: 'INVALID_INPUT_TYPE',
        });
        return;
      }
  
      if (error.message === 'Server error.Favorite not found') {
        res.status(404).json({
          message: 'Favorite not found',
          code: 'FAVORITE_NOT_FOUND',
        });
        return;
      }
  
      res.status(500).json({
        message: 'An unexpected error occurred. Please try again later.',
        code: 'INTERNAL_ERROR',
      });
      return;
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
  async updateFavorite(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
        res.status(400).json({
          message: 'A non-empty JSON body is mandatory.',
          code: 'EMPTY_BODY'
        });
        return;
      }
  
      const updatedItem = await favoritesService.updateFavorite(
        req.params.id,
        req.params.userId,
        req.body.description
      );
  
      res.status(200).json(updatedItem);
  
    } catch (error: any) {
      switch (error.message) {
        case 'Invalid input type':
          res.status(400).json({
            message: 'Invalid input type',
            code: 'INVALID_INPUT_TYPE'
          });
          break;
  
        case 'Description is too long':
          res.status(400).json({
            message: 'Description is too long',
            code: 'DESCRIPTION_TOO_LONG'
          });
          break;
  
        case 'Failed to update favorite':
          res.status(404).json({
            message: 'Favorite not found or could not be updated',
            code: 'FAVORITE_NOT_FOUND'
          });
          break;
  
        default:
          res.status(500).json({
            message: 'An unexpected error occurred. Please try again later.',
            code: 'INTERNAL_ERROR'
          });
          break;
      }
    }
  }  
}


export default new FavoritesController();