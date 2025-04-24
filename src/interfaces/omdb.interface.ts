import { MediaItem } from "./favorites.interface";

export interface OmdbResponse {
    Response: 'True' | 'False';
    Search?: MediaItem[];
    totalResults?: string;
    Error?: string;
    isFavorite?: boolean;
  }