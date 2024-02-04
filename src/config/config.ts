import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = 'mongodb+srv://jaiswal18kalash:lJNy9lv0VPUNuu3m@100xdevs.ci8ifwr.mongodb.net/';

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
