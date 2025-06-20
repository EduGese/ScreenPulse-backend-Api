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
const apiError_1 = require("../../errors/apiError");
class OmdbService {
    getOmdbItemMediaList(title, type, year, page) {
        return __awaiter(this, void 0, void 0, function* () {
            type = type === "all" ? '' : type;
            page = page ? page : "1";
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
                if (response.data.Response === 'True') {
                    response.data.Search = response.data.Search.map((item) => {
                        const newItem = {
                            title: item.Title,
                            year: item.Year,
                            imdbID: item.imdbID,
                            type: item.Type,
                            poster: item.Poster
                        };
                        return newItem;
                    });
                }
                return response.data;
            }
            catch (error) {
                this.handleAxiosError(error);
            }
        });
    }
    getOmdbItemMediaInfo(id) {
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
                this.handleAxiosError(error);
            }
        });
    }
    handleAxiosError(error) {
        if (axios_1.default.isAxiosError(error)) {
            if (error.code === "ECONNABORTED") {
                throw new apiError_1.ApiError(504, "OMDB request timed out", "TIMEOUT");
            }
        }
        throw new apiError_1.ApiError(500, "Internal server error", "INTERNAL_ERROR");
    }
}
exports.default = new OmdbService();
