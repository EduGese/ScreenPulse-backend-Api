import express from 'express';
import omdbController from './omdb.controller';
import { fetchingOmdbMoviesValidator, omdbMovieInfoValidator } from '../../validators/omdbValidators';
import { validate } from '../../middlewares/validate';


const _router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Omdb
 *   description: Operations related to OMDB API for media items (movies, series, games)
 */


/**
 * @swagger
 * /api/omdb:
 *   get:
 *     security: []
 *     tags:
 *       - Omdb
 *     summary: Search media items in OMDB
 *     description: Retrieve a list of media items (movies, series, games) from the OMDB API.
 *     parameters:
 *       - $ref: '#/components/parameters/OmdbTitleParam'
 *       - $ref: '#/components/parameters/OmdbTypeParam'
 *       - $ref: '#/components/parameters/OmdbYearParam'
 *       - $ref: '#/components/parameters/OmdbPageParam'
 *     responses:
 *       200:
 *         description: List of media items found or not found
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/OmdbItemMediaListResponse'
 *                 - $ref: '#/components/schemas/OmdbErrorResponse'
 *             examples:
 *               found:
 *                 summary: Results found
 *                 value:
 *                   Search:
 *                     - title: Inception
 *                       year: "2010"
 *                       imdbID: tt1375666
 *                       type: movie
 *                       poster: https://example.com/poster.jpg
 *                   totalResults: "1"
 *                   Response: "True"
 *               notFound:
 *                 summary: No results
 *                 value:
 *                   Response: "False"
 *                   Error: "Movie not found!"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       504:
 *         description: OMDB request timed out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OmdbTimeOutError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
_router.get('/', fetchingOmdbMoviesValidator, validate, omdbController.getOmdbItemMediaList);

/**
 * @swagger
 * /api/omdb/{id}:
 *   get:
 *     security: []
 *     tags:
 *       - Omdb
 *     summary: Get detailed info for a media item
 *     description: Retrieve detailed information for a specific media item (movie, series, etc.) from the OMDB API by IMDb ID.
 *     parameters:
 *       - $ref: '#/components/parameters/OmdbIdParam'
 *     responses:
 *       200:
 *         description: Detailed information of the media item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OmdbItemDetailResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
_router.get('/:id', omdbMovieInfoValidator, validate, omdbController.getOmdbItemMediaInfo);


export const router = _router;