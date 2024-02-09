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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const Users_1 = require("../actions/Users");
const authentication_1 = require("../library/authentication");
const Logging_1 = __importDefault(require("../library/Logging"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Provide proper email/password' });
        }
        const user = yield (0, Users_1.getUserByEmail)(email).select('authentication.salt authentication.password');
        if (!user) {
            return res.status(400).json({ message: 'User did not exist' });
        }
        const userInfo = yield (0, Users_1.getUserById)(user._id);
        const expectedHash = (0, authentication_1.authentication)(user.authentication.salt, password);
        if (user.authentication.password === expectedHash) {
            user.authentication.sessionToken = (0, authentication_1.authentication)(user.authentication.salt, user._id.toString());
            yield user.save();
            res.cookie('BIKESWAP-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
            return res.status(200).json({ userInfo });
        }
        else {
            return res.status(403).json({ message: 'wrong password' });
        }
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const existingUser = yield (0, Users_1.getUserByEmail)(user.email);
        if (existingUser)
            return res.status(400).json({ message: 'User already exist' });
        const salt = (0, authentication_1.random)();
        const passowrd = user.password;
        const newUser = yield (0, Users_1.createUser)(Object.assign(Object.assign({}, ((_a) => {
            var { password } = _a, rest = __rest(_a, ["password"]);
            return rest;
        })(user)), { authentication: {
                salt,
                password: (0, authentication_1.authentication)(salt, passowrd)
            } }));
        Logging_1.default.warn({ password: user.password });
        if (!newUser)
            return res.status(500).json({ error: 'Failed to create user' });
        // user is sent as respons only during developnment, not in real senario.
        return res.status(200).json({ message: 'User created Successfully', user: newUser }).end();
    }
    catch (error) {
        Logging_1.default.error(error);
        return res.status(500).json({ message: 'Internal Server error' });
    }
});
exports.register = register;
