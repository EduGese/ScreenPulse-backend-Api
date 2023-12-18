import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


//execute express
const app = express();
const port = process.env.PORT || 9000;


//routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my API :)');
});


// server listenening on port 9000
app.listen(port, () => {
  console.log('Server is running on port', port);
});


// Mongodb conection
mongoose.connect(process.env.MONGODB_URI || '')
.then(()=> console.log("connected to Mongobd Atlas"))
.catch((error)=> console.error(error));


