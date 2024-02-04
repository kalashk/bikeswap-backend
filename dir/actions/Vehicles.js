"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVehicleById = exports.deleteVehicleById = exports.createVehicle = exports.getVehicleById = exports.getVehiclesByType = void 0;
const Vehicles_1 = __importDefault(require("../models/Vehicles"));
const getVehiclesByType = (type) => Vehicles_1.default.find({ type: type });
exports.getVehiclesByType = getVehiclesByType;
const getVehicleById = (id) => Vehicles_1.default.findById(id);
exports.getVehicleById = getVehicleById;
const createVehicle = (values) => new Vehicles_1.default(values).save().then((vehicle) => vehicle.toObject());
exports.createVehicle = createVehicle;
const deleteVehicleById = (id) => Vehicles_1.default.findByIdAndDelete({ _id: id });
exports.deleteVehicleById = deleteVehicleById;
const updateVehicleById = (id, values) => Vehicles_1.default.findByIdAndUpdate(id, values, { new: true });
exports.updateVehicleById = updateVehicleById;
