import { Request, Response, NextFunction } from "express";

import UserService from "./user.service";

class UserController {

  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const response = await UserService.loginUser(email, password);
      res.json(response);
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        res.status(401).json({ 
          error: "Authentication failed", 
          message: "Invalid login credentials",
          code: 'AUTH_ERROR' ,
          status: 401
        });
      } else {
        res.status(500).json({ 
          error: "Internal Server Error", 
          message: "An unexpected error occurred. Please try again later.",
          code: 'INTERNAL_ERROR' ,
          status: 500
        });
      }
    }
  }

  async registertUser(req: Request, res: Response) {
    try {
      const response = await UserService.registerUser(req.body);
      res.json(response);
    } catch (error: any) {
      if (error.message === 'User already exists') {
        res.status(409).json({ 
          message: "User already exists",
          code: 'USER_EXISTS',
        });
      } else {
        console.error("Unexpected error in login:", error);
        res.status(500).json({ 
          message: "An unexpected error occurred. Please try again later.",
          code: 'INTERNAL_ERROR',
        });
      }
    }
  }
}

export default new UserController();
