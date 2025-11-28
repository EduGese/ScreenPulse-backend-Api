export const favoritesSchema = {
  CreateFavoriteRequest: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title of the media item to be added to favorites',
        example: 'Inception',
      },
      year: {
        type: 'string',
        description: 'Year of release of the media item',
        example: '2010',
      },
      imdbID: {
        type: 'string',
        description: 'IMDb ID of the media item',
        example: 'tt1375666',
      },
      type: {
        type: 'string',
        description: 'Type of the media item (e.g., movie, series)',
        example: 'movie',
      },
      poster: {
        type: 'string',
        description: 'URL of the poster image for the media item',
        example: 'https://example.com/poster.jpg',
      },
    },
    required: ['title', 'year', 'imdbID', 'type', 'poster'],
  },
  CreateFavoriteResponse: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '60c72b2f9b1e8b001c8e4d3a',
      },
      title: {
        type: 'string',
        example: 'Inception',
      },
      year: {
        type: 'string',
        example: '2010',
      },
      imdbID: {
        type: 'string',
        example: 'tt1375666',
      },
      type: {
        type: 'string',
        example: 'movie',
      },
      poster: {
        type: 'string',
        example: 'https://example.com/poster.jpg',
      },
    },
  },
  GetFavoritesResponse: {
    type: 'object',
    properties: {
      favorites: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '60c72b2f9b1e8b001c8e4d3a',
            },
            title: {
              type: 'string',
              example: 'Inception',
            },
            year: {
              type: 'string',
              example: '2010',
            },
            imdbID: {
              type: 'string',
              example: 'tt1375666',
            },
            type: {
              type: 'string',
              example: 'movie',
            },
            poster: {
              type: 'string',
              example: 'https://example.com/poster.jpg',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2021-06-14T10:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2021-06-14T10:00:00Z',
            },
            __v: {
              type: 'integer',
              example: 0,
            },
            description: {
              type: 'string',
              example: 'A mind-bending thriller about dreams within dreams.',
            },
          },
        },
      },
      totalFavorites: {
        type: 'integer',
        example: 1,
      },
      currentPage: {
        type: 'integer',
        example: 1,
      },
      pageSize: {
        type: 'integer',
        example: 10,
      },
    },
  },
  DeleteFavoriteResponse: {
    type: 'object',
    properties: {
      message: {
        type: 'string',
        example: 'Favorite deleted successfully',
      },
      data: {
        type: 'object',
        description: 'Empty object indicating successful deletion',
        example: {},
      },
    },
  },
  UpdateFavoriteRequest: {
    type: 'object',
    properties: {
      description: {
        type: 'string',
      },
    },
    required: ['description'],
  },
  UpdateFavoriteResponse: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        example: '60c72b2f9b1e8b001c8e4d3a',
      },
      title: {
        type: 'string',
        example: 'Inception',
      },
      year: {
        type: 'string',
        example: '2010',
      },
      imdbID: {
        type: 'string',
        example: 'tt1375666',
      },
      type: {
        type: 'string',
        example: 'movie',
      },
      poster: {
        type: 'string',
        example: 'https://example.com/poster.jpg',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        example: '2021-06-14T10:00:00Z',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        example: '2021-06-14T10:00:00Z',
      },
      description: {
        type: 'string',
        example: 'A mind-bending thriller about dreams within dreams.',
      },
    },
  },
  //errors
  UserNotFound: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        example: 'User not found',
      },
      code: {
        type: 'string',
        example: 'USER_NOT_FOUND',
      },
      status: {
        type: 'integer',
        example: 404,
      },
    },
    required: ['error', 'code', 'status'],
  },
  FavoriteNotFound: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        example: 'Favorite not found',
      },
      code: {
        type: 'string',
        example: 'FAVORITE_NOT_FOUND',
      },
      status: {
        type: 'integer',
        example: 404,
      },
    },
    required: ['error', 'code', 'status'],
  },
  FavoriteAlreadyExists: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        example: 'Favorite already exist for this user',
      },
      code: {
        type: 'string',
        example: 'FAVORITE_EXISTS',
      },
      status: {
        type: 'integer',
        example: 409,
      },
    },
  },
  Unauthorized: {
    type: 'object',
    properties: {
      error: {
        type: 'string',
        example: 'No token provided',
      },
      code: {
        type: 'string',
        example: 'AUTH_MISSING_TOKEN',
      },
      status: {
        type: 'integer',
        example: 401,
      },
    },
    required: ['error', 'code', 'status'],
  },
};
