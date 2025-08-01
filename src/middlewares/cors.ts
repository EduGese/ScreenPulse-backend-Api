import cors from 'cors';
import config from '../config/config';

const allowedOrigins = [config.client.url, 'https://edugese.github.io'];

export function isAllowedOrigin(origin?: string): boolean {
  if (!origin) return true;
  return allowedOrigins.includes(origin);
}

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    //console.log('Incoming origin:', origin);
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }
    //console.log('CORS error: Origin not allowed:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  optionsSuccessStatus: 204,
  maxAge: 500,
};

export default cors(corsOptions);
