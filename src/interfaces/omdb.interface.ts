import { Favorites } from "./favorites.interface";

export interface OmdbResponse {
    Response: 'True' | 'False';
    Search?: Favorites[];
    totalResults?: string;
    Error?: string;
  }