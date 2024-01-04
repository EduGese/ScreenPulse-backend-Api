import { Document } from 'mongoose';

export interface Favorites extends Document {
  title: string;
  year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  description?: string;
}