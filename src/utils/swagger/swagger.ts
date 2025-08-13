import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userSchemas } from './shemas/user.schemas';
import { globalSchemas } from './shemas/global.schemas';
import { omdbSchemas } from './shemas/omdb.schemas';
import { omdbParameters } from './parameters/omdb.parameters';
import { favoritesParameters } from './parameters/favorites.parameters';
import { favoritesSchema } from './shemas/favorites.schema';
import { Application } from 'express';
export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ScreenPulse API',
      version: '1.0.0',
      description: 'ScreenPulse API documentation.',
      contact: {
        name: 'Eduardo González',
        email: 'eddugonz@gmail.com',
        url: 'https://github.com/EduGese/ScreenPulse-backend-Api',
      },
    },
    servers: [
      {
        url: 'http://localhost:9000',
        description: 'Local server',
      },
      {
        url: 'https://screenpulse-api.onrender.com',
        description: 'Live server',
      },
    ],
    security: [
    ],
    components: {
      securitySchemes: {
        BearerToken: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Bearer token for user authentication. This JWT token is obtained by successfully logging in via the /api/user/login endpoint. It must be included in the Authorization header as "Bearer <token>" when making requests to endpoints that require authentication, such as favorites management. This token is not required for public endpoints like user registration or login.'
        }
      },
      schemas: {
        ...userSchemas,
        ...globalSchemas,
        ...omdbSchemas,
        ...favoritesSchema,
      },
      parameters: {
        ...omdbParameters,
        ...favoritesParameters,
      },
    },
  },
  apis: ['./src/modules/**/*.ts', './src/utils/swagger/schemas/*.yaml'],
};

export const swaggerSpec = swaggerJsdoc(options);

export default (app: Application) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger documentation is available at /api-docs');
};
