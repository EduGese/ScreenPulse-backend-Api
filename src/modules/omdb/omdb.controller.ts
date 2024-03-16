import { Request, Response, NextFunction } from "express";

import { OmdbResponse } from "../../interfaces/omdb.interface";
import omdbService from "./omdb.service";


class OmdbController {
    
    /**
     * @summary Find documents from a collection 
     * @description Get documents
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Array} with all documents matching the conditions
     */
  async getOmdbMovies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {//Check that body is undefined or null, is an object type and not empty
            const error = new Error('A non-empty JSON body is mandatory.');
            return next(error);
          }

          const omdbResponse: OmdbResponse = await omdbService.getOmdbMovies(req.body);
          res.status(200).json(omdbResponse);

    } catch (error) {
      next(error);
      return;
    }
  }  
  async getMovieInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        
          const omdbResponse: OmdbResponse = await omdbService.getMovieInfo(req.params.id);
          res.status(200).json(omdbResponse);

    } catch (error) {
      next(error);
      return;
    }
  }  
}

export default new OmdbController();