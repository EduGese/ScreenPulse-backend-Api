"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFavoriteValidator = exports.deleteFavoriteValidator = exports.getFavoritesValidator = exports.createFavoriteValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createFavoriteValidator = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isString().withMessage('Title must be a string')
        .isLength({ max: 100 }).withMessage('Title must be at most 100 characters long'),
    (0, express_validator_1.body)('year')
        .trim()
        .notEmpty().withMessage('Year is required')
        .isString().withMessage('Year must be a string')
        .isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Year must be a valid year between 1900 and the current year'),
    (0, express_validator_1.body)('imdbID')
        .trim()
        .notEmpty().withMessage('imdbID is required')
        .isString().withMessage('imdbID must be a string'),
    (0, express_validator_1.body)('type')
        .trim().toLowerCase()
        .notEmpty().withMessage('Type is required')
        .isString().withMessage('Type must be a string')
        .isIn(['movie', 'series', 'game']).withMessage('Type must be one of: movie, series, game'),
    (0, express_validator_1.body)('poster')
        .trim()
        .notEmpty().withMessage('Poster is required')
        .isURL().withMessage('Poster must be a valid URL'),
    (0, express_validator_1.param)('userId')
        .trim()
        .notEmpty().withMessage('userId is required')
        .isString().withMessage('userId must be a string')
        .isMongoId().withMessage('userId must be a valid MongoDB ObjectId'),
];
exports.getFavoritesValidator = [
    (0, express_validator_1.param)('userId')
        .trim()
        .notEmpty().withMessage('userId is required')
        .isString().withMessage('userId must be a string')
        .isMongoId().withMessage('userId must be a valid MongoDB ObjectId'),
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('pageSize')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('PageSize must be a positive integer between 1 and 100'),
    (0, express_validator_1.query)('sortField')
        .optional()
        .isIn(['createdAt', 'title', 'year']).withMessage('SortField must be one of: createdAt, title, year'),
    (0, express_validator_1.query)('sortOrder')
        .optional()
        .isIn([1, -1]).withMessage('SortOrder must be either 1 (ascending) or -1 (descending)'),
    (0, express_validator_1.query)('type')
        .optional()
        .isIn(['movie', 'series', 'game']).withMessage('Type must be one of: movie, series, game'),
    (0, express_validator_1.query)('searchTerm')
        .optional()
        .isString().withMessage('SearchTerm must be a string'),
];
exports.deleteFavoriteValidator = [
    (0, express_validator_1.param)('id')
        .trim()
        .notEmpty().withMessage('Item id is required')
        .isString().withMessage('Item id must be a string')
        .isMongoId().withMessage('Item id must be a valid MongoDB ObjectId'),
    (0, express_validator_1.param)('userId')
        .trim()
        .notEmpty().withMessage('userId is required')
        .isString().withMessage('userId must be a string')
        .isMongoId().withMessage('userId must be a valid MongoDB ObjectId'),
];
exports.updateFavoriteValidator = [
    (0, express_validator_1.param)('id')
        .trim()
        .notEmpty().withMessage('Item id is required')
        .isString().withMessage('Item id must be a string')
        .isMongoId().withMessage('Item id must be a valid MongoDB ObjectId'),
    (0, express_validator_1.param)('userId')
        .trim()
        .notEmpty().withMessage('userId is required')
        .isString().withMessage('userId must be a string')
        .isMongoId().withMessage('userId must be a valid MongoDB ObjectId'),
    (0, express_validator_1.body)('description')
        .exists({ checkNull: true })
        .withMessage('Description is required')
        .isString().withMessage('Description must be a string')
        .isLength({ max: 200 }).withMessage('Description must be at most 200 characters long')
];
