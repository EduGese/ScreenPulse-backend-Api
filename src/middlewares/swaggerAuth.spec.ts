import { Request, Response, NextFunction } from 'express';
import { swaggerAuth } from './swaggerAuth';

const OLD_ENV = process.env;

describe('swaggerAuth middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  const apiKey = 'test-api-key';
  const clientUrl = 'http://localhost:4200';

  beforeEach(() => {
    process.env = { ...OLD_ENV, API_KEY: apiKey, NODE_ENV: 'production' };
    req = { headers: {}, method: 'POST', params: {}, body: {} };
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    res = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;
    next = jest.fn();
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should exempt whitelisted origin and call next', () => {
    req.headers = { origin: clientUrl };
    swaggerAuth(req as Request, res as Response, next as NextFunction);
    expect(next).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should exempt if NODE_ENV != production and origin is undefined', () => {
    process.env.NODE_ENV = 'development';
    req.headers = {};
    swaggerAuth(req as Request, res as Response, next as NextFunction);
    expect(next).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should allow GET methods regardless of API_KEY', () => {
    req.headers = { origin: 'http://another.com' };
    req.method = 'GET';
    swaggerAuth(req as Request, res as Response, next as NextFunction);
    expect(next).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should reject POST without API_KEY and return 401', () => {
    req.headers = { origin: 'http://malicious.com' };
    req.method = 'POST';
    swaggerAuth(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid API KEY',
      code: 'INVALID_API_KEY',
      status: 401,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should reject POST with invalid API_KEY and return 401', () => {
    req.headers = { origin: 'http://malicious.com', 'x-api-key': 'wrong-key' };
    req.method = 'POST';
    swaggerAuth(req as Request, res as Response, next as NextFunction);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Invalid API KEY',
      code: 'INVALID_API_KEY',
      status: 401,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should allow POST when API_KEY is valid', () => {
    req.headers = { origin: 'http://malicious.com', 'x-api-key': apiKey };
    req.method = 'POST';
    swaggerAuth(req as Request, res as Response, next as NextFunction);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});
