import axios, { AxiosResponse } from "axios";
import { OmdbResponse } from "../../interfaces/omdb.interface";


class OmdbService {
  async getOmdbMovies(query: any): Promise<any> {
    try {
      let totalResults: any[] = [];
      let maxPAges = 10;
      let response: AxiosResponse<OmdbResponse> = await axios.get(
        process.env.OMDB_URL || "",
        {
          params: {
            apikey: process.env.OMDB_APIKEY,
            s: query.s,
            type: query.type,
            y: query.y,
          },
        }
      );
      let totalResultsLength: number = Number(response.data.totalResults);
      let totalPagesNeeded: number = Math.ceil(totalResultsLength / 5);

      for (let index = 0; index < totalPagesNeeded; index++) {
        if (index  >= maxPAges) {
          break;
        }
        let responseByPage: AxiosResponse<OmdbResponse> = await axios.get(
          process.env.OMDB_URL || "",
          {
            params: {
              apikey: process.env.OMDB_APIKEY,
              s: query.s,
              type: query.type,
              y: query.y,
              page: index + 1,
            },
          }
        );
        responseByPage.data.Search?.forEach((element) => {
          totalResults.push(element);
        });
        if (index  >= maxPAges) {
          break;
        }
      }
      return totalResults;
    } catch (error) {
      throw new Error("Error while searching");
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
      throw new Error("Error while searching");
    }
  }
}

export default new OmdbService();