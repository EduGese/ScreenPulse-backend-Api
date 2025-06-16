import express from 'express';

import favoritesController from './favorites.controller';
import { createFavoriteValidator, deleteFavoriteValidator, getFavoritesValidator, updateFavoriteValidator } from '../../validators/favoritesValidator';
import { validate } from '../../middlewares/validate';
import { swaggerAuth } from '../../middlewares/swaggerAuth';

const _router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Favorites
 *   description: API endpoints for managing user favorites.
 */


/**
 * @swagger
 * /api/favorites/{userId}:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     tags: [Favorites]
 *     summary: Create a new favorite
 *     description: Create a new favorite for a user.
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFavoriteRequest'
 *     responses:
 *       201:
 *         description: Favorite created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateFavoriteResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               error: "Validation failed"
 *               code: "VALIDATION_ERROR"
 *               status: 400
 *               errors:
 *                 - msg: "title is required"
 *                   param: "title"
 *                   location: "body"
 *                 - msg: "imdbID must be a valid string"
 *                   param: "imdbID"
 *                   location: "body"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotFound'
 *       409:
 *         description: Favorite already exists for this user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FavoriteAlreadyExists'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
_router.post('/:userId', swaggerAuth, createFavoriteValidator, validate, favoritesController.createFavorite);

/**
 * @swagger
 * /api/favorites/{userId}:
 *   get:
 *     security:
 *       - ApiKeyAuth: []
 *     tags:
 *       - Favorites
 *     summary: Get user's favorites
 *     description: Retrieve a paginated list of a user's favorites, total count, current page, and page size with optional filtering and sorting.
 *     parameters:
 *       - $ref: '#/components/parameters/UserIdParam'
 *       - $ref: '#/components/parameters/FavoritesPageParam'
 *       - $ref: '#/components/parameters/FavoritesPageSizeParam'
 *       - $ref: '#/components/parameters/FavoritesSortFieldParam'
 *       - $ref: '#/components/parameters/FavoritesSortOrderParam'
 *       - $ref: '#/components/parameters/FavoritesMediaTypeParam'
 *       - $ref: '#/components/parameters/FavoritesSearchTermParam'
 *     responses:
 *       200:
 *         description: Favorites retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetFavoritesResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               error: "Validation failed"
 *               code: "VALIDATION_ERROR"
 *               status: 400
 *               errors:
 *                 - msg: "userId must be a valid MongoDB ObjectId"
 *                   param: "userId"
 *                   location: "path"
 *                 - msg: "page must be a positive integer"
 *                   param: "page"
 *                   location: "query"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserNotFound'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
_router.get('/:userId', swaggerAuth, getFavoritesValidator, validate, favoritesController.getFavorites);

/**
 * @swagger
 * /api/favorites/{id}/{userId}:
 *   delete:
 *     security:
 *       - ApiKeyAuth: []
 *     tags:
 *       - Favorites
 *     summary: Delete a favorite
 *     description: Deletes a favorite item by its ID for a specific user. If the favorite is the last one associated with the media item, the media item is also deleted.
 *     parameters:
 *       - $ref: '#/components/parameters/MediaItemIdParams'
 *       - $ref: '#/components/parameters/UserIdParam'
 *     responses:
 *       200:
 *         description: Favorite deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteFavoriteResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               error: "Validation failed"
 *               code: "VALIDATION_ERROR"
 *               status: 400
 *               errors:
 *                 - msg: "id must be a valid MongoDB ObjectId"
 *                   param: "id"
 *                   location: "path"
 *                 - msg: "userId must be a valid MongoDB ObjectId"
 *                   param: "userId"
 *                   location: "path"
 *       404:
 *         description: Favorite or user not found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/FavoriteNotFound'
 *                 - $ref: '#/components/schemas/UserNotFound'
 *             examples:
 *               FavoriteNotFound:
 *                 summary: Favorite not found
 *                 value:
 *                   status: 404
 *                   message: "Favorite not found"
 *                   code: "FAVORITE_NOT_FOUND"
 *               UserNotFound:
 *                 summary: User not found
 *                 value:
 *                   status: 404
 *                   message: "User not found"
 *                   code: "USER_NOT_FOUND"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
_router.delete('/:id/:userId', swaggerAuth, deleteFavoriteValidator, validate, favoritesController.deleteFavorite);

/**
 * @swagger
 * /api/favorites/{id}/{userId}:
 *   patch:
 *     security:
 *       - ApiKeyAuth: []
 *     tags:
 *      - Favorites
 *     summary: Update a favorite
 *     description: |
 * 
 *       Updates the description of a favorite item for a specific user.
 *       - If the favorite has no description, this endpoint will add one.
 *       - If the request body contains an empty string (""), the existing description will be removed.
 *       - If the request body contains a new string, it will overwrite the previous description.
 *       The description is a user-generated note about the favorite media item.
 *     parameters:
 *       - $ref: '#/components/parameters/MediaItemIdParams'
 *       - $ref: '#/components/parameters/UserIdParam'
 *     requestBody:
 *       description: Description of the favorite item to be updated. Can be an empty string to remove the description.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFavoriteRequest'
 *           examples:
 *             addOrUpdate:    
 *               summary: Add or update description
 *               value:
 *                 description: "A mind-bending thriller about dreams within dreams."
 *             remove:
 *               summary: Remove description
 *               value:
 *                 description: ""   
 *     responses:
 *       200:
 *         description: Favorite updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateFavoriteResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *             example:
 *               error: "Validation failed"
 *               code: "VALIDATION_ERROR"
 *               status: 400
 *               errors:
 *                 - msg: "id must be a valid MongoDB ObjectId"
 *                   param: "id"
 *                   location: "path"
 *                 - msg: "userId must be a valid MongoDB ObjectId"
 *                   param: "userId"
 *                   location: "path"
 *                 - msg: "Description must be a string"
 *                   param: "description"
 *                   location: "body"
 *       404:
 *         description: Favorite or user not found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/FavoriteNotFound'
 *                 - $ref: '#/components/schemas/UserNotFound'
 *             examples:
 *               FavoriteNotFound:
 *                 summary: Favorite not found
 *                 value:
 *                   error: "Favorite not found or could not be updated"
 *                   code: "FAVORITE_NOT_FOUND"
 *                   status: 404
 *               UserNotFound:
 *                 summary: User not found
 *                 value:
 *                   error: "User not found"
 *                   code: "USER_NOT_FOUND"
 *                   status: 404
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
_router.patch('/:id/:userId', swaggerAuth, updateFavoriteValidator, validate,favoritesController.updateFavorite);


export const router = _router;
