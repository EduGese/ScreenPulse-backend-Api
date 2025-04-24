import express from 'express';
import omdbController from './omdb.controller';


const _router= express.Router();


//Get all Movies from omdb API
_router.get('/', omdbController.getOmdbMovies);

//Get movie info from omdb API
_router.get('/:id', omdbController.getMovieInfo);


export const router = _router;