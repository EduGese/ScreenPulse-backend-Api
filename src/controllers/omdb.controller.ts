import { Request, Response, NextFunction } from "express";



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
      
      res.status(200).json();
    } catch (error) {
      next(error);
      return;
    }
  }

   
}

export default new OmdbController();