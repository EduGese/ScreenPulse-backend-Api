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
class UserService {
    loginUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findOne({ email: email });
            if (!user || !bcryptjs_1.default.compareSync(password, user.password)) { //Checks: 1º if finds user 2º if password is correct
                throw new Error("Error in mail or password"); //Throw error if fails;
            }
            return { success: "Login OK", token: UserService.createToken(user), user: user }; //Return object with token if succeed
        });
    }
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userExist = yield user_1.default.findOne({ email: userData.email });
            if (userExist) {
                throw new Error("User already exists");
            }
            userData.password = bcryptjs_1.default.hashSync(userData.password, 12);
            const user = yield user_1.default.create(userData);
            return user;
        });
    }
    static createToken(user) {
        const payload = {
            user_id: user._id,
            user_role: user.role,
        };
        return jsonwebtoken_1.default.sign(payload, process.env.TOKEN_SECRET || "token"); //Return token if succeded
    }
}
exports.default = new UserService();
