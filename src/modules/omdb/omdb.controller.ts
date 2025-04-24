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
  async getOmdbMovies(req: Request, res: Response): Promise<void> {
    try {
      const title = req.query.title as string || "";
      const type = req.query.type as string || "";
      const year = req.query.year as string || "";
      const page = req.query.page as string || "1";

      if (!title.trim()) {
        res.status(400).json({ message: "Invalid request", code: "BAD_REQUEST" });
        return;
      }

      if (page && isNaN(Number(page))) {
        console.warn("Page is not a number: this is likely a frontend bug.");
        res.status(400).json({ message: "Invalid request", code: "BAD_REQUEST" });
        return;
      }

      const omdbResponse: OmdbResponse = await omdbService.getOmdbMovies(title, type, year, page);

      res.status(200).json(omdbResponse);
    } catch (error: any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      const code = error.code || "INTERNAL_ERROR";
      res.status(status).json({ message, code});
    }
  }
  async getMovieInfo(req: Request, res: Response): Promise<void> {
    try {

      const omdbResponse: OmdbResponse = await omdbService.getMovieInfo(req.params.id);
      res.status(200).json(omdbResponse);

    } catch (error:any) {
      const status = error.status || 500;
      const message = error.message || "Internal server error";
      const code = error.code || "INTERNAL_ERROR";
      res.status(status).json({ message, code });
    }
  }
}

export default new OmdbController();