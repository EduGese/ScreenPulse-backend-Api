"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const descriptionSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    favoriteId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Favorite',
        required: true
    },
    description: {
        type: String,
        required: false
    }
});
exports.default = mongoose_1.default.model('Description', descriptionSchema);
