"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isVehicleOwner = exports.isOwner = exports.isAuthenticated = void 0;
const lodash_1 = require("lodash");
const Users_1 = require("../actions/Users");
const Logging_1 = __importDefault(require("../library/Logging"));
const mongoose_1 = __importDefault(require("mongoose"));
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionToken = req.cookies['BIKESWAP-AUTH'];
        if (!sessionToken)
            return res.status(400).json({ error: 'Login first' });
        const existingUser = yield (0, Users_1.getUserBySessionToken)(sessionToken);
        if (!existingUser)
            return res.status(403).json({ message: 'User doesnt exist' });
        (0, lodash_1.merge)(req, { identity: existingUser });
        //Logging.warn('isAuthenticated');
        next();
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.isAuthenticated = isAuthenticated;
const isOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const currentUserId = (0, lodash_1.get)(req, 'identity._id');
        if (!currentUserId)
            return res.status(400).json({ msg: 'invalid user Id' });
        if (currentUserId.toString() !== id)
            return res.status(403);
        next();
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isOwner = isOwner;
const isVehicleOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.identity;
        const { vehicleId } = req.params;
        const Id = new mongoose_1.default.Types.ObjectId(vehicleId);
        if (!(user && user.vehicles && user.vehicles.some))
            return res.status(404).json({ error: 'User not definde properly' });
        let isPresent = false;
        for (const id of user.vehicles) {
            if (id.equals(Id))
                isPresent = true;
        }
        if (!isPresent)
            return res.status(404).json({ error: 'You are not the owner' });
        //Logging.warn('isVehicleOwner');
        next();
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.isVehicleOwner = isVehicleOwner;
