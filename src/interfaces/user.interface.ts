import { Document, Types } from 'mongoose';

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  favorites: Types.ObjectId[];
  __id: Types.ObjectId;
  __v: number;
}

export interface UserLoginResponse {
  token: string;
  user: {
    _id: string;
    email: string;
    name: string;
  };
}

export interface UserRegisterResponse {
  name: string;
  email: string;
  role: string;
  favorites: Types.ObjectId[];
  _id: string;
  __v: number;
}
