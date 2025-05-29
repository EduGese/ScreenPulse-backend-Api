import express from 'express';
import omdbController from './omdb.controller';
import { fetchingOmdbMoviesValidator, omdbMovieInfoValidator } from '../../validators/omdbValidators';
import { validate } from '../../middlewares/validate';


const _router= express.Router();


//Get all Movies from omdb API
_router.get('/', fetchingOmdbMoviesValidator, validate, omdbController.getOmdbMovies);

//Get movie info from omdb API
_router.get('/:id', omdbMovieInfoValidator, validate, omdbController.getMovieInfo);


export const router = _router;