"use strict";
// src/utils/swagger/parameters/omdb.parameters.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.omdbParameters = void 0;
exports.omdbParameters = {
    OmdbTitleParam: {
        name: 'title',
        in: 'query',
        required: true,
        schema: { type: 'string' },
        description: 'Search term for the media title.'
    },
    OmdbTypeParam: {
        name: 'type',
        in: 'query',
        required: false,
        schema: {
            type: 'string',
            enum: ['movie', 'series', 'game', 'all']
        },
        description: 'Type of media item to search (movie, series, game, or all).'
    },
    OmdbYearParam: {
        name: 'year',
        in: 'query',
        required: false,
        schema: { type: 'string' },
        description: 'Year of release (between 1900 and current year).'
    },
    OmdbPageParam: {
        name: 'page',
        in: 'query',
        required: false,
        schema: { type: 'integer', minimum: 1 },
        description: 'Page number for pagination (default: 1).'
    },
    OmdbIdParam: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: 'IMDb ID of the media item (e.g., tt1375666).'
    }
};
