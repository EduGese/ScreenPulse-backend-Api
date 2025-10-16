import { param, query } from 'express-validator';

export const fetchingOmdbMoviesValidator = [
  query('title').trim().notEmpty().withMessage('Title is required'),
  query('type')
    .trim()
    .toLowerCase()
    .optional()
    .isString()
    .withMessage('Type must be one of: movie, series, game')
    .isIn(['movie', 'series', 'game', 'all'])
    .withMessage('Type must be a string and one of: movie, series, game, all'),
  query('year')
    .trim()
    .optional()
    .custom(value => {
      if (value === '') return true;
      const year = Number(value);
      const currentYear = new Date().getFullYear();
      if (!Number.isInteger(year) || year < 1900 || year > currentYear) {
        throw new Error(`Year must be a valid year between 1900 and ${currentYear}`);
      }
      return true;
    }),
  query('page')
    .trim()
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Page must be a number between 1 and 100'),
];

export const omdbMovieInfoValidator = [
  param('id').trim().notEmpty().withMessage('Media Item ID is required'),
];
