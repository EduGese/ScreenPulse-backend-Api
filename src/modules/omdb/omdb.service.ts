import axios, { AxiosResponse } from "axios";
import { OmdbResponse,  } from "../../interfaces/omdb.interface";
import { MediaItem } from "../../interfaces/favorites.interface";
interface OmdbMovieRaw {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

class OmdbService {
  async getOmdbMovies(title: string, type: string, year: string, page: String): Promise<any> {
    type = type === "all" ? '' : type;
    try {
      const response: AxiosResponse<OmdbResponse> = await axios.get(
        process.env.OMDB_URL || "",
        {
          params: {
            apikey: process.env.OMDB_APIKEY,
            s: title.toLocaleLowerCase(),
            type: type.toLocaleLowerCase(),
            y: year,
            page: page,
          },
        }
      );
      if (response.data.Search) {
        response.data.Search = response.data.Search.map((item: any) => {
          const newItem: any = {}
      
          for (const key in item) {
            if (['Title', 'Year', 'Type', 'Poster'].includes(key)) {
              newItem[key.toLowerCase()] = item[key]
            } else {
              newItem[key] = item[key] 
            }
          }
      
          return newItem
        })
      }
      return response.data;

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw { status: 401, message: "Invalid OMDB API key", code: "INVALID_API_KEY" };
        }
        if (error.code === "ECONNABORTED") {
          throw { status: 504, message: "OMDB request timed out", code: "TIMEOUT" };
        }
      }
      throw { status: 500, message: "Internal server error", code: "INTERNAL_ERROR" };
      
    }
  }
  async getMovieInfo(id: string): Promise<any> {
    try {
      const response: AxiosResponse<OmdbResponse> = await axios.get(
        process.env.OMDB_URL || "",
        {
          params: {
            apikey: process.env.OMDB_APIKEY,
            i: id,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw { status: 401, message: "Invalid OMDB API key", code: "INVALID_API_KEY" };
        }
        if (error.code === "ECONNABORTED") {
          throw { status: 504, message: "OMDB request timed out", code: "TIMEOUT" };
        }
      }
      throw { status: 500, message: "Internal server error", code: "INTERNAL_ERROR" };
      
    }
  }
}

export default new OmdbService();