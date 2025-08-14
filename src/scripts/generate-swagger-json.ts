import fs from 'fs';
import swaggerJsdoc from 'swagger-jsdoc';
import { options } from '../utils/swagger/swagger';
import path from 'path';

const swaggerSpec = swaggerJsdoc(options);

fs.writeFileSync(path.resolve('swagger.json'), JSON.stringify(swaggerSpec, null, 2), 'utf-8');
console.log('Local swagger.json generated!');

fs.writeFileSync(path.resolve('docs/swagger.json'), JSON.stringify(swaggerSpec, null, 2), 'utf-8');
console.log('Prod swagger.json generated!');
