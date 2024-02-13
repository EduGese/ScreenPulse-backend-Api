import express from 'express';
import omdbController from './omdb.controller';


const _router= express.Router();


//Get all Movies from omdb API
_router.post('/omdb', omdbController.getOmdbMovies);


export const router = _router;