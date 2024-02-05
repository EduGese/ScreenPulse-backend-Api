import UserService from "../services/user.service";

class UserController {

  async loginUser(req: any, res: any) {

    const { email, password } = req.body;
    try {
      const response = await UserService.loginUser(email, password);
      res.json(response);
    } catch (error:any) {
      res.json({ error: error.message });
    }
  }

  async registertUser(req: any, res: any) {
    try {
      const response = await UserService.registerUser(req.body);
      res.json(response);
    } catch (error: any) {
      res.json({ error: error.message });
    }
  }
}

export default new UserController();
