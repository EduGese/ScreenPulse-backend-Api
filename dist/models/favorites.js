"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const favoritesSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    imdbID: {
        type: String,
        unique: true,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    poster: {
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
exports.default = mongoose_1.default.model('MediaItem', favoritesSchema);
