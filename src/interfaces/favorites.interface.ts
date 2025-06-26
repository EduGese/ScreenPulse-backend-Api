import mongoose, { Document, Types } from 'mongoose';

export interface FavoritesListWithMetadata {
  favorites: MediaItemWithMetaData[];
  totalFavorites: number;
  currentPage: number;
  pageSize: number;
}

export interface MediaItemDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  year: string;
  imdbID: string;
  type: string;
  poster: string;
  description: string;
  descriptions: mongoose.Types.ObjectId[];
  user: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface MediaItemWithMetaData {
  _id: Types.ObjectId;
  title: string;
  year: string;
  imdbID: string;
  type: string;
  poster: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  description: string;
}

export interface MediaItemInput {
  title: string;
  year: string;
  imdbID: string;
  type: string;
  poster: string;
  description?: string;
}

export interface FavoriteResponse {
  _id: Types.ObjectId;
  title: string;
  year: string;
  imdbID: string;
  type: string;
  poster: string;
}

export interface FavoriteWithDescriptionResponse {
  title: string;
  year: string;
  imdbID: string;
  type: string;
  poster: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}
