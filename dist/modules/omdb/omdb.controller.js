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
    getOmdbMovies(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const title = req.query.title || "";
                const type = req.query.type || "";
                const year = req.query.year || "";
                const page = req.query.page || "1";
                console.log('🧩 Query recibida:', { title, type, year, page });
                if (!title.trim()) {
                    res.status(400).json({ message: "Invalid request", code: "BAD_REQUEST" });
                    return;
                }
                if (page && isNaN(Number(page))) {
                    console.warn("Page is not a number: this is likely a frontend bug.");
                    res.status(400).json({ message: "Invalid request", code: "BAD_REQUEST" });
                    return;
                }
                console.log('📡 Haciendo petición a OMDB con:', { title, type, year, page });
                const omdbResponse = yield omdb_service_1.default.getOmdbMovies(title, type, year, page);
                console.log('✅ Respuesta de OMDB:', omdbResponse);
                res.status(200).json(omdbResponse);
            }
            catch (error) {
                const status = error.status || 500;
                const message = error.message || "Internal server error";
                const code = error.code || "INTERNAL_ERROR";
                res.status(status).json({ message, code });
            }
        });
    }
    getMovieInfo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const omdbResponse = yield omdb_service_1.default.getMovieInfo(req.params.id);
                res.status(200).json(omdbResponse);
            }
            catch (error) {
                const status = error.status || 500;
                const message = error.message || "Internal server error";
                const code = error.code || "INTERNAL_ERROR";
                res.status(status).json({ message, code });
            }
        });
    }
}
exports.default = new OmdbController();
