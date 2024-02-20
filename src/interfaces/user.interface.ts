import { Document, Types } from "mongoose";

export interface User extends Document{
    name: string,
    email: string,
    password: string,
    role: string
    favorites: Types.ObjectId[], 
}