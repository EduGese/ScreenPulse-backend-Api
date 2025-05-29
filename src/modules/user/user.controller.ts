import { NextFunction, Request, Response } from "express";

import UserService from "./user.service";

class UserController {

  async loginUser(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      const response = await UserService.loginUser(email, password);
      res.status(200).json(response);
    } catch (error: unknown) {
      next(error);
    }
  }

  async registertUser(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.registerUser(req.body);
      res.status(201).json(response);
    } catch (error: unknown) {
       next(error);
    }
  }
}

export default new UserController();
