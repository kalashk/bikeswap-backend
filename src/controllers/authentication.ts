import { Request, Response } from 'express';
import { createUser, getUserByEmail } from '../actions/Users';
import { authentication, random } from '../library/authentication';
import Logging from '../library/Logging';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Provide proper email/password' });
        }
        const user = await getUserByEmail(email).select('authentication.salt authentication.password');
        if (!user) {
            return res.status(400).json({ message: 'User did not exist' });
        }
        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password === expectedHash) {
            user.authentication.sessionToken = authentication(user.authentication.salt, user._id.toString());
            await user.save();
            res.cookie('BIKESWAP-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' });
            return res.status(200).json({ message: 'You are Logged in' });
        } else {
            return res.status(403).json({ message: 'wrong password' });
        }
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const user = req.body;
        const existingUser = await getUserByEmail(user.email);
        if (existingUser) return res.status(400).json({ message: 'User already exist' });
        const salt = random();
        const passowrd = user.password;
        const newUser = await createUser({
            ...(({ password, ...rest }) => rest)(user),
            authentication: {
                salt,
                password: authentication(salt, passowrd)
            }
        });
        Logging.warn({ password: user.password });
        if (!newUser) return res.status(500).json({ error: 'Failed to create user' });
        // user is sent as respons only during developnment, not in real senario.
        return res.status(200).json({ message: 'User created Successfully', user: newUser }).end();
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ message: 'Internal Server error' });
    }
};
