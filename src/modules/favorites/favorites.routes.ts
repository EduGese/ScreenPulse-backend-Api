import express from 'express';

import favoritesController from './favorites.controller';

const _router= express.Router();

//Create 
_router.post('/favorites', favoritesController.createFavorite);

//Get all
_router.get('/favorites/:id', favoritesController.getFavorites);

//Get by Id
//_router.get('/favorites/:id', favoritesController.getFavoriteById);

//Delete by Id
_router.delete('/favorites/:id/:userId', favoritesController.deleteFavorite);

//Update by Id
_router.put('/favorites/:id', favoritesController.updateFavorite);


export const router = _router;
