import OmdbService from './omdb.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

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
                            Poster: 'matrix.jpg'
                        }
                    ],
                    Response: 'True'
                }
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
                    poster: 'matrix.jpg'
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
                        page: '1'
                    })
                })
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
                            Poster: 'matrix.jpg'
                        },
                        {
                            Title: 'Interstellar',
                            Year: '2014',
                            imdbID: 'tt0816692',
                            Type: 'movie',
                            Poster: 'interstellar.jpg'
                        }
                    ],
                    Response: 'True'
                }
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
                    poster: 'matrix.jpg'
                });
                expect(result.Search).toContainEqual({
                    title: 'Interstellar',
                    year: '2014',
                    imdbID: 'tt0816692',
                    type: 'movie',
                    poster: 'interstellar.jpg'
                });
            }
        });

        it('returns Movie not found! when no items found', async () => {
            const apiResponse = {
                data: {
                    Response: "False",
                    Error: "Movie not found!"
                }
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
                isAxiosError: true
            });
            mockedAxios.get.mockRejectedValue(axiosError);
            await expect(
                OmdbService.getOmdbItemMediaList('title', 'movie', '', '')
            ).rejects.toMatchObject({
                status: 504,
                code: 'TIMEOUT'
            });
            spy.mockRestore();
        });


        it('throws generic ApiError on other errors', async () => {
            const error = { code: 'SOME_ERROR', isAxiosError: true };
            mockedAxios.get.mockRejectedValue(error);

            await expect(
                OmdbService.getOmdbItemMediaList('title', 'movie', '', '')
            ).rejects.toMatchObject({
                status: 500,
                code: 'INTERNAL_ERROR'
            });
        });

        it('throws generic ApiError on unknown error', async () => {
            mockedAxios.get.mockRejectedValue(new Error('Unknown error'));
            await expect(
                OmdbService.getOmdbItemMediaList('title', 'movie', '', '')
            ).rejects.toMatchObject({
                status: 500,
                code: 'INTERNAL_ERROR'
            });
        });
    });

    describe('getOmdbItemMediaInfo', () => {
        it('returns movie details on success', async () => {
            const apiResponse = {
                data: {
                    Title: 'Inception',
                    Year: '2010',
                    imdbID: 'tt1375666',
                    Type: 'movie',
                    Poster: 'inception.jpg'
                }
            };
            mockedAxios.get.mockResolvedValue(apiResponse);

            const result = await OmdbService.getOmdbItemMediaInfo('tt1375666');
            if (result.Response === 'True') {
                expect(result.Title).toBe('Inception');
                expect(result.imdbID).toBe('tt1375666');
            }

            expect(mockedAxios.get).toHaveBeenCalledWith(
                process.env.OMDB_URL || '',
                expect.objectContaining({
                    params: expect.objectContaining({
                        apikey: process.env.OMDB_APIKEY,
                        i: 'tt1375666'
                    })
                })
            );
        });

        it('handles errors in getOmdbItemMediaInfo as generic ApiError', async () => {
            mockedAxios.get.mockRejectedValue(new Error('Network Down'));
            await expect(
                OmdbService.getOmdbItemMediaInfo('tt0000001')
            ).rejects.toMatchObject({
                status: 500,
                code: 'INTERNAL_ERROR'
            });
        });
    });
});
