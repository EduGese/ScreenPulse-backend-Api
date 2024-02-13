import axios, { AxiosResponse } from "axios";
import { OmdbResponse } from "../../interfaces/omdb.interface";


class OmdbService {

    async getOmdbMovies(query:any): Promise<any> {
        try {
            const response: AxiosResponse<OmdbResponse> =  await axios.get(process.env.OMDB_URL || '' , {
            params:{
              apikey: process.env.OMDB_APIKEY,
              s: query.s,
              type: query.type,
              y: query.y
            }
          });
          return response.data;
        } catch (error) {
            throw new Error("Error while searching");
        }
    }
}

export default new OmdbService();