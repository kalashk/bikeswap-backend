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
exports.logoutUser = exports.updateUser = exports.deleteUser = exports.getAllUsers = exports.getUserInfo = void 0;
const Users_1 = require("../actions/Users");
const Logging_1 = __importDefault(require("../library/Logging"));
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const user = yield (0, Users_1.getUserById)(id);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        return res.status(200).json({ user });
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getUserInfo = getUserInfo;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, Users_1.getUser)();
        if (!users) {
            return res.status(404).json({ message: 'Users not found' });
        }
        return res.status(200).json(users);
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.sendStatus(500).json({ error: 'Internal server error ' });
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        if (!id)
            return res.status(200).json({ message: 'Id not set' });
        const deletedUser = yield (0, Users_1.deleteUserById)(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted' });
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.userId;
        const userData = req.body;
        if (Object.keys(userData).length === 0) {
            return res.status(400).json({ erorr: 'At least one parameter is required for update.' });
        }
        const user = yield (0, Users_1.getUserById)(id);
        if (!user)
            return res.status(404).json({ error: 'User not found ' });
        // Update user property dynamically based on the request body
        for (const [key, value] of Object.entries(userData)) {
            // Check if key exist in user schema
            if (key in user.schema.paths) {
                user[key] = value;
            }
            else {
                console.warn(`Property ${key} deos not match existing user schema`);
            }
        }
        const updatedUser = yield (0, Users_1.updateUserById)(id, userData);
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server Error' });
    }
});
exports.updateUser = updateUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sessionToken = req.cookies['BIKESWAP-AUTH'];
        if (sessionToken) {
            return res
                .cookie('BIKESWAP-AUTH', '', { expires: new Date(0) })
                .status(200)
                .json({ message: 'Logged Out' });
        }
        else {
            return res.status(200).json({ message: 'Login first' });
        }
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.logoutUser = logoutUser;
// export const addBookmarks = async (req: Request, res: Response) => {
//     try {
//         const id = req.params.userId;
//         const user = getUserById(id);
//         if(!user){
//             return res.status(400).json({error: "invalid Id"});
//         }
//         const data = req.body;
//     } catch (error) {
//         Logging.error(error);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// }
exports.default = { getUserInfo: exports.getUserInfo, getAllUsers: exports.getAllUsers, deleteUser: exports.deleteUser, updateUser: exports.updateUser, logoutUser: exports.logoutUser };
