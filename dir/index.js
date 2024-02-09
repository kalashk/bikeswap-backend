"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const Logging_1 = __importDefault(require("./library/Logging"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const compression_1 = __importDefault(require("compression"));
const body_parser_1 = __importDefault(require("body-parser"));
const router = (0, express_1.default)();
mongoose_1.default
    .connect(config_1.config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
    Logging_1.default.info('mongo connected');
})
    .catch((error) => {
    Logging_1.default.error('Unable to connect : ');
    Logging_1.default.error(error);
});
/** Server */
const StartServer = () => {
    router.use((req, res, next) => {
        Logging_1.default.info(`Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
        res.on('finish', () => {
            Logging_1.default.info(`Incoming -> Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });
        next();
    });
    router.use((0, cookie_parser_1.default)());
    router.use((0, cors_1.default)({
        origin: 'http://localhost:5173',
        credentials: true
    }));
    router.use((0, compression_1.default)());
    router.use(body_parser_1.default.json());
    /**Routes */
    router.use('/', (0, index_1.default)());
    /** Health Check */
    router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));
    /** Error handling */
    router.use((req, res, next) => {
        const error = new Error('route not-found');
        Logging_1.default.error(error);
        return res.status(404).json({ message: error.message });
    });
    http_1.default.createServer(router).listen(config_1.config.server.port, () => Logging_1.default.info(`Server is running on port ${config_1.config.server.port}`));
};
StartServer();
