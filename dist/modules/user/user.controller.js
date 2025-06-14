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
const user_service_1 = __importDefault(require("./user.service"));
class UserController {
    /**
   * Controller for authenticating a user.
   * @param {Request} req - HTTP request containing email and password in the body.
   * @param {Response} res - HTTP response object.
   * @param {NextFunction} next - Express callback to pass control to the error handler.
   * @returns {Promise<void>}
   * @throws {ApiError} If the credentials are invalid or authentication fails.
   */
    loginUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            try {
                const response = yield user_service_1.default.loginUser(email, password);
                res.status(200).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
   * Controller for registering a new user.
   * @param {Request} req - HTTP request containing the user data in the body.
   * @param {Response} res - HTTP response object.
   * @param {NextFunction} next - Express callback to pass control to the error handler.
   * @returns {Promise<void>}
   * @throws {ApiError} If the user already exists or registration fails.
   */
    registertUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield user_service_1.default.registerUser(req.body);
                res.status(201).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = new UserController();
