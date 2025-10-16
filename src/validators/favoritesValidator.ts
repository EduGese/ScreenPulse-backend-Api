import { body, param, query } from 'express-validator';

export const createFavoriteValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 100 })
    .withMessage('Title must be at most 100 characters long'),
  body('year')
    .trim()
    .notEmpty()
    .withMessage('Year is required')
    .isString()
    .withMessage('Year must be a string')
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage('Year must be a valid year between 1900 and the current year'),
  body('imdbID')
    .trim()
    .notEmpty()
    .withMessage('imdbID is required')
    .isString()
    .withMessage('imdbID must be a string'),
  body('type')
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage('Type is required')
    .isString()
    .withMessage('Type must be a string')
    .isIn(['movie', 'series', 'game'])
    .withMessage('Type must be one of: movie, series, game'),
  body('poster')
    .trim()
    .notEmpty()
    .withMessage('Poster is required')
    .custom((value) => {
      if (value === 'N/A') {
        return true;
      }
      try {
        new URL(value);
        return true;
      } catch {
        throw new Error('Poster must be a valid URL or "N/A"');
      }
    })
];

export const getFavoritesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('pageSize')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('PageSize must be a positive integer between 1 and 100'),
  query('sortField')
    .optional()
    .isIn(['createdAt', 'title', 'year'])
    .withMessage('SortField must be one of: createdAt, title, year'),
  query('sortOrder')
    .optional()
    .isIn([1, -1])
    .withMessage('SortOrder must be either 1 (ascending) or -1 (descending)'),
  query('type')
    .optional()
    .isIn(['movie', 'series', 'game'])
    .withMessage('Type must be one of: movie, series, game'),
  query('searchTerm').optional().isString().withMessage('SearchTerm must be a string'),
];

export const deleteFavoriteValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Item id is required')
    .isString()
    .withMessage('Item id must be a string')
    .isMongoId()
    .withMessage('Item id must be a valid MongoDB ObjectId'),
];
export const updateFavoriteValidator = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Item id is required')
    .isString()
    .withMessage('Item id must be a string')
    .isMongoId()
    .withMessage('Item id must be a valid MongoDB ObjectId'),
  body('description')
    .exists({ checkNull: true })
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 200 })
    .withMessage('Description must be at most 200 characters long'),
];
