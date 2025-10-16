import { OmdbErrorResponse, OmdbItemDetail } from '../../interfaces/omdb.interface';
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
      const mockResponse: OmdbItemDetail = {
        Title: 'Inception',
        Year: '2010',
        Rated: 'PG-13',
        Released: '16 Jul 2010',
        Runtime: '148 min',
        Genre: 'Action, Adventure, Sci-Fi',
        Director: 'Christopher Nolan',
        Writer: 'Christopher Nolan',
        Actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
        Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
        Language: 'English, Japanese, French',
        Country: 'United States, United Kingdom',
        Awards: 'Won 4 Oscars. 159 wins & 220 nominations total',
        Poster:
          'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
        Ratings: [
          {
            Source: 'Internet Movie Database',
            Value: '8.8/10',
          },
          {
            Source: 'Rotten Tomatoes',
            Value: '87%',
          },
          {
            Source: 'Metacritic',
            Value: '74/100',
          },
        ],
        Metascore: '74',
        imdbRating: '8.8',
        imdbVotes: '2,731,250',
        imdbID: 'tt1375666',
        Type: 'movie',
        DVD: 'N/A',
        BoxOffice: '$292,587,330',
        Production: 'N/A',
        Website: 'N/A',
        Response: 'True',
        youtubeURLTrailer: 'https://youtube/trailer123',
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

    it('should return 200 when OMDB returns error response', async () => {
      req.params = { id: 'invalid_id' };
      const mockErrorResponse: OmdbErrorResponse = {
        Response: 'False',
        Error: 'Movie not found!',
      };

      (omdbService.getOmdbItemMediaInfo as jest.Mock).mockResolvedValue(mockErrorResponse);

      await OmdbController.getOmdbItemMediaInfo(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(omdbService.getOmdbItemMediaInfo).toHaveBeenCalledWith('invalid_id');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockErrorResponse);
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
