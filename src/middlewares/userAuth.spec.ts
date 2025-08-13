import { Request, Response } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { userAuth } from './userAuth';
import { ApiError } from '../errors/apiError';

interface MockAuthenticatedRequest extends Request {
  userId?: string;
}

jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt> & {
  verify: jest.Mock<{ user_id: string }, [string, string, import('jsonwebtoken').VerifyOptions?]>;
};

describe('userAuth middleware', () => {
  let req: Partial<MockAuthenticatedRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { headers: {} };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('calls next with ApiError if no token is provided', () => {
    req.headers = {};
    userAuth(req as MockAuthenticatedRequest, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const errArg = next.mock.calls[0][0] as ApiError;
    expect(errArg.status).toBe(401);
    expect(errArg.code).toBe('AUTH_MISSING_TOKEN');
  });

  it('calls next with ApiError if token is invalid', () => {
    req.headers = { authorization: 'Bearer some.invalid.token' };
    mockedJwt.verify.mockImplementation(() => {
      throw new JsonWebTokenError('Invalid token');
    });

    userAuth(req as MockAuthenticatedRequest, res as Response, next);

    expect(mockedJwt.verify).toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    const errArg = next.mock.calls[0][0] as ApiError;
    expect(errArg.status).toBe(401);
    expect(errArg.code).toBe('AUTH_INVALID_TOKEN');
  });

  it('adds userId to request and calls next if token is valid', () => {
    req.headers = { authorization: 'Bearer valid.token.here' };
    mockedJwt.verify.mockReturnValue({ user_id: '12345' });

    userAuth(req as MockAuthenticatedRequest, res as Response, next);

    expect(mockedJwt.verify).toHaveBeenCalledWith('valid.token.here', process.env.TOKEN_SECRET);
    expect(req.userId).toBe('12345');
    expect(next).toHaveBeenCalledWith();
  });
});
