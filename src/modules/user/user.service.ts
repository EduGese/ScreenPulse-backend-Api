import userSchema from '../../models/user';
import {
  User,
  UserLoginResponse,
  UserRegisterDTO,
  UserRegisterResponse,
} from '../../interfaces/user.interface';
import bcriptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { ApiError } from '../../errors/apiError';

class UserService {
  /**
   * Authenticates a user using email and password.
   * @param {string} email - User's email address.
   * @param {string} password - Plain text password.
   * @returns {Promise<{token: string, user: object}>} Object containing the authentication token and user data.
   * @throws {ApiError} If the credentials are invalid.
   */
  async loginUser(email: string, password: string): Promise<UserLoginResponse> {
    const user = await userSchema.findOne({ email: email });
    if (!user || !bcriptjs.compareSync(password, user.password)) {
      throw new ApiError(401, 'Invalid login credentials', 'AUTH_ERROR');
    }
    return {
      token: UserService.createToken(user),
      user: {
        _id: String(user._id),
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Registers a new user in the system.
   * @param {User} userData - Object containing user registration data.
   * @returns {Promise<User>} The created user object.
   * @throws {ApiError} If a user with the same email already exists.
   */
  async registerUser(userData: UserRegisterDTO): Promise<UserRegisterResponse> {
    const userExist = await userSchema.findOne({ email: userData.email });
    if (userExist) {
      throw new ApiError(409, 'User already exists', 'USER_EXISTS');
    }
    userData.password = bcriptjs.hashSync(userData.password, 12);
    const user = await userSchema.create(userData);
    return {
      name: user.name,
      email: user.email,
      role: user.role,
      favorites: user.favorites,
      _id: String(user._id),
      __v: user.__v,
    };
  }

  /**
   * Generates a JWT authentication token for a user.
   * @param {User} user - User object for which to create the token.
   * @returns {string} JWT token.
   */
  private static createToken(user: User): string {
    const payload = {
      user_id: user._id,
    };
    return jsonwebtoken.sign(payload, process.env.TOKEN_SECRET || 'token', { expiresIn: '1h' });
  }
}

export default new UserService();
