import { Request, Response, NextFunction } from "express";

import omdbService from "./omdb.service";
import { OmdbItemDetailResponse, OmdbSearchResponse } from "../../interfaces/omdb.interface";


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
      const title = req.query.title as string || "";
      const type = req.query.type as string || "";
      const year = req.query.year as string || "";
      const page = req.query.page as string || "1";
      
      const omdbResponse: OmdbSearchResponse = await omdbService.getOmdbMovies(title, type, year, page);

      res.status(200).json(omdbResponse);
    } catch (error: unknown) {
      next(error);
    }
  }
  async getMovieInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const omdbResponse: OmdbItemDetailResponse = await omdbService.getMovieInfo(req.params.id);
      res.status(200).json(omdbResponse);

    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new OmdbController();