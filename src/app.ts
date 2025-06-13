import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './config/config';
import { favoritesModule, omdbModule, userModule } from './modules';
import { errorHandler } from "./middlewares/errorHandler";
import setupSwagger from './utils/swagger/swagger';


//execute express
const app = express();
const port = config.server.port;

//CORS
var corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
  maxAge: 500,
  origin: config.client.url,
}
app.use(cors(corsOptions));
app.use(express.json());

//routes
app.use('/api/favorites', favoritesModule.router);
app.use('/api/omdb', omdbModule.router);
app.use('/api/user', userModule.router);

setupSwagger(app);

app.use(errorHandler);

// server listenening on config.server.port
app.listen(port, () => {
  console.log('Server is running on port', port);
});


// Mongodb conection
mongoose.connect(config.mongo.url || '')
.then(() => console.log("connected to Mongobd Atlas"))
.catch((error) => console.error(error));


