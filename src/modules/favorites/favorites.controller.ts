import { Request, Response, NextFunction } from "express";

import { Favorites } from "../../interfaces/favorites.interface";
import favoritesService from "./favorites.service";
import { Description } from "../../interfaces/description.interface";

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
         typeof req.body !== 'object' || Object.keys(req.body).length === 0) {//Check that body is undefined or null, is an object type and not empty
        const error = new Error('A non-empty JSON body is mandatory.');
        res.status(400).json(error);
        return;
      }
      const createdFavorite = await favoritesService.createFavorite(req.params.id, req.body)
      res.status(201).json({ message: 'Element saved succesfully', data: createdFavorite });
    } catch (error:any) {
      if (error.message === 'Invalid input type') {
        res.status(400).json({error:'Bad request', message: error.message});
        return;
      }
      if (error.message === 'Favorite already exists for this user') {
        res.status(409).json({ error: "Data conflict", message: error.message });
        return;
      }
      res.status(500).json({error: 'Unknown error', message: error.message});
      return;
         //  next(error);
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
      
      const favorites: Favorites[] = await favoritesService.getFavorites(req.params.id);
      const favoritesWithDescriptions: any[] = await Promise.all(favorites.map(async (favorite) => {
        const descriptions: Description[] = await favoritesService.getDescriptions(req.params.id, favorite._id); // Obtener las descripciones asociadas con el favorito
        return { ...favorite.toObject(), descriptions }; // Agregar las descripciones al objeto de favorito y convertirlo a un objeto JavaScript plano
    }));
    res.status(200).json(favoritesWithDescriptions); // Enviar la lista de favoritos actualizada al frontend
    } catch (error:any) {
      if (error.message === 'Invalid input type') {
        res.status(400).json({ error:'Bad request', message: error.message });
        return;
      }
      if (error.message === 'Not favorites saved') {
        res.status(404).json({ error: "No element found", message: error.message });
        return;
      }
      res.status(500).json({error: 'Unknown error', message: error.message});
      return;
       //next(error);
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
    } catch (error: any) {
      if (error.message === 'Invalid input type') {
        res.status(400).json({ error:'Bad request', message: error.message });
        return;
      }
      if (error.message === 'Server error.Favorite not found') {
        res.status(404).json({ error:'Not found', message: error.message });
        return;
      }
      res.status(500).json({error: 'Unknown error', message: error.message});
      return;
      //next(error);
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
        res.status(400).json(error);
        return;
      }
      console.log('req.body',req.body);
      await favoritesService.updateFavorite(req.params.id,req.params.userId, req.body.description);

      res.status(200).json({ message: 'Element updated successfully' , data: {} });
    } catch (error:any) {
      
      switch (error.message) {
        case 'Invalid input type':
          res.status(400).json({error:'Bad request', message: error.message});
          break;
        case 'Description is too long':
          res.status(400).json({error:'Bad request', message: error.message});
          break;
        case 'Failed to update favorite':
          res.status(500).json({error: 'Server error', message: error.message});
      
        default:
          res.status(500).json({error: 'Unknown error', message: error.message});
          break;
      }
      return;
      // next(error);
      }
      
    }
  }


export default new FavoritesController();