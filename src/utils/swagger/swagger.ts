import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { userSchemas } from './shemas/user.schemas';
import { globalSchemas } from './shemas/global.schemas';
import { omdbSchemas } from './shemas/omdb.schemas';
import { omdbParameters } from './parameters/omdb.parameters';
import { favoritesParameters } from './parameters/favorites.parameters';
import { favoritesSchema } from './shemas/favorites.schema';



export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ScreenPulse API',
      version: '1.0.0',
      description: 'ScreenPulse API documentation.',
      contact: {
        name: 'Eduardo González',
        email: 'your@email.com',
        url: 'https://github.com/EduGese/ScreenPulse-backend-Api'
      }
    },
    servers: [
      {
        url: 'http://localhost:9000',
        description: 'Local server'
      },
      {
        url: "https://screenpulse-api.onrender.com",
        description: "Live server"
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API key for writing operations on ScreenPulse API. You can obtain it contacting the administrator. Key will be validated when performing requests to endpoints that modify data. For read-only operations, the API key is not required.'
        }
      },
      security: [
        {
          ApiKeyAuth: []
        }
      ],
      schemas: {
        ...userSchemas,
        ...globalSchemas,
        ...omdbSchemas,
        ...favoritesSchema
      },
      parameters: {
        ...omdbParameters,
        ...favoritesParameters
      }
    }
  },
  apis: ['./src/modules/**/*.ts', './src/utils/swagger/schemas/*.yaml'],
};

export const swaggerSpec = swaggerJsdoc(options);


export default (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
