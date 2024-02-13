import { Request, Response, NextFunction } from "express";

import UserService from "./user.service";

class UserController {

  async loginUser(req: Request, res: Response, next: NextFunction) {

    const { email, password } = req.body;
    try {
      const response = await UserService.loginUser(email, password);
      res.json(response);
    } catch (error:any) {
      //res.json({ error: error.message });
      next(error);
    }
  }

  async registertUser(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.registerUser(req.body);
      res.json(response);
    } catch (error: any) {
      // res.json({ error: error.message });
      next(error);
    }
  }
}

export default new UserController();
