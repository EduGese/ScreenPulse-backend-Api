import userSchema from "../../models/user";
import { User } from "../../interfaces/user.interface";
import bcriptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

class UserService {
  async loginUser(email: string, password: string) {
    const user = await userSchema.findOne({ email: email });
    if (!user || !bcriptjs.compareSync(password, user.password)) {
      throw new Error("Invalid credentials");
    }
    return {
      token: UserService.createToken(user),
      user: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    };
  }

  async registerUser(userData: User) {
    const userExist = await userSchema.findOne({ email: userData.email });
    if (userExist) {
      throw new Error("User already exists");
    }
    userData.password = bcriptjs.hashSync(userData.password, 12);
    const user = await userSchema.create(userData);
    return user;
  }

  private static createToken(user: User) {
    const payload = {
      user_id: user._id,
      user_role: user.role,
    };
    return jsonwebtoken.sign(payload, process.env.TOKEN_SECRET || "token");
  }
}

export default new UserService();
