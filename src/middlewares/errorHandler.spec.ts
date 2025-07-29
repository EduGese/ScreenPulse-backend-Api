import { Request, Response, NextFunction } from 'express';
import { errorHandler } from './errorHandler'; // Ajusta el path si es necesario
import { ApiError } from '../errors/apiError';

describe('Global Error Handler Middleware', () => {
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
      headersSent: false,
    } as unknown as Response;
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next if headers are already sent', () => {
    res.headersSent = true;
    const err = new Error('Test error');

    errorHandler(err, req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalledWith(err);
    expect(statusMock).not.toHaveBeenCalled();
    expect(jsonMock).not.toHaveBeenCalled();
  });

  it('should return error response for ApiError', () => {
    const apiError = new ApiError(400, 'Bad Request', 'BAD_REQUEST');

    errorHandler(apiError, req as Request, res as Response, next as NextFunction);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Bad Request',
      code: 'BAD_REQUEST',
      status: 400,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 for native Error', () => {
    const error = new Error('Native error');

    errorHandler(error, req as Request, res as Response, next as NextFunction);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Native error',
      code: 'INTERNAL_ERROR',
      status: 500,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 500 for unknown error object', () => {
    const unknownError = { some: 'error' };

    errorHandler(unknownError, req as Request, res as Response, next as NextFunction);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      status: 500,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
