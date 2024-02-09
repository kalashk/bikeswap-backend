"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.SECRET = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URL = 'mongodb+srv://jaiswal18kalash:lJNy9lv0VPUNuu3m@100xdevs.ci8ifwr.mongodb.net/';
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 9090;
exports.SECRET = process.env.SECRET_KEY || 'harish';
exports.config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    }
};
