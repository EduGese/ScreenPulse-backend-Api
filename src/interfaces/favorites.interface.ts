import { Document } from 'mongoose';

export interface Favorites extends Document {
  user: any;
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  description?: string;
}