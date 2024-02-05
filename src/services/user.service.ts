import userSchema from "../models/user";
import { User } from "../interfaces/user.interface";
import bcriptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

class UserService {
  static async loginUser(email: string, password: string) {
    const user = await userSchema.findOne({ email: email });
    if (!user || !bcriptjs.compareSync(password, user.password)) {//Checks: 1º if finds user 2º if password is correct
      throw new Error("Error in mail or password"); //Throw error if fails;
    }

    return { success: "Login OK", token: this.createToken(user) }; //Return object with token if succeed
  }

  static async registerUser(userData:User) {
    try {
       userData.password = bcriptjs.hashSync(userData.password, 12);
       const user =  await userSchema.create(userData);
        return user; 
    } catch (error) {
        throw new Error("Error while registration");
    }
  }

  private static createToken(user: User) {
    const payload = {
      user_id: user._id,
      user_role: user.role,
    };
    return jsonwebtoken.sign(payload, process.env.TOKEN_SECRET || "token"); //Return token if succeded
  }
}

export default UserService;
