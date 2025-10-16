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

//CORS Middleware
app.use(corsMiddleware);

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
});

// Mongodb conection
mongoose
  .connect(config.mongo.url || '')
  .then(() => console.log('connected to Mongobd Atlas'))
  .catch(error => console.error(error));
