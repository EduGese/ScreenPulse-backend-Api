import express from 'express';
import mongoose from 'mongoose';

import config from './config/config';
import { favoritesModule, omdbModule, userModule } from './modules';
import { errorHandler } from './middlewares/errorHandler';
import setupSwagger from './utils/swagger/swagger';
import corsMiddleware from './middlewares/cors';

//execute express
const app = express();
const port = config.server.port;
console.log('Environment', process.env.NODE_ENV);
console.log('config client', config.client.url);
console.log('config github', config.github.url);

// Middleware to log the origin header for debugging purposes
app.use((req, res, next) => {
  console.log('Origin header:', req.headers.origin);
  next();
});

//CORS Middleware
app.use(corsMiddleware);
//app.use(cors());

/// Middleware to parse JSON bodies
app.use(express.json());

//routes
app.use('/api/favorites', favoritesModule.router);
app.use('/api/omdb', omdbModule.router);
app.use('/api/user', userModule.router);

// Swagger setup
setupSwagger(app);

// Error handling middleware
app.use(errorHandler);

// server listenening on config.server.port
app.listen(port, () => {
  console.log('Server is running on port', port);
  // console.log('CORS enabled for:', config.github.url);
});

// Mongodb conection
mongoose
  .connect(config.mongo.url || '')
  .then(() => console.log('connected to Mongobd Atlas'))
  .catch((error) => console.error(error));
