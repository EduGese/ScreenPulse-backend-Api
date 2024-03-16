"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const omdb_service_1 = __importDefault(require("./omdb.service"));
class OmdbController {
    /**
     * @summary Find documents from a collection
     * @description Get documents
     * @param {express.Request} req is the request of the operation
     * @param {express.Response} res is the response of the operation
     * @param {express.Next} next is the middleware to continue with code execution
     * @returns {Array} with all documents matching the conditions
     */
    getOmdbMovies(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) { //Check that body is undefined or null, is an object type and not empty
                    const error = new Error('A non-empty JSON body is mandatory.');
                    return next(error);
                }
                const omdbResponse = yield omdb_service_1.default.getOmdbMovies(req.body);
                res.status(200).json(omdbResponse);
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
    getMovieInfo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const omdbResponse = yield omdb_service_1.default.getMovieInfo(req.params.id);
                res.status(200).json(omdbResponse);
            }
            catch (error) {
                next(error);
                return;
            }
        });
    }
}
exports.default = new OmdbController();
