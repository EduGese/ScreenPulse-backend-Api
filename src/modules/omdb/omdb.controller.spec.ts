import OmdbController from './omdb.controller';
import omdbService from './omdb.service';
import { Request, Response, NextFunction } from 'express';

// Mockear el servicio OMDb
jest.mock('./omdb.service');

describe('OmdbController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = {};
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getOmdbItemMediaList', () => {
    it('should return 200 and OMDb media list on success', async () => {
      req.query = {
        title: 'matrix',
        type: 'movie',
        year: '1999',
        page: '1',
      };
      const mockResponse = { Response: 'True', Search: [] };
      (omdbService.getOmdbItemMediaList as jest.Mock).mockResolvedValue(mockResponse);

      // Llamar al controlador
      await OmdbController.getOmdbItemMediaList(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      // Verificaciones
      expect(omdbService.getOmdbItemMediaList).toHaveBeenCalledWith('matrix', 'movie', '1999', '1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      req.query = {
        title: 'unknown',
        type: 'movie',
        year: '',
        page: '',
      };
      const error = new Error('OMDb fetch failed');
      (omdbService.getOmdbItemMediaList as jest.Mock).mockRejectedValue(error);

      await OmdbController.getOmdbItemMediaList(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(omdbService.getOmdbItemMediaList).toHaveBeenCalledWith('unknown', 'movie', '', '1');
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getOmdbItemMediaInfo', () => {
    it('should return 200 and OMDb media info on success', async () => {
      req.params = { id: 'tt1375666' };
      const mockResponse = {
        Title: 'Inception',
        Year: '2010',
        imdbID: 'tt1375666',
        Response: 'True',
      };
      (omdbService.getOmdbItemMediaInfo as jest.Mock).mockResolvedValue(mockResponse);

      await OmdbController.getOmdbItemMediaInfo(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(omdbService.getOmdbItemMediaInfo).toHaveBeenCalledWith('tt1375666');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResponse);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      req.params = { id: 'unknown' };
      const error = new Error('Service failed');
      (omdbService.getOmdbItemMediaInfo as jest.Mock).mockRejectedValue(error);

      await OmdbController.getOmdbItemMediaInfo(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(omdbService.getOmdbItemMediaInfo).toHaveBeenCalledWith('unknown');
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
