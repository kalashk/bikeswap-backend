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
exports.soldVehicle = exports.deleteVehicle = exports.updateVehicle = exports.bookmarkVehicle = exports.registerVehicle = exports.getVehicle = exports.getVehicleType = exports.getDisplayVehicles = void 0;
const Logging_1 = __importDefault(require("../library/Logging"));
const Vehicles_1 = require("../actions/Vehicles");
const Users_1 = require("../actions/Users");
const getDisplayVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bike = yield (0, Vehicles_1.getVehiclesByType)('bike').limit(1);
        const scooty = yield (0, Vehicles_1.getVehiclesByType)('scooty').limit(1);
        const cycle = yield (0, Vehicles_1.getVehiclesByType)('cycle').limit(1);
        return res.status(200).json({ bike: bike, scooty: scooty, cycle: cycle });
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getDisplayVehicles = getDisplayVehicles;
const getVehicleType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.type;
        const vehicles = yield (0, Vehicles_1.getVehiclesByType)(type);
        return res.status(200).json(vehicles);
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getVehicleType = getVehicleType;
const getVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.vehicleId;
        const vehicle = yield (0, Vehicles_1.getVehicleById)(id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        return res.status(200).json({ vehicle: vehicle });
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getVehicle = getVehicle;
const registerVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicleData = req.body;
        const owner = req.identity;
        const registered = yield (0, Vehicles_1.createVehicle)(Object.assign(Object.assign({}, vehicleData), { ownerId: owner._id, ownerName: owner.name, contactNo: owner.mobileNumber }));
        if (!registered)
            return res.status(400).json({ error: 'could not be registered' });
        owner.vehicles.push(registered._id);
        const updatedOwner = yield (0, Users_1.updateUserById)(registered.ownerId, owner);
        if (!updatedOwner)
            return res.status(400).json({ error: 'Not updated' });
        return res.status(200).json({ registered });
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.registerVehicle = registerVehicle;
const bookmarkVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vehicleId } = req.params;
        const vehicleExist = yield (0, Vehicles_1.getVehicleById)(vehicleId);
        if (!vehicleExist)
            return res.status(404).json({ error: 'Vehicle not found' });
        const user = req.identity;
        if (!user)
            return res.status(404).json({ error: 'Login first' });
        user.bookmarks.push(vehicleId);
        const updatedUser = yield (0, Users_1.updateUserById)(user._id, user);
        if (!updatedUser)
            return res.status(400).json({ error: 'Bookmark not added' });
        return res.status(200).json({ updatedUser });
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.bookmarkVehicle = bookmarkVehicle;
const updateVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.vehicleId;
        const vehicle = yield (0, Vehicles_1.getVehicleById)(id);
        if (!vehicle)
            return res.status(404).json({ error: 'Vehicle not found' });
        const vehicleData = req.body;
        if (Object.keys(vehicleData).length === 0)
            return res.status(400).json({ error: 'Atleast one parameter should be updated' });
        for (const [key, value] of Object.entries(vehicleData)) {
            if (key in vehicle.schema.paths) {
                vehicle[key] = value;
            }
            else {
                Logging_1.default.error(`Property ${key} does not match Vehicle Schema`);
            }
        }
        const updatedVehicle = yield (0, Vehicles_1.updateVehicleById)(id, vehicleData);
        if (!updatedVehicle)
            return res.status(400).json({ error: 'Not updated' });
        return res.status(200).json(updatedVehicle);
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateVehicle = updateVehicle;
const deleteVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.vehicleId;
        const deletedVehicle = yield (0, Vehicles_1.deleteVehicleById)(id);
        if (!deletedVehicle)
            return res.status(400).json({ error: 'vehicle not found' });
        return res.status(200).json({ message: 'vehicle deleted' });
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteVehicle = deleteVehicle;
const soldVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.vehicleId;
        const soldVehicle = yield (0, Vehicles_1.updateVehicleById)(id, { $set: { sold: true } });
        if (!soldVehicle)
            return res.status(400).json({ error: 'Not updated' });
        return res.status(200).json({ msg: 'Vehicle Updated', soldVehicle });
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.soldVehicle = soldVehicle;
exports.default = { getDisplayVehicles: exports.getDisplayVehicles, getVehicleType: exports.getVehicleType, getVehicle: exports.getVehicle, registerVehicle: exports.registerVehicle, bookmarkVehicle: exports.bookmarkVehicle, updateVehicle: exports.updateVehicle, deleteVehicle: exports.deleteVehicle, soldVehicle: exports.soldVehicle };
