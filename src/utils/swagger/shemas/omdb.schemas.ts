export const omdbSchemas = {
  OmdbItemMediaListResponse: {
    type: 'object',
    properties: {
      Search: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', example: 'Rambo' },
            year: { type: 'string', example: '2010' },
            imdbID: { type: 'string', example: 'tt1375666' },
            type: { type: 'string', example: 'movie' },
            poster: { type: 'string', example: 'https://example.com/poster.jpg' },
          },
        },
      },
      totalResults: { type: 'string', example: '100' },
      Response: { type: 'string', example: 'True' },
    },
  },
  OmdbItemDetailResponse: {
    type: 'object',
    properties: {
      Title: { type: 'string', example: 'Inception' },
      Year: { type: 'string', example: '2010' },
      Rated: { type: 'string', example: 'PG-13' },
      Released: { type: 'string', example: '16 Jul 2010' },
      Runtime: { type: 'string', example: '148 min' },
      Genre: { type: 'string', example: 'Action, Adventure, Sci-Fi' },
      Director: { type: 'string', example: 'Christopher Nolan' },
      Writer: { type: 'string', example: 'Christopher Nolan' },
      Actors: { type: 'string', example: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page' },
      Plot: {
        type: 'string',
        example:
          'A thief who steals corporate secrets through the use of dream-sharing technology...',
      },
      Language: { type: 'string', example: 'English, Japanese, French' },
      Country: { type: 'string', example: 'USA, UK' },
      Awards: { type: 'string', example: 'Won 4 Oscars. Another 38 wins & 74 nominations.' },
      Poster: { type: 'string', example: 'https://example.com/poster.jpg' },
      Ratings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            Source: { type: 'string', example: 'Internet Movie Database' },
            Value: { type: 'string', example: '8.8/10' },
          },
        },
      },
      Metascore: { type: 'string', example: '74' },
      imdbRating: { type: 'string', example: '8.8' },
      imdbVotes: { type: 'string', example: '1,000,000' },
      imdbID: { type: 'string', example: 'tt1375666' },
      Type: { type: 'string', example: 'movie' },
      DVD: { type: 'string', example: '10 Sep 2010' },
      BoxOffice: { type: 'string', example: '$292,568,851' },
      Production: { type: 'string', example: 'Warner Bros.' },
      Website: { type: 'string', example: 'http://www.inceptionmovie.com/' },
      Response: { type: 'string', example: 'True' },
    },
  },
  OmdbErrorResponse: {
    type: 'object',
    properties: {
      Response: { type: 'string', example: 'False' },
      Error: { type: 'string', example: 'Movie not found!' },
    },
  },
  //errors
  OmdbTimeOutError: {
    type: 'object',
    properties: {
      error: { type: 'string', example: 'OMDB request timed out' },
      code: { type: 'string', example: 'TIMEOUT' },
      status: { type: 'integer', example: 504 },
    },
  },
};
