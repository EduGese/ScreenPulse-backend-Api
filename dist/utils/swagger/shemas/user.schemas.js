"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchemas = void 0;
exports.userSchemas = {
    //Login
    LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                format: 'email',
                example: 'user@example.com',
            },
            password: {
                type: 'string',
                example: 'P@ssw0rd',
            },
        },
    },
    LoginResponse: {
        type: 'object',
        properties: {
            token: {
                type: 'string',
                example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        example: '60b8d295f1d2c916c8b6e7f1',
                    },
                    email: {
                        type: 'string',
                        format: 'email',
                        example: 'user@example.com',
                    },
                    name: {
                        type: 'string',
                        example: 'John Doe',
                    },
                },
            },
        },
    },
    //Register
    RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
            name: {
                type: 'string',
                example: 'John Doe',
            },
            email: {
                type: 'string',
                format: 'email',
                example: 'john@example.com',
            },
            password: {
                type: 'string',
                example: 'P@ssw0rd',
            },
        },
    },
    RegisterResponse: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                example: 'John Doe',
            },
            email: {
                type: 'string',
                format: 'email',
                example: 'john@example.com',
            },
            role: {
                type: 'string',
                example: 'regular',
            },
            favorites: {
                type: 'array',
                items: {
                    type: 'string',
                    example: [],
                },
            },
            _id: {
                type: 'string',
                example: '60b8d295f1d2c916c8b6e7f1',
            },
            __v: {
                type: 'integer',
                example: 0,
            },
        },
    },
    //Errors
    UnauthorizedError: {
        type: 'object',
        properties: {
            error: {
                type: 'string',
                example: 'Invalid login credentials'
            },
            code: {
                type: 'string',
                example: 'AUTH_ERROR'
            },
            status: {
                type: 'integer',
                example: 401
            },
        },
    },
    ConflictError: {
        type: 'object',
        properties: {
            error: {
                type: 'string',
                example: 'User already exists'
            },
            code: {
                type: 'string',
                example: 'USER_EXISTS'
            },
            status: {
                type: 'integer',
                example: 409
            },
        },
    },
};
