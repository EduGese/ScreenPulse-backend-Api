import mongoose, { Document, Types } from 'mongoose';

export interface MediaItem extends Document {
  title: string;
  year: string;
  imdbID: string;
  type: string;
  poster: string;
  description?: string;
  descriptions: mongoose.Types.ObjectId[];
  user: Types.ObjectId[];
}