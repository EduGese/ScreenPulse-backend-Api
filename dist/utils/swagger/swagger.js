"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.options = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const user_schemas_1 = require("./shemas/user.schemas");
const global_schemas_1 = require("./shemas/global.schemas");
const omdb_schemas_1 = require("./shemas/omdb.schemas");
const omdb_parameters_1 = require("./parameters/omdb.parameters");
const favorites_parameters_1 = require("./parameters/favorites.parameters");
const favorites_schema_1 = require("./shemas/favorites.schema");
exports.options = {
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
        security: [
            {
                ApiKeyAuth: []
            }
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
            schemas: Object.assign(Object.assign(Object.assign(Object.assign({}, user_schemas_1.userSchemas), global_schemas_1.globalSchemas), omdb_schemas_1.omdbSchemas), favorites_schema_1.favoritesSchema),
            parameters: Object.assign(Object.assign({}, omdb_parameters_1.omdbParameters), favorites_parameters_1.favoritesParameters)
        }
    },
    apis: ['./src/modules/**/*.ts', './src/utils/swagger/schemas/*.yaml'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(exports.options);
exports.default = (app) => {
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerSpec));
    console.log('Swagger documentation is available at /api-docs');
};
