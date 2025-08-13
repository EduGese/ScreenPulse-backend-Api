import UserController from './user.controller';
import UserService from './user.service';
import { Request, Response, NextFunction } from 'express';

jest.mock('./user.service');

describe('UserController', () => {
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

  describe('loginUser', () => {
    it('should call UserService.loginUser with correct parameters and return 200 with response', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const mockResponse = {
        token: 'jwt-token',
        user: {
          _id: '1',
          email: 'test@example.com',
          name: 'Test User',
        },
      };
      (UserService.loginUser as jest.Mock).mockResolvedValue(mockResponse);

      await UserController.loginUser(req as Request, res as Response, next as NextFunction);

      expect(UserService.loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockResponse);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if UserService.loginUser throws', async () => {
      req.body = { email: 'test@example.com', password: 'password123' };
      const error = new Error('Invalid credentials');
      (UserService.loginUser as jest.Mock).mockRejectedValue(error);

      await UserController.loginUser(req as Request, res as Response, next as NextFunction);

      expect(UserService.loginUser).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(next).toHaveBeenCalledWith(error);
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

  describe('registertUser', () => {
    it('should call UserService.registerUser with correct request body and return 201 with response', async () => {
      req.body = { email: 'new@example.com', password: 'pass!123', name: 'New User' };
      const mockResponse = {
        _id: '2',
        email: 'new@example.com',
        name: 'New User',
        role: 'user',
        favorites: [],
        __v: 0,
      };
      (UserService.registerUser as jest.Mock).mockResolvedValue(mockResponse);

      await UserController.registertUser(req as Request, res as Response, next as NextFunction);

      expect(UserService.registerUser).toHaveBeenCalledWith(req.body);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockResponse);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error if UserService.registerUser throws', async () => {
      req.body = { email: 'new@example.com', password: 'pass!123', name: 'New User' };
      const error = new Error('User already exists');
      (UserService.registerUser as jest.Mock).mockRejectedValue(error);

      await UserController.registertUser(req as Request, res as Response, next as NextFunction);

      expect(UserService.registerUser).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalledWith(error);
      expect(statusMock).not.toHaveBeenCalled();
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });
});
