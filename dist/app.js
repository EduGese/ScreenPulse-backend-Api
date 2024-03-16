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
//execute express
const app = (0, express_1.default)();
const port = config_1.default.server.port;
//CORS
var corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
    maxAge: 500,
    origin: config_1.default.client.url,
};
app.use((0, cors_1.default)(corsOptions));
//routes
app.use(express_1.default.json());
app.use('/api', modules_1.favoritesModule.router, modules_1.omdbModule.router, modules_1.userModule.router);
// server listenening on config.server.port
app.listen(port, () => {
    console.log('Server is running on port', port);
});
// Mongodb conection
mongoose_1.default.connect(config_1.default.mongo.url || '')
    .then(() => console.log("connected to Mongobd Atlas"))
    .catch((error) => console.error(error));
