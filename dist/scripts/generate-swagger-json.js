"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_1 = require("../utils/swagger/swagger");
const swaggerSpec = (0, swagger_jsdoc_1.default)(swagger_1.options);
fs_1.default.writeFileSync('swagger.json', JSON.stringify(swaggerSpec, null, 2), 'utf-8');
console.log('swagger.json generated!');
