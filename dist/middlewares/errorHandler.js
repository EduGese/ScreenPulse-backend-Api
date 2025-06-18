"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const apiError_1 = require("../errors/apiError");
function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof apiError_1.ApiError) {
        res.status(err.status).json({
            error: err.message,
            code: err.code,
            status: err.status,
        });
    }
    else if (err instanceof Error) {
        res.status(500).json({
            error: err.message,
            code: "INTERNAL_ERROR",
            status: 500,
        });
    }
    else {
        res.status(500).json({
            error: "Internal server error",
            code: "INTERNAL_ERROR",
            status: 500,
        });
    }
}
exports.errorHandler = errorHandler;
