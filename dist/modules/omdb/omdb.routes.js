"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const omdb_controller_1 = __importDefault(require("./omdb.controller"));
const _router = express_1.default.Router();
//Get all Movies from omdb API
_router.post('/omdb', omdb_controller_1.default.getOmdbMovies);
//Get movie info from omdb API
_router.get('/omdb/:id', omdb_controller_1.default.getMovieInfo);
exports.router = _router;
