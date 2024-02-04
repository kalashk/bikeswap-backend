import express from 'express';
import controller from '../controllers/Users';
import { isAuthenticated, isOwner } from '../middleware';

export default (router: express.Router) => {
    router.get('/users/get', isAuthenticated, controller.getAllUsers);
    router.get('/users/get/:userId', isAuthenticated, isOwner, controller.getUserInfo);
    router.delete('/users/delete/:userId', isAuthenticated, isOwner, controller.deleteUser);
    router.patch('/users/update/:userId', isAuthenticated, isOwner, controller.updateUser);
    router.get('/users/logout', controller.logoutUser);
};
/**bookmark will store vehicleId */
