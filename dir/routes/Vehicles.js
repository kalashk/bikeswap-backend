"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vehicles_1 = __importDefault(require("../controllers/Vehicles"));
const middleware_1 = require("../middleware");
exports.default = (router) => {
    router.get('/vehicles/get', Vehicles_1.default.getDisplayVehicles);
    router.get('/vehicles/:type', Vehicles_1.default.getVehicleType);
    router.get('/vehicle/:vehicleId', Vehicles_1.default.getVehicle);
    router.put('/vehicle/register', middleware_1.isAuthenticated, Vehicles_1.default.registerVehicle);
    router.patch('/vehicle/bookmark/:vehicleId', middleware_1.isAuthenticated, Vehicles_1.default.bookmarkVehicle);
    router.patch('/vehicle/:vehicleId', middleware_1.isAuthenticated, middleware_1.isVehicleOwner, Vehicles_1.default.updateVehicle);
    router.patch('/vehicle/sold/:vehicleId', middleware_1.isAuthenticated, middleware_1.isVehicleOwner, Vehicles_1.default.soldVehicle);
    router.delete('/vehicle/:vehicleId', middleware_1.isAuthenticated, middleware_1.isVehicleOwner, Vehicles_1.default.deleteVehicle);
};
