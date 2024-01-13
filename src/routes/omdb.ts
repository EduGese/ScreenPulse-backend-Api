import express from 'express';
import omdbController from '../controllers/omdb.controller';


const _router= express.Router();


//Get all Movies from omdb API
_router.get('/omdb', omdbController.getOmdbMovies);


export const router = _router;