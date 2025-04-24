import express from 'express';
import omdbController from './omdb.controller';


const _router= express.Router();


//Get all Movies from omdb API
_router.get('/omdb', (req, res, next) => {
  console.log('🚀 Petición recibida en /api/omdb con query:', req.query);
  next();
}, omdbController.getOmdbMovies);


//Get movie info from omdb API
_router.get('/omdb/:id', omdbController.getMovieInfo);


export const router = _router;