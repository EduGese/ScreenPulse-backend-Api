import userService from './user.service';
import userSchema from '../../models/user';
import bcriptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { ApiError } from '../../errors/apiError';
import { UserLoginResponse } from '../../interfaces/user.interface';

jest.mock('../../models/user');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginUser', () => {
    it('should return token and user data for valid credentials', async () => {
      const mockUser = {
        _id: '1',
        email: 'test@mail.com',
        name: 'Test',
        password: 'hashed',
      };
      (userSchema.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcriptjs.compareSync as jest.Mock).mockReturnValue(true);
      (jsonwebtoken.sign as jest.Mock).mockReturnValue('mockToken');

      const testPassword = 'password';
      const result = await userService.loginUser('test@mail.com', testPassword);

      expect(result).toEqual({
        token: 'mockToken',
        user: {
          _id: '1',
          email: 'test@mail.com',
          name: 'Test',
        },
      } as UserLoginResponse);
      expect(jsonwebtoken.sign).toHaveBeenCalledWith(
        { user_id: mockUser._id },
        expect.any(String),
        { expiresIn: '1h' },
      );
      expect(userSchema.findOne).toHaveBeenCalledWith({ email: 'test@mail.com' });
      expect(bcriptjs.compareSync).toHaveBeenCalledWith(testPassword, mockUser.password);
    });

    it('should throw ApiError for invalid credentials', async () => {
      (userSchema.findOne as jest.Mock).mockResolvedValue(null);

      await expect(userService.loginUser('bad@mail.com', 'wrong')).rejects.toThrow(ApiError);
    });
    it('should throw ApiError if password is incorrect', async () => {
      const mockUser = {
        _id: '1',
        email: 'test@mail.com',
        password: 'hashed',
        name: 'Test',
        role: 'user',
      };
      (userSchema.findOne as jest.Mock).mockResolvedValue(mockUser);
      (bcriptjs.compareSync as jest.Mock).mockReturnValue(false);

      await expect(userService.loginUser('test@mail.com', 'badpass')).rejects.toThrow(ApiError);
    });
  });

  describe('registerUser', () => {
    it('should create and return new user if email does not exist', async () => {
      (userSchema.findOne as jest.Mock).mockResolvedValue(null);
      (bcriptjs.hashSync as jest.Mock).mockReturnValue('hashedPassword');
      const mockCreatedUser = {
        _id: '2',
        name: 'New',
        email: 'new@mail.com',
        role: 'user',
        favorites: [],
        __v: 0,
      };
      (userSchema.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await userService.registerUser({
        name: 'New',
        email: 'new@mail.com',
        password: 'plain',
      });
      expect(bcriptjs.hashSync).toHaveBeenCalledWith('plain', 12);
      expect(userSchema.create).toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'hashedPassword',
        }),
      );
      expect(result).toEqual(mockCreatedUser);
    });

    it('should throw ApiError if user already exists', async () => {
      (userSchema.findOne as jest.Mock).mockResolvedValue({ email: 'exists@mail.com' });

      await expect(
        userService.registerUser({
          name: 'Exists',
          email: 'exists@mail.com',
          password: 'plain',
        }),
      ).rejects.toThrow(ApiError);
    });
  });
});
