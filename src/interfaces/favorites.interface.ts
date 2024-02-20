import mongoose, { Document, Types } from 'mongoose';

export interface Favorites extends Document {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  description?: string;
  descriptions: mongoose.Types.ObjectId[];
  user: Types.ObjectId[];
}