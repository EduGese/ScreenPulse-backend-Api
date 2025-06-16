"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("../config/config"));
const allowedOrigins = [config_1.default.client.url, config_1.default.github.url];
console.log('CORS Middleware initialized with allowed origins:', allowedOrigins);
const corsOptions = {
    origin: (origin, callback) => {
        console.log('Incoming origin:', origin);
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.log('CORS error: Origin not allowed:', origin);
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    optionsSuccessStatus: 204,
    maxAge: 500,
};
exports.default = (0, cors_1.default)(corsOptions);
