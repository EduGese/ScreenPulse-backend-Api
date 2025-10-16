export interface TmdbVideo {
  name: string;
  key: string;
  site: string;
  type: string;
  official?: boolean;
  published_at: string;
}

export interface TmdbFindResponse {
  movie_results: { id: number }[];
  tv_results: { id: number }[];
}

export interface TmdbIdResult {
  id: number;
  mediaType: 'movie' | 'tv';
}
