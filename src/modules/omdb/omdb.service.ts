import axios, { AxiosResponse } from "axios";
import { ApiError } from "../../errors/apiError";
import { OmdbItemDetailResponse, OmdbSearchResponse  } from "../../interfaces/omdb.interface";



class OmdbService {
  async getOmdbMovies(title: string, type: string, year: string, page: string): Promise<OmdbSearchResponse> {
    type = type === "all" ? '' : type;
    page = page ? page : "1";

    try {
      const response: AxiosResponse<OmdbSearchResponse> = await axios.get(
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
      if (response.data.Response === 'True') {
        response.data.Search = response.data.Search.map((item) => {
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
      this.handleAxiosError(error);
      
    }
  }
  async getMovieInfo(id: string): Promise<OmdbItemDetailResponse> {
    try {
      const response: AxiosResponse<OmdbItemDetailResponse> = await axios.get(
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
      this.handleAxiosError(error);
     
    }
  }

  private handleAxiosError(error: unknown): never {
          if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new ApiError(401, "Invalid OMDB API key", "INVALID_API_KEY");
        }
        if (error.code === "ECONNABORTED") {
           throw new ApiError(504, "OMDB request timed out", "TIMEOUT");
        }
      }
      throw new ApiError(500, "Internal server error", "INTERNAL_ERROR");
  }
}

export default new OmdbService();