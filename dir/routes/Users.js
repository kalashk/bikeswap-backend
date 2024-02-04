"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Users_1 = __importDefault(require("../controllers/Users"));
const middleware_1 = require("../middleware");
exports.default = (router) => {
    router.get('/users/get', middleware_1.isAuthenticated, Users_1.default.getAllUsers);
    router.get('/users/get/:userId', middleware_1.isAuthenticated, middleware_1.isOwner, Users_1.default.getUserInfo);
    router.delete('/users/delete/:userId', middleware_1.isAuthenticated, middleware_1.isOwner, Users_1.default.deleteUser);
    router.patch('/users/update/:userId', middleware_1.isAuthenticated, middleware_1.isOwner, Users_1.default.updateUser);
    router.get('/users/logout', Users_1.default.logoutUser);
};
/**bookmark will store vehicleId */
