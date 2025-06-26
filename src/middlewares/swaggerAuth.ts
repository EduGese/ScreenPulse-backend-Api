import { Request, Response, NextFunction } from 'express';
import config from '../config/config';

const EXEMPT_ORIGIN = config.client.url || 'http://localhost:4200';
/*
 * Middleware to authenticate requests to Swagger UI in production.
 * It checks for an API key in the request headers and compares it with the one stored in environment variables.
 * If the API key is invalid or not provided, it returns a 401 Unauthorized response.
 */
export const swaggerAuth = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  const isDev = process.env.NODE_ENV !== 'production';
  if (origin === EXEMPT_ORIGIN || (isDev && !origin)) {
    console.log('Swagger Auth Middleware: Exempting origin', origin);
    return next();
  }
  if (req.method !== 'GET') {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
      return res
        .status(401)
        .json({ error: 'Invalid API KEY', code: 'INVALID_API_KEY', status: 401 });
    }
  }
  next();
};
