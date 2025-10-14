import OmdbService from './omdb.service';
import axios, { AxiosError, AxiosResponse } from 'axios';
import TrailerService from '../youtube/trailer.service';
import { OmdbErrorResponse, OmdbItemDetail } from '../../interfaces/omdb.interface';
import { ApiError } from '../../errors/apiError';

jest.mock('../youtube/trailer.service', () => ({
  __esModule: true,
  default: {
    getTrailerUrl: jest.fn().mockResolvedValue(null),
  },
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedTrailerService = TrailerService as jest.Mocked<typeof TrailerService>;

describe('OmdbService', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('getOmdbItemMediaList', () => {
    it('returns mapped search results on success', async () => {
      const apiResponse = {
        data: {
          Search: [
            {
              Title: 'The Matrix',
              Year: '1999',
              imdbID: 'tt0133093',
              Type: 'movie',
              Poster: 'matrix.jpg',
            },
          ],
          Response: 'True',
        },
      };
      mockedAxios.get.mockResolvedValue(apiResponse);

      const result = await OmdbService.getOmdbItemMediaList('matrix', 'movie', '1999', '1');

      expect(result.Response).toBe('True');
      if (result.Response === 'True') {
        expect(result.Search[0]).toEqual({
          title: 'The Matrix',
          year: '1999',
          imdbID: 'tt0133093',
          type: 'movie',
          poster: 'matrix.jpg',
        });
      }
      expect(mockedAxios.get).toHaveBeenCalledWith(
        process.env.OMDB_URL || '',
        expect.objectContaining({
          params: expect.objectContaining({
            apikey: process.env.OMDB_APIKEY,
            s: 'matrix',
            type: 'movie',
            y: '1999',
            page: '1',
          }),
        }),
      );
    });
    it('maps all results correctly with multiple items', async () => {
      const apiResponse = {
        data: {
          Search: [
            {
              Title: 'The Matrix',
              Year: '1999',
              imdbID: 'tt0133093',
              Type: 'movie',
              Poster: 'matrix.jpg',
            },
            {
              Title: 'Interstellar',
              Year: '2014',
              imdbID: 'tt0816692',
              Type: 'movie',
              Poster: 'interstellar.jpg',
            },
          ],
          Response: 'True',
        },
      };
      mockedAxios.get.mockResolvedValue(apiResponse);

      const result = await OmdbService.getOmdbItemMediaList('ciencia ficción', 'movie', '', '1');
      expect(result.Response).toBe('True');
      if (result.Response === 'True') {
        expect(result.Search).toHaveLength(2);
        expect(result.Search).toContainEqual({
          title: 'The Matrix',
          year: '1999',
          imdbID: 'tt0133093',
          type: 'movie',
          poster: 'matrix.jpg',
        });
        expect(result.Search).toContainEqual({
          title: 'Interstellar',
          year: '2014',
          imdbID: 'tt0816692',
          type: 'movie',
          poster: 'interstellar.jpg',
        });
      }
    });

    it('returns Movie not found! when no items found', async () => {
      const apiResponse = {
        data: {
          Response: 'False',
          Error: 'Movie not found!',
        },
      };
      mockedAxios.get.mockResolvedValue(apiResponse);

      const result = await OmdbService.getOmdbItemMediaList('unknown', 'movie', '', '');
      if (result.Response === 'False') {
        expect(result.Response).toBe('False');
        expect(result.Error).toBe('Movie not found!');
      }
    });
    it('throws timeout ApiError on ECONNABORTED', async () => {
      const spy = jest.spyOn(axios, 'isAxiosError').mockImplementation(() => true);

      const axiosError = Object.assign(new Error('timeout'), {
        code: 'ECONNABORTED',
        isAxiosError: true,
      });
      mockedAxios.get.mockRejectedValue(axiosError);
      await expect(
        OmdbService.getOmdbItemMediaList('title', 'movie', '', ''),
      ).rejects.toMatchObject({
        status: 504,
        code: 'TIMEOUT',
      });
      spy.mockRestore();
    });

    it('throws generic ApiError on other errors', async () => {
      const error = { code: 'SOME_ERROR', isAxiosError: true };
      mockedAxios.get.mockRejectedValue(error);

      await expect(
        OmdbService.getOmdbItemMediaList('title', 'movie', '', ''),
      ).rejects.toMatchObject({
        status: 500,
        code: 'INTERNAL_ERROR',
      });
    });

    it('throws generic ApiError on unknown error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Unknown error'));
      await expect(
        OmdbService.getOmdbItemMediaList('title', 'movie', '', ''),
      ).rejects.toMatchObject({
        status: 500,
        code: 'INTERNAL_ERROR',
      });
    });
  });

  describe('getOmdbItemMediaInfo', () => {
    const mockDetail: OmdbItemDetail = {
      Title: "Inception",
      Year: "2010",
      Rated: "PG-13",
      Released: "16 Jul 2010",
      Runtime: "148 min",
      Genre: "Action, Adventure, Sci-Fi",
      Director: "Christopher Nolan",
      Writer: "Christopher Nolan",
      Actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page",
      Plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task …",
      Language: "English, Japanese, French",
      Country: "United States, United Kingdom",
      Awards: "Won 4 Oscars. 159 wins & 220 nominations total",
      Poster: "https://example.com/poster.jpg",
      Ratings: [
        { Source: "Internet Movie Database", Value: "8.8/10" },
        { Source: "Rotten Tomatoes", Value: "87%" },
        { Source: "Metacritic", Value: "74/100" }
      ],
      Metascore: "74",
      imdbRating: "8.8",
      imdbVotes: "2,731,250",
      imdbID: "tt1375666",
      Type: "movie",
      DVD: "N/A",
      BoxOffice: "$292,587,330",
      Production: "N/A",
      Website: "N/A",
      Response: "True",
      youtubeURLTrailer: null,
    };

    it('returns movie details with null youtubeURLTrailer when no trailer found', async () => {

      const axiosResponse = {
        data: mockDetail
      } as Partial<AxiosResponse<OmdbItemDetail>> as AxiosResponse<OmdbItemDetail>;

      mockedAxios.get.mockResolvedValue(axiosResponse);
      mockedTrailerService.getTrailerUrl.mockResolvedValue(null);


      const result = await OmdbService.getOmdbItemMediaInfo('tt1375666');


      expect(mockedAxios.get).toHaveBeenCalledWith(
        process.env.OMDB_URL || '',
        expect.objectContaining({
          params: expect.objectContaining({
            apikey: process.env.OMDB_APIKEY,
            i: 'tt1375666',
          }),
        }),
      );
      expect(mockedTrailerService.getTrailerUrl).toHaveBeenCalledWith('tt1375666');
      expect(result.Response).toBe('True');
      expect((result as OmdbItemDetail).youtubeURLTrailer).toBeNull();

    });

    it('returns movie details with trailer when TrailerService returns a URL', async () => {
      const axiosResponse = {
        data: mockDetail
      } as Partial<AxiosResponse<OmdbItemDetail>> as AxiosResponse<OmdbItemDetail>;

      mockedAxios.get.mockResolvedValue(axiosResponse);
      mockedTrailerService.getTrailerUrl.mockResolvedValue("https://youtube/trailer123");


      const result = await OmdbService.getOmdbItemMediaInfo('tt1375666');


      expect(mockedAxios.get).toHaveBeenCalledWith(
        process.env.OMDB_URL || '',
        expect.objectContaining({
          params: expect.objectContaining({
            apikey: process.env.OMDB_APIKEY,
            i: 'tt1375666',
          }),
        }),
      );
      expect(mockedTrailerService.getTrailerUrl).toHaveBeenCalledWith('tt1375666');
      expect(result.Response).toBe('True');
      expect((result as OmdbItemDetail).youtubeURLTrailer).toBe("https://youtube/trailer123");

    });
    it('returns error response when OMDB returns Response False', async () => {

      const AxiosResponse: OmdbErrorResponse = {
        Response: 'False',
        Error: 'Movie not found!',
      };
      mockedAxios.get.mockResolvedValue({ data: AxiosResponse } as AxiosResponse<OmdbErrorResponse>);


      const result = await OmdbService.getOmdbItemMediaInfo('tt0000000');

      expect(result).toEqual(AxiosResponse);
      expect(mockedTrailerService.getTrailerUrl).not.toHaveBeenCalled();
    });

    it('throws error when axios fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'));

      await expect(OmdbService.getOmdbItemMediaInfo('tt1375666'))
        .rejects.toThrow();
    });
  });

  describe('handleAxiosError', () => {

    it('throws Timeout ApiError when axios error has ECONNABORTED code', () => {
      const timeoutError: Partial<AxiosError> = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded',
        isAxiosError: true,
      };
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

      expect(() => OmdbService['handleAxiosError'](timeoutError))
        .toThrow(ApiError);

      try {
        OmdbService['handleAxiosError'](timeoutError);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(504);
        expect((error as ApiError).code).toBe('TIMEOUT');
        expect((error as ApiError).message).toBe('OMDB request timed out');
      }


    });

    it('throws Internal ApiError for generic axios error', () => {
      const genericAxiosError: Partial<AxiosError> = {
        code: 'ERR_BAD_REQUEST',
        message: 'Request failed with status code 400',
        isAxiosError: true
      };
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

      expect(() => OmdbService['handleAxiosError'](genericAxiosError))
        .toThrow(ApiError);

      try {
        OmdbService['handleAxiosError'](genericAxiosError);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(500);
        expect((error as ApiError).code).toBe('INTERNAL_ERROR');
        expect((error as ApiError).message).toBe('Internal server error');
      }
    });

    it('throws Internal ApiError for non-axios error', () => {
      const standardError: Error = new Error('Unknown error');
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

      try {
        OmdbService['handleAxiosError'](standardError);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(500);
        expect((error as ApiError).code).toBe('INTERNAL_ERROR');
        expect((error as ApiError).message).toBe('Internal server error');
      }
    });

    it('throws Internal ApiError for unknown error type', () => {
      const unknownError = { custom: 'error object' };
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false);

      try {
        OmdbService['handleAxiosError'](unknownError);
      } catch (error) {
        expect(error).toBeInstanceOf(ApiError);
        expect((error as ApiError).status).toBe(500);
        expect((error as ApiError).code).toBe('INTERNAL_ERROR');
      }
    });

  });

});
