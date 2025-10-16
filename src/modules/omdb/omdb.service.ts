import axios, { AxiosResponse } from 'axios';
import { ApiError } from '../../errors/apiError';
import {
  OmdbItemDetailResponse,
  OmdbItemMediaListResponse,
  OmdbSearchItem,
} from '../../interfaces/omdb.interface';
import TrailerService from '../youtube/trailer.service';

class OmdbService {
  async getOmdbItemMediaList(
    title: string,
    type: string,
    year: string,
    page: string,
  ): Promise<OmdbItemMediaListResponse> {
    type = type === 'all' ? '' : type;
    page = page ? page : '1';

    try {
      const response: AxiosResponse<OmdbItemMediaListResponse> = await axios.get(
        process.env.OMDB_URL || '',
        {
          params: {
            apikey: process.env.OMDB_APIKEY,
            s: title.toLocaleLowerCase(),
            type: type.toLocaleLowerCase(),
            y: year,
            page: page,
          },
        },
      );
      if (response.data.Response === 'True') {
        response.data.Search = response.data.Search.map(item => {
          const newItem: OmdbSearchItem = {
            title: item.Title,
            year: item.Year,
            imdbID: item.imdbID,
            type: item.Type,
            poster: item.Poster,
          };
          return newItem;
        });
      }
      return response.data;
    } catch (error) {
      this.handleAxiosError(error);
    }
  }
  async getOmdbItemMediaInfo(id: string): Promise<OmdbItemDetailResponse> {
    try {
      const { data }: AxiosResponse<OmdbItemDetailResponse> = await axios.get(
        process.env.OMDB_URL || '',
        {
          params: {
            apikey: process.env.OMDB_APIKEY,
            i: id,
          },
        },
      );

      if (data.Response === 'False') {
        return data;
      }

      const youtubeURLTrailer = await TrailerService.getTrailerUrl(data.imdbID);

      return { ...data, youtubeURLTrailer };
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  private handleAxiosError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new ApiError(504, 'OMDB request timed out', 'TIMEOUT');
      }
    }
    throw new ApiError(500, 'Internal server error', 'INTERNAL_ERROR');
  }
}

export default new OmdbService();
