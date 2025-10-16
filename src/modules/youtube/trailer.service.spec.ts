import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import TrailerService from './trailer.service';
import {
  TmdbFindResponse,
  TmdbIdResult,
  TmdbVideo,
} from '../../interfaces/youtubeVideoSearchResultItem.interface';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TrailerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('getTrailerUrl', () => {
    it('returns YouTube URL when trailer is found', async () => {
      const tmdbData: TmdbIdResult = { id: 42, mediaType: 'movie' };
      const youtubeUrl = 'https://www.youtube.com/watch?v=abc123';

      const findTmdbIdSpy = jest
        .spyOn(Object.getPrototypeOf(TrailerService), 'findTmdbId')
        .mockResolvedValue(tmdbData);
      const fetchTrailerSpy = jest
        .spyOn(Object.getPrototypeOf(TrailerService), 'fetchTrailerFromTmdb')
        .mockResolvedValue(youtubeUrl);

      const result = await TrailerService.getTrailerUrl('tt1375666');

      expect(result).toBe(youtubeUrl);
      expect(findTmdbIdSpy).toHaveBeenCalledWith('tt1375666');
      expect(fetchTrailerSpy).toHaveBeenCalledWith(tmdbData);
    });

    it('returns null when findTmdbId returns null', async () => {
      const findTmdbIdSpy = jest
        .spyOn(Object.getPrototypeOf(TrailerService), 'findTmdbId')
        .mockResolvedValue(null);
      const fetchTrailerSpy = jest.spyOn(
        Object.getPrototypeOf(TrailerService),
        'fetchTrailerFromTmdb',
      );

      const result = await TrailerService.getTrailerUrl('tt0000000');

      expect(result).toBeNull();
      expect(findTmdbIdSpy).toHaveBeenCalledWith('tt0000000');
      expect(fetchTrailerSpy).not.toHaveBeenCalled();
    });

    it('returns null when fetchTrailerFromTmdb returns null', async () => {
      const tmdbData: TmdbIdResult = { id: 42, mediaType: 'movie' };

      jest.spyOn(Object.getPrototypeOf(TrailerService), 'findTmdbId').mockResolvedValue(tmdbData);
      jest
        .spyOn(Object.getPrototypeOf(TrailerService), 'fetchTrailerFromTmdb')
        .mockResolvedValue(null);

      const result = await TrailerService.getTrailerUrl('tt1375666');

      expect(result).toBeNull();
    });

    it('returns null when findTmdbId throws error', async () => {
      jest
        .spyOn(Object.getPrototypeOf(TrailerService), 'findTmdbId')
        .mockRejectedValue(new Error('Network error'));

      const result = await TrailerService.getTrailerUrl('tt1375666');

      expect(result).toBeNull();
    });

    it('returns null when fetchTrailerFromTmdb throws error', async () => {
      const tmdbData: TmdbIdResult = { id: 42, mediaType: 'movie' };

      jest.spyOn(Object.getPrototypeOf(TrailerService), 'findTmdbId').mockResolvedValue(tmdbData);
      jest
        .spyOn(Object.getPrototypeOf(TrailerService), 'fetchTrailerFromTmdb')
        .mockRejectedValue(new Error('API error'));

      const result = await TrailerService.getTrailerUrl('tt1375666');

      expect(result).toBeNull();
    });
  });

  describe('findTmdbId', () => {
    it('returns TMDB ID and media type when movie is found', async () => {
      const imdbId = 'tt1375666';
      const tmdbResponse: TmdbFindResponse = {
        movie_results: [{ id: 550 }],
        tv_results: [],
      };
      mockedAxios.get.mockResolvedValueOnce({ data: tmdbResponse });

      const result = await TrailerService['findTmdbId'](imdbId);

      expect(result).toEqual({ id: 550, mediaType: 'movie' });
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('returns TMDB ID and media type when TV show is found', async () => {
      const imdbId = 'tt0944947';
      const tmdbResponse: TmdbFindResponse = {
        movie_results: [],
        tv_results: [{ id: 1399 }],
      };
      mockedAxios.get.mockResolvedValueOnce({ data: tmdbResponse });

      const result = await TrailerService['findTmdbId'](imdbId);

      expect(result).toEqual({ id: 1399, mediaType: 'tv' });
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('returns null when no results are found', async () => {
      const imdbId = 'tt0000000';
      const tmdbResponse: TmdbFindResponse = {
        movie_results: [],
        tv_results: [],
      };
      mockedAxios.get.mockResolvedValueOnce({ data: tmdbResponse });

      const result = await TrailerService['findTmdbId'](imdbId);
      expect(result).toBeNull();
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('throws error when axios request fails', async () => {
      const imdbId = 'tt1375666';
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(TrailerService['findTmdbId'](imdbId)).rejects.toThrow('Network error');
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('prioritizes movie results over TV results', async () => {
      const imdbId = 'tt1375666';
      const tmdbResponse: TmdbFindResponse = {
        movie_results: [{ id: 550 }],
        tv_results: [{ id: 1399 }],
      };
      mockedAxios.get.mockResolvedValueOnce({ data: tmdbResponse });
      const result = await TrailerService['findTmdbId'](imdbId);

      expect(result).toEqual({ id: 550, mediaType: 'movie' });
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('returns null when movie_results and tv_results are undefined', async () => {
      const imdbId = 'tt1234567';
      const tmdbResponse = {} as TmdbFindResponse;
      mockedAxios.get.mockResolvedValueOnce({ data: tmdbResponse });

      const result = await TrailerService['findTmdbId'](imdbId);
      expect(result).toBeNull();
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('returns null if movie_results is undefined and tv_results is empty', async () => {
      const imdbId = 'tt1234567';
      const tmdbResponse = { movie_results: undefined, tv_results: [] };
      mockedAxios.get.mockResolvedValueOnce({ data: tmdbResponse });
      const result = await TrailerService['findTmdbId'](imdbId);
      expect(result).toBeNull();
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('returns null if fields are not arrays (invalid response)', async () => {
      const imdbId = 'tt1234567';
      const tmdbResponse = { movie_results: 'foo', tv_results: 42 };
      mockedAxios.get.mockResolvedValueOnce({ data: tmdbResponse });
      const result = await TrailerService['findTmdbId'](imdbId);
      expect(result).toBeNull();
    });
  });

  describe('fetchTrailerFromTmdb', () => {
    it('returns YouTube URL when TV series trailer is found', async () => {
      const tmdbData: TmdbIdResult = { id: 1399, mediaType: 'tv' };
      const tmdbResponse: { results: TmdbVideo[] } = {
        results: [
          {
            name: 'Season Trailer',
            key: 'tv123',
            site: 'YouTube',
            type: 'Trailer',
            published_at: '2021-01-01',
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: tmdbResponse });
      const result = await TrailerService['fetchTrailerFromTmdb'](tmdbData);

      expect(result).toBe('https://www.youtube.com/watch?v=tv123');
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('returns YouTube URL when movie trailer is found', async () => {
      const tmdbData: TmdbIdResult = { id: 42, mediaType: 'movie' };
      const tmdbResponse: { results: TmdbVideo[] } = {
        results: [
          {
            name: 'Season Trailer',
            key: 'movie123',
            site: 'YouTube',
            type: 'Trailer',
            published_at: '2021-01-01',
          },
        ],
      };
      mockedAxios.get.mockResolvedValueOnce({ data: tmdbResponse });
      const result = await TrailerService['fetchTrailerFromTmdb'](tmdbData);
      expect(result).toBe('https://www.youtube.com/watch?v=movie123');
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('returns null when no trailer is found', async () => {
      const tmdbData: TmdbIdResult = { id: 42, mediaType: 'movie' };
      const tmdbResponse: { results: TmdbVideo[] } = {
        results: [],
      };
      mockedAxios.get.mockResolvedValueOnce({ data: tmdbResponse });
      const result = await TrailerService['fetchTrailerFromTmdb'](tmdbData);
      expect(result).toBeNull();
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('returns null when only non-YouTube videos found', async () => {
      const tmdbData: TmdbIdResult = { id: 42, mediaType: 'movie' };
      const tmdbResponse: { results: TmdbVideo[] } = {
        results: [
          {
            name: 'Official Trailer',
            key: 'vim123',
            site: 'Vimeo',
            type: 'Trailer',
            published_at: '2020-01-01',
          },
          {
            name: 'Another Trailer',
            key: 'dm456',
            site: 'Dailymotion',
            type: 'Trailer',
            published_at: '2020-02-01',
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: tmdbResponse });
      const result = await TrailerService['fetchTrailerFromTmdb'](tmdbData);

      expect(result).toBeNull();
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('handles case-insensitive trailer type matching', async () => {
      const tmdbData: TmdbIdResult = { id: 42, mediaType: 'movie' };
      const tmdbResponse: { results: TmdbVideo[] } = {
        results: [
          {
            name: 'Official Trailer',
            key: 'case123',
            site: 'YouTube',
            type: 'TRAILER',
            published_at: '2020-01-01',
          },
          {
            name: 'Another',
            key: 'case456',
            site: 'YouTube',
            type: 'trailer',
            published_at: '2020-02-01',
          },
        ],
      };

      mockedAxios.get.mockResolvedValueOnce({ data: tmdbResponse });
      const result = await TrailerService['fetchTrailerFromTmdb'](tmdbData);

      expect(result).toBe('https://www.youtube.com/watch?v=case123');
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('throws error and logs on timeout', async () => {
      const tmdbData: TmdbIdResult = { id: 42, mediaType: 'movie' };
      const timeoutError = Object.assign(new Error('timeout of 5000ms exceeded'), {
        code: 'ECONNABORTED',
      });

      mockedAxios.get.mockRejectedValueOnce(timeoutError);
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true);

      await expect(TrailerService['fetchTrailerFromTmdb'](tmdbData)).rejects.toThrow(
        'timeout of 5000ms exceeded',
      );
    });
  });
});
