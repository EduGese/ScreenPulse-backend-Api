import mongoose, { Schema } from "mongoose";
import { User } from "../interfaces/user.interface";

const UserSchema: Schema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    
  },
  role: {
    type: String,
    default: "regular",
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Favorites",
    },
  ],
});

export default mongoose.model<User>("User", UserSchema);
