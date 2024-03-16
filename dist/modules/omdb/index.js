"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.omdbModule = void 0;
const omdb_routes_1 = require("./omdb.routes");
const omdb_controller_1 = __importDefault(require("./omdb.controller"));
exports.omdbModule = { router: omdb_routes_1.router, OmdbController: omdb_controller_1.default };
