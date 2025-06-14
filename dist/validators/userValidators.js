"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerValidator = exports.loginValidator = void 0;
const express_validator_1 = require("express-validator");
exports.loginValidator = [
    (0, express_validator_1.body)('email')
        .trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
];
exports.registerValidator = [
    (0, express_validator_1.body)('name')
        .trim().notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .isLength({ min: 2, max: 15 }).withMessage('Name must be at least 2 characters long and 15 maximum'),
    (0, express_validator_1.body)('email')
        .trim().notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
];
