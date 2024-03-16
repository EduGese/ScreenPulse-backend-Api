"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const favorites_controller_1 = __importDefault(require("./favorites.controller"));
const _router = express_1.default.Router();
//Create 
_router.post('/favorites/:id', favorites_controller_1.default.createFavorite);
//Get all
_router.get('/favorites/:id', favorites_controller_1.default.getFavorites);
//Delete by Id
_router.delete('/favorites/:id/:userId', favorites_controller_1.default.deleteFavorite);
//Update by Id
_router.put('/favorites/:id/:userId', favorites_controller_1.default.updateFavorite);
exports.router = _router;
