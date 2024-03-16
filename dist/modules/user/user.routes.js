"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("./user.controller"));
const _router = express_1.default.Router();
//Login
_router.post("/user/login", user_controller_1.default.loginUser);
//Register
_router.post("/user/register", user_controller_1.default.registertUser);
exports.router = _router;
