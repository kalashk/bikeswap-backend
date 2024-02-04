import express, { NextFunction } from 'express';
import Request from '../types/Request';
import { merge, get } from 'lodash';
import { getUserBySessionToken } from '../actions/Users';
import Logging from '../library/Logging';
import mongoose from 'mongoose';

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const sessionToken = req.cookies['BIKESWAP-AUTH'];
        if (!sessionToken) return res.status(400).json({ error: 'Login first' });
        const existingUser = await getUserBySessionToken(sessionToken);
        if (!existingUser) return res.status(403).json({ message: 'User doesnt exist' });
        merge(req, { identity: existingUser });
        //Logging.warn('isAuthenticated');
        next();
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const isOwner = async (req: express.Request, res: express.Response, next: NextFunction) => {
    try {
        const id = req.params.userId;
        const currentUserId = get(req, 'identity._id') as string | undefined;
        if (!currentUserId) return res.status(400);
        if (currentUserId.toString() !== id) return res.status(403);

        next();
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const isVehicleOwner = async (req: Request, res: express.Response, next: express.NextFunction) => {
    try {
        const user = req.identity;
        const { vehicleId } = req.params;
        const Id = new mongoose.Types.ObjectId(vehicleId);
        if (!(user && user.vehicles && user.vehicles.some)) return res.status(404).json({ error: 'User not definde properly' });
        let isPresent = false;
        for (const id of user.vehicles) {
            if (id.equals(Id)) isPresent = true;
        }
        if (!isPresent) return res.status(404).json({ error: 'You are not the owner' });
        //Logging.warn('isVehicleOwner');
        next();
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
