"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const favoritesSchema = new mongoose_1.default.Schema({
    Title: {
        type: String,
        required: true
    },
    Year: {
        type: String,
        required: true
    },
    imdbID: {
        type: String,
        unique: true,
        required: true
    },
    Type: {
        type: String,
        required: true
    },
    Poster: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    descriptions: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Description'
        }],
    user: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ]
});
exports.default = mongoose_1.default.model('Favorites', favoritesSchema);
