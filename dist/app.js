"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config/config"));
const modules_1 = require("./modules");
const errorHandler_1 = require("./middlewares/errorHandler");
const swagger_1 = __importDefault(require("./utils/swagger/swagger"));
//execute express
const app = (0, express_1.default)();
const port = config_1.default.server.port;
//CORS
var corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    optionsSuccessStatus: 204,
    maxAge: 500,
    origin: config_1.default.client.url,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
//routes
app.use('/api/favorites', modules_1.favoritesModule.router);
app.use('/api/omdb', modules_1.omdbModule.router);
app.use('/api/user', modules_1.userModule.router);
(0, swagger_1.default)(app);
app.use(errorHandler_1.errorHandler);
// server listenening on config.server.port
app.listen(port, () => {
    console.log('Server is running on port', port);
});
// Mongodb conection
mongoose_1.default.connect(config_1.default.mongo.url || '')
    .then(() => console.log("connected to Mongobd Atlas"))
    .catch((error) => console.error(error));
