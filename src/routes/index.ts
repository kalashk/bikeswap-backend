import express from 'express';
import authentication from './authentication';
import user from './Users';
import vehicles from './Vehicles';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    user(router);
    vehicles(router);

    return router;
};
