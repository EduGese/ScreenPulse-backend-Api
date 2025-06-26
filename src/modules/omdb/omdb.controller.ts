import { Request, Response, NextFunction } from 'express';

import omdbService from './omdb.service';
import { OmdbItemDetailResponse, OmdbItemMediaListResponse } from '../../interfaces/omdb.interface';

class OmdbController {
  async getOmdbItemMediaList(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const title = (req.query.title as string) || '';
      const type = (req.query.type as string) || '';
      const year = (req.query.year as string) || '';
      const page = (req.query.page as string) || '1';

      const omdbResponse: OmdbItemMediaListResponse = await omdbService.getOmdbItemMediaList(
        title,
        type,
        year,
        page,
      );

      res.status(200).json(omdbResponse);
    } catch (error: unknown) {
      next(error);
    }
  }
  async getOmdbItemMediaInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const omdbResponse: OmdbItemDetailResponse = await omdbService.getOmdbItemMediaInfo(
        req.params.id,
      );
      res.status(200).json(omdbResponse);
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new OmdbController();
