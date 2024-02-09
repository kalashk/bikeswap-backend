import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = 'mongodb://127.0.0.1:27017/bikes';

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 9090;

export const SECRET = process.env.SECRET_KEY || 'harish';

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    }
};
