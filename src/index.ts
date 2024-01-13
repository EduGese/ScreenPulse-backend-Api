import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import config from './config/config';
import { router } from './routes/favorites';
import cors from 'cors';
import { router2 } from './routes/omdb';
//execute express
const app = express();
const port = config.server.port;

//CORS
var corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
  maxAge: 500
}
app.use(cors(corsOptions));

//routes
app.use(express.json());
app.use('/api', router);
app.use('/api2', router2);


// server listenening on config.server.port
app.listen(port, () => {
  console.log('Server is running on port', port);
});


// Mongodb conection
mongoose.connect(config.mongo.url || '')
.then(() => console.log("connected to Mongobd Atlas"))
.catch((error) => console.error(error));


