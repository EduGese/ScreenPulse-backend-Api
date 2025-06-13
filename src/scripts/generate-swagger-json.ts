import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
import { options } from '../utils/swagger/swagger';

const swaggerSpec = swaggerJsdoc(options);

fs.writeFileSync('swagger.json', JSON.stringify(swaggerSpec, null, 2), 'utf-8');
console.log('swagger.json generated!');
