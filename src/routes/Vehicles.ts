import express from 'express';
import controller from '../controllers/Vehicles';
import { isAuthenticated, isVehicleOwner } from '../middleware';

export default (router: express.Router) => {
    router.get('/vehicles/get', controller.getDisplayVehicles);
    router.get('/vehicles/:type', controller.getVehicleType);
    router.get('/vehicle/:vehicleId', controller.getVehicle);
    router.put('/vehicle/register', isAuthenticated, controller.registerVehicle);
    router.patch('/vehicle/bookmark/:vehicleId', isAuthenticated, controller.bookmarkVehicle);
    router.patch('/vehicle/:vehicleId', isAuthenticated, isVehicleOwner, controller.updateVehicle);
    router.patch('/vehicle/sold/:vehicleId', isAuthenticated, isVehicleOwner, controller.soldVehicle);
    router.delete('/vehicle/:vehicleId', isAuthenticated, isVehicleOwner, controller.deleteVehicle);
};
