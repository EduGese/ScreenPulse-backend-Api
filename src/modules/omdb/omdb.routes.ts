import express from 'express';
import omdbController from './omdb.controller';


const _router= express.Router();


//Get all Movies from omdb API
_router.post('/omdb', omdbController.getOmdbMovies);

//Get movie info from omdb API
_router.get('/omdb/:id', omdbController.getMovieInfo);


export const router = _router;