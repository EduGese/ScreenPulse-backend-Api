import { Document } from "mongoose";
import { Favorites } from "./favorites.interface";

export interface User extends Document{
    name: string,
    email: string,
    password: string,
    role: string
    favorites: Favorites[]
}