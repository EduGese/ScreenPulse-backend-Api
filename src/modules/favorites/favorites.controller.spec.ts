import FavoritesController from './favorites.controller';
import favoritesService from './favorites.service';
import { Request, Response, NextFunction } from 'express';

type MockAuthRequest = Partial<Request> & { userId?: string };



jest.mock('./favorites.service');

describe('FavoritesController', () => {
  let req: MockAuthRequest;
  let res: Partial<Response>;
  let next: jest.Mock;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    req = { params: {}, query: {}, body: {} };
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createFavorite', () => {
    it('should create a favorite and return 201 with data', async () => {
      req.params = { userId: '507f191e810c19729de860ea' };
      req.body = { imdbID: 'movie1', title: 'The Movie' };
      const createdFavorite = { _id: 'f1', imdbID: 'movie1', title: 'The Movie' };
      (favoritesService.createFavorite as jest.Mock).mockResolvedValue(createdFavorite);

      await FavoritesController.createFavorite(req as Request, res as Response, next as NextFunction);

      expect(favoritesService.createFavorite).toHaveBeenCalledWith('507f191e810c19729de860ea', req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdFavorite);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      req.params = { userId: '507f191e810c19729de860ea' };
      req.body = { imdbID: 'movie1', title: 'The Movie' };
      const error = new Error('Favorite exists');
      (favoritesService.createFavorite as jest.Mock).mockRejectedValue(error);

      await FavoritesController.createFavorite(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getFavorites', () => {
    it('should return 200 with favorites list and metadata', async () => {
      req.userId = '507f191e810c19729de860eb';
      req.query = { page: '2', pageSize: '5', sortField: 'title', sortOrder: '1', type: 'movie', searchTerm: 'test' };
      const stubFavorites = { favorites: [], totalFavorites: 1, currentPage: 2, pageSize: 5 };
      (favoritesService.getFavorites as jest.Mock).mockResolvedValue(stubFavorites);

      await FavoritesController.getFavorites(req as Request, res as Response, next as NextFunction);

      expect(favoritesService.getFavorites).toHaveBeenCalledWith(
        '507f191e810c19729de860eb',
        2,
        5,
        'title',
        1,
        'movie',
        'test'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(stubFavorites);
      expect(next).not.toHaveBeenCalled();
    });

    it('should use defaults if query params are missing', async () => {
      req.userId =  '507f191e810c19729de860ec';
      req.query = {};
      const stubFavorites = { favorites: [], totalFavorites: 0, currentPage: 1, pageSize: 10 };
      (favoritesService.getFavorites as jest.Mock).mockResolvedValue(stubFavorites);

      await FavoritesController.getFavorites(req as Request, res as Response, next as NextFunction);

      expect(favoritesService.getFavorites).toHaveBeenCalledWith(
        '507f191e810c19729de860ec',
        1,
        10,
        'createdAt',
        -1,
        undefined,
        undefined
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(stubFavorites);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      req.params = { userId: '507f191e810c19729de860ed' };
      req.query = {};
      const error = new Error('user not found');
      (favoritesService.getFavorites as jest.Mock).mockRejectedValue(error);

      await FavoritesController.getFavorites(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('deleteFavorite', () => {
    it('should delete favorite and send 200 with message', async () => {
      req.params = { id: '507f191e810c19729de860ab', userId: '507f191e810c19729de860ac' };
      (favoritesService.deleteFavorite as jest.Mock).mockResolvedValue(undefined);

      await FavoritesController.deleteFavorite(req as Request, res as Response, next as NextFunction);

      expect(favoritesService.deleteFavorite).toHaveBeenCalledWith('507f191e810c19729de860ab', '507f191e810c19729de860ac');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Element deleted successfully', data: {} });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      req.params = { id: '507f191e810c19729de860ab', userId: '507f191e810c19729de860ac' };
      const error = new Error('Not found');
      (favoritesService.deleteFavorite as jest.Mock).mockRejectedValue(error);

      await FavoritesController.deleteFavorite(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('updateFavorite', () => {
    it('should update favorite and send 200 with updated item', async () => {
      req.params = { id: '507f191e810c19729de860dd', userId: '507f191e810c19729de860ee' };
      req.body = { description: 'Nueva descripción' };
      const updated = { _id: '507f191e810c19729de860dd', description: 'Nueva descripción' };
      (favoritesService.updateFavorite as jest.Mock).mockResolvedValue(updated);

      await FavoritesController.updateFavorite(req as Request, res as Response, next as NextFunction);

      expect(favoritesService.updateFavorite).toHaveBeenCalledWith(
        '507f191e810c19729de860dd',
        '507f191e810c19729de860ee',
        'Nueva descripción'
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if service fails', async () => {
      req.params = { id: '507f191e810c19729de860ff', userId: '507f191e810c19729de86100' };
      req.body = { description: 'New' };
      const error = new Error('update failed');
      (favoritesService.updateFavorite as jest.Mock).mockRejectedValue(error);

      await FavoritesController.updateFavorite(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
