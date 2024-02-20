import mongoose, { Document } from "mongoose";

export interface Description extends Document{
    userId: mongoose.Types.ObjectId,
    favoriteId: mongoose.Types.ObjectId,
    description: string;
}