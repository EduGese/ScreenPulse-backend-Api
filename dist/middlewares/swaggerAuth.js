"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerAuth = void 0;
const EXEMPT_ORIGIN = 'http://localhost:4200';
/*
  * Middleware to authenticate requests to Swagger UI in production.
  * It checks for an API key in the request headers and compares it with the one stored in environment variables.
  * If the API key is invalid or not provided, it returns a 401 Unauthorized response.
  */
const swaggerAuth = (req, res, next) => {
    const origin = req.headers.origin;
    if (origin === EXEMPT_ORIGIN) {
        //console.log('Swagger Auth Middleware: Exempting origin', origin);
        return next();
    }
    if (req.method !== 'GET') {
        //console.log('Swagger Auth Middleware: Only GET requests are allowed');
        const apiKey = req.headers['x-api-key'];
        if (apiKey !== process.env.API_KEY) {
            return res.status(401).json({ error: 'Invalid API KEY', code: 'INVALID_API_KEY', status: 401 });
        }
    }
    next();
};
exports.swaggerAuth = swaggerAuth;
