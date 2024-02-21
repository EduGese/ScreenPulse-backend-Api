import express from 'express';

import favoritesController from './favorites.controller';

const _router= express.Router();

//Create 
_router.post('/favorites/:id', favoritesController.createFavorite);

//Get all
_router.get('/favorites/:id', favoritesController.getFavorites);

//Delete by Id
_router.delete('/favorites/:id/:userId', favoritesController.deleteFavorite);

//Update by Id
_router.put('/favorites/:id/:userId', favoritesController.updateFavorite);


export const router = _router;
