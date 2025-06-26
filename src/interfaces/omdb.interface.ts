export interface OmdbSearchItem {
  title: string;
  year: string;
  imdbID: string;
  type: string;
  poster: string;
  [key: string]: string;
}

export interface OmdbSearchSuccess {
  Search: OmdbSearchItem[];
  totalResults: string;
  Response: 'True';
}

export interface OmdbErrorResponse {
  Response: 'False';
  Error: string;
}

export type OmdbItemMediaListResponse = OmdbSearchSuccess | OmdbErrorResponse;

export interface Rating {
  Source: string;
  Value: string;
}

export interface OmdbItemDetail {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Rating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: 'True';
}

export type OmdbItemDetailResponse = OmdbItemDetail | OmdbErrorResponse;
