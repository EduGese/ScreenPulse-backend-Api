import express from 'express';

import favoritesController from './favorites.controller';
import { createFavoriteValidator, deleteFavoriteValidator, getFavoritesValidator } from '../../validators/favoritesValidator';
import { validate } from '../../middlewares/validate';

const _router= express.Router();

//Create 
_router.post('/:userId', createFavoriteValidator, validate, favoritesController.createFavorite);

//Get all
_router.get('/:userId', getFavoritesValidator, validate, favoritesController.getFavorites);

//Delete by Id
_router.delete('/:id/:userId', deleteFavoriteValidator, validate, favoritesController.deleteFavorite);

//Update by Id
_router.patch('/:id/:userId', favoritesController.updateFavorite);


export const router = _router;
