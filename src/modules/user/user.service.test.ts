import UserService from './user.service';
import {afterEach, beforeEach, describe, expect, it, jest, test} from '@jest/globals';
import userSchema from "../../models/user";
import bcriptjs from "bcryptjs";

describe('UserService - loginUser', () => {
    // Simular usuario válido en la base de datos
    const mockUser = {
      _id: 'user123',
      email: 'example@example.com',
      password: 'hashedPassword', // Se asume que ya está encriptada
    };
  
    beforeEach(() => {
      // Mockear la función findOne de userSchema
      jest.spyOn(userSchema, 'findOne').mockResolvedValue(mockUser);
    });
  
    afterEach(() => {
      jest.restoreAllMocks(); // Restaurar mocks después de cada prueba
    });
  
    it('should return success message and token for valid user', async () => {
      const email = 'example@example.com';
      const password = 'password123';
  
      // Mockear compareSync de bcryptjs
      jest.spyOn(bcriptjs, 'compareSync').mockReturnValue(true);
  
      const result = await UserService.loginUser(email, password);
  
      expect(result).toEqual({
        success: 'Login OK',
        token: expect.any(String),
        user: mockUser,
      });
    });
  
  });

