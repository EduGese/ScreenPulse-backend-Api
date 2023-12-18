import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import config from './config/config';

//execute express
const app = express();
const port = config.server.port;


//routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my API :)');
});


// server listenening on config.server.port
app.listen(port, () => {
  console.log('Server is running on port', port);
});


// Mongodb conection
mongoose.connect(config.mongo.url || '')
.then(() => console.log("connected to Mongobd Atlas"))
.catch((error) => console.error(error));


