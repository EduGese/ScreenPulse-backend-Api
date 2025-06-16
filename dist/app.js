"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config/config"));
const modules_1 = require("./modules");
const errorHandler_1 = require("./middlewares/errorHandler");
const swagger_1 = __importDefault(require("./utils/swagger/swagger"));
const cors_1 = __importDefault(require("./middlewares/cors"));
//execute express
const app = (0, express_1.default)();
const port = config_1.default.server.port;
// Middleware to log the origin header for debugging purposes
app.use((req, res, next) => {
    console.log('Origin header:', req.headers.origin);
    next();
});
//CORS Middleware
app.use(cors_1.default);
/// Middleware to parse JSON bodies
app.use(express_1.default.json());
//routes
app.use('/api/favorites', modules_1.favoritesModule.router);
app.use('/api/omdb', modules_1.omdbModule.router);
app.use('/api/user', modules_1.userModule.router);
// Swagger setup
(0, swagger_1.default)(app);
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// server listenening on config.server.port
app.listen(port, () => {
    console.log('Server is running on port', port);
    console.log('CORS enabled for:', config_1.default.github.url);
});
// Mongodb conection
mongoose_1.default.connect(config_1.default.mongo.url || '')
    .then(() => console.log("connected to Mongobd Atlas"))
    .catch((error) => console.error(error));
