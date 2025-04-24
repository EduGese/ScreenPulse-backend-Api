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
const axios_1 = __importDefault(require("axios"));
class OmdbService {
    getOmdbMovies(title, type, year, page) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            type = type === "all" ? '' : type;
            try {
                const response = yield axios_1.default.get(process.env.OMDB_URL || "", {
                    params: {
                        apikey: process.env.OMDB_APIKEY,
                        s: title.toLocaleLowerCase(),
                        type: type.toLocaleLowerCase(),
                        y: year,
                        page: page,
                    },
                });
                if (response.data.Search) {
                    response.data.Search = response.data.Search.map((item) => {
                        const newItem = {};
                        for (const key in item) {
                            if (['Title', 'Year', 'Type', 'Poster'].includes(key)) {
                                newItem[key.toLowerCase()] = item[key];
                            }
                            else {
                                newItem[key] = item[key];
                            }
                        }
                        return newItem;
                    });
                }
                return response.data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                        throw { status: 401, message: "Invalid OMDB API key", code: "INVALID_API_KEY" };
                    }
                    if (error.code === "ECONNABORTED") {
                        throw { status: 504, message: "OMDB request timed out", code: "TIMEOUT" };
                    }
                }
                throw { status: 500, message: "Internal server error", code: "INTERNAL_ERROR" };
            }
        });
    }
    getMovieInfo(id) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(process.env.OMDB_URL || "", {
                    params: {
                        apikey: process.env.OMDB_APIKEY,
                        i: id,
                    },
                });
                return response.data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                        throw { status: 401, message: "Invalid OMDB API key", code: "INVALID_API_KEY" };
                    }
                    if (error.code === "ECONNABORTED") {
                        throw { status: 504, message: "OMDB request timed out", code: "TIMEOUT" };
                    }
                }
                throw { status: 500, message: "Internal server error", code: "INTERNAL_ERROR" };
            }
        });
    }
}
exports.default = new OmdbService();
