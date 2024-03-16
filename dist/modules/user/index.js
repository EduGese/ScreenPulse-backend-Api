"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModule = void 0;
const user_routes_1 = require("./user.routes");
const user_controller_1 = __importDefault(require("./user.controller"));
const user_service_1 = __importDefault(require("./user.service"));
exports.userModule = { router: user_routes_1.router, UserController: user_controller_1.default, UserService: user_service_1.default };
