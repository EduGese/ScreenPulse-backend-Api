"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const userValidators_1 = require("../../validators/userValidators");
const validate_1 = require("../../middlewares/validate");
const swaggerAuth_1 = require("../../middlewares/swaggerAuth");
const _router = express_1.default.Router();
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management operations
 */
/**
 * @swagger
 * /api/user/login:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     tags:
 *       - User
 *     summary: User login
 *     description: Authenticate a user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
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
_router.post("/login", swaggerAuth_1.swaggerAuth, userValidators_1.loginValidator, validate_1.validate, user_controller_1.default.loginUser);
/**
 * @swagger
 * /api/user/register:
 *   post:
 *     security:
 *       - ApiKeyAuth: []
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Create a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
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
_router.post("/register", swaggerAuth_1.swaggerAuth, userValidators_1.registerValidator, validate_1.validate, user_controller_1.default.registertUser);
exports.router = _router;
