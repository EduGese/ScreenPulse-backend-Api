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
const user_1 = __importDefault(require("../../models/user"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_1 = require("../../errors/apiError");
class UserService {
    /**
   * Authenticates a user using email and password.
   * @param {string} email - User's email address.
   * @param {string} password - Plain text password.
   * @returns {Promise<{token: string, user: object}>} Object containing the authentication token and user data.
   * @throws {ApiError} If the credentials are invalid.
   */
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ email: email });
            if (!user || !bcryptjs_1.default.compareSync(password, user.password)) {
                throw new apiError_1.ApiError(401, "Invalid login credentials", "AUTH_ERROR");
            }
            return {
                token: UserService.createToken(user),
                user: {
                    _id: String(user._id),
                    email: user.email,
                    name: user.name
                }
            };
        });
    }
    /**
   * Registers a new user in the system.
   * @param {User} userData - Object containing user registration data.
   * @returns {Promise<User>} The created user object.
   * @throws {ApiError} If a user with the same email already exists.
   */
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExist = yield user_1.default.findOne({ email: userData.email });
            if (userExist) {
                throw new apiError_1.ApiError(409, "User already exists", "USER_EXISTS");
            }
            userData.password = bcryptjs_1.default.hashSync(userData.password, 12);
            const user = yield user_1.default.create(userData);
            return {
                name: user.name,
                email: user.email,
                role: user.role,
                favorites: user.favorites,
                _id: String(user._id),
                __v: user.__v
            };
        });
    }
    /**
   * Generates a JWT authentication token for a user.
   * @param {User} user - User object for which to create the token.
   * @returns {string} JWT token.
   */
    static createToken(user) {
        const payload = {
            user_id: user._id,
            user_role: user.role,
        };
        return jsonwebtoken_1.default.sign(payload, process.env.TOKEN_SECRET || "token");
    }
}
exports.default = new UserService();
