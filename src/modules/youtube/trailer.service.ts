import axios from 'axios';
import {
  TmdbFindResponse,
  TmdbIdResult,
  TmdbVideo,
} from '../../interfaces/youtubeVideoSearchResultItem.interface';

class TrailerService {
  private readonly officialYouTubeSite = 'YouTube';
  private readonly trailerType = 'trailer';
  private readonly apiKey = process.env.TMDB_API_KEY;
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  /**
   * Retrieves the YouTube trailer URL for a given IMDB ID
   * @param imdbId - IMDB identifier (e.g., 'tt1375666')
   * @returns YouTube URL if found, null otherwise (includes errors)
   */
  public async getTrailerUrl(imdbId: string): Promise<string | null> {
    try {

      const tmdbData = await this.findTmdbId(imdbId);
      if (!tmdbData) return null;

      return await this.fetchTrailerFromTmdb(tmdbData);
    } catch {
      return null;
    }
  }

  /**
   * Finds TMDB ID from IMDB ID using TMDB Find API
   * @param imdbId - IMDB identifier
   * @returns TMDB ID and media type, or null if not found
   */
  private async findTmdbId(imdbId: string): Promise<TmdbIdResult | null> {
    try {
      const response = await axios.get<TmdbFindResponse>(
        `${this.baseUrl}/find/${imdbId}`,
        {
          params: {
            api_key: this.apiKey,
            external_source: 'imdb_id',
          },
          timeout: 5000,
        }
      );

      const { movie_results, tv_results } = response.data;

      if (Array.isArray(movie_results) && movie_results.length > 0) {
        return { id: movie_results[0].id, mediaType: 'movie' };
      }
      if (Array.isArray(tv_results) && tv_results.length > 0) {
        return { id: tv_results[0].id, mediaType: 'tv' };
      }

      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.warn(`TMDB Find API error for ${imdbId}:`, error.message);
      }
      throw error;
    }
  }

  /**
   * Fetches trailer from TMDB videos endpoint
   * @param tmdbData - TMDB ID and media type
   * @returns YouTube URL if trailer found, null otherwise
   */
  private async fetchTrailerFromTmdb({
    id,
    mediaType,
  }: TmdbIdResult): Promise<string | null> {
    // eslint-disable-next-line no-useless-catch
    try {
      const path = mediaType === 'movie' ? 'movie' : 'tv';
      const response = await axios.get<{ results: TmdbVideo[] }>(
        `${this.baseUrl}/${path}/${id}/videos`,
        {
          params: {
            api_key: this.apiKey,
          },
          timeout: 5000,
        }
      );

      const videos = response.data.results;
      const trailer = videos?.find(
        (video) =>
          video.site === this.officialYouTubeSite &&
          video.type?.toLowerCase() === this.trailerType
      );

      return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    } catch (error) {
      throw error;
    }
  }
}

export default new TrailerService();
