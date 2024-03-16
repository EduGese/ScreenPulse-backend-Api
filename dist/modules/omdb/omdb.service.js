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
    getOmdbMovies(query) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let totalResults = [];
                let maxPAges = 10;
                let response = yield axios_1.default.get(process.env.OMDB_URL || "", {
                    params: {
                        apikey: process.env.OMDB_APIKEY,
                        s: query.s,
                        type: query.type,
                        y: query.y,
                    },
                });
                let totalResultsLength = Number(response.data.totalResults);
                let totalPagesNeeded = Math.ceil(totalResultsLength / 5);
                for (let index = 0; index < totalPagesNeeded; index++) {
                    if (index >= maxPAges) {
                        break;
                    }
                    let responseByPage = yield axios_1.default.get(process.env.OMDB_URL || "", {
                        params: {
                            apikey: process.env.OMDB_APIKEY,
                            s: query.s,
                            type: query.type,
                            y: query.y,
                            page: index + 1,
                        },
                    });
                    (_a = responseByPage.data.Search) === null || _a === void 0 ? void 0 : _a.forEach((element) => {
                        totalResults.push(element);
                    });
                    if (index >= maxPAges) {
                        break;
                    }
                }
                return totalResults;
            }
            catch (error) {
                throw new Error("Error while searching");
            }
        });
    }
    getMovieInfo(id) {
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
                throw new Error("Error while searching");
            }
        });
    }
}
exports.default = new OmdbService();
