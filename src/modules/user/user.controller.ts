import { NextFunction, Request, Response } from 'express';

import UserService from './user.service';

class UserController {
  /**
   * Controller for authenticating a user.
   * @param {Request} req - HTTP request containing email and password in the body.
   * @param {Response} res - HTTP response object.
   * @param {NextFunction} next - Express callback to pass control to the error handler.
   * @returns {Promise<void>}
   * @throws {ApiError} If the credentials are invalid or authentication fails.
   */
  async loginUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;
    try {
      const response = await UserService.loginUser(email, password);
      res.status(200).json(response);
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * Controller for registering a new user.
   * @param {Request} req - HTTP request containing the user data in the body.
   * @param {Response} res - HTTP response object.
   * @param {NextFunction} next - Express callback to pass control to the error handler.
   * @returns {Promise<void>}
   * @throws {ApiError} If the user already exists or registration fails.
   */
  async registertUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const response = await UserService.registerUser(req.body);
      res.status(201).json(response);
    } catch (error: unknown) {
      next(error);
    }
  }
}

export default new UserController();
