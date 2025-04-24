import express from 'express';

import favoritesController from './favorites.controller';

const _router= express.Router();

//Create 
_router.post('/:userId', favoritesController.createFavorite);

//Get all
_router.get('/:userId', favoritesController.getFavorites);

//Delete by Id
_router.delete('/:id/:userId', favoritesController.deleteFavorite);

//Update by Id
_router.patch('/:id/:userId', favoritesController.updateFavorite);


export const router = _router;
