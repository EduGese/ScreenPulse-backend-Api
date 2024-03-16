"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoritesModule = void 0;
const favorites_routes_1 = require("./favorites.routes");
const favorites_controller_1 = __importDefault(require("./favorites.controller"));
exports.favoritesModule = { router: favorites_routes_1.router, favoritesController: favorites_controller_1.default };
