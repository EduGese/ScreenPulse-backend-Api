import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ScreenPulse API',
      version: '1.0.0',
      description: 'ScreenPulse API documentation',
      contact: {
        name: 'Eduardo González',
        email: 'your@email.com',
        url: 'https://github.com/yourrepo'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server'
      },
      {
        url: "<your live url here>",
        description: "Live server"
      },
    ],
  },
  apis: ['./src/modules/**/*.ts'], 
};

 export const swaggerSpec = swaggerJsdoc(options);


export default (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
