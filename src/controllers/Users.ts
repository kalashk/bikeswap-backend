import { Request, Response } from 'express';
import { deleteUserById, getUser, getUserByEmail, getUserById, updateUserById } from '../actions/Users';
import Logging from '../library/Logging';

export const getUserInfo = async (req: Request, res: Response) => {
    try {
        const id = req.params.userId;
        const user = await getUserById(id);
        console.log(user);

        if (!user) return res.status(404).json({ error: 'User not found' });

        return res.status(200).json({ user });
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUser();
        if (!users) {
            return res.status(404).json({ message: 'Users not found' });
        }
        return res.status(200).json(users);
    } catch (error) {
        Logging.error(error);
        return res.sendStatus(500).json({ error: 'Internal server error ' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.userId;
        if (!id) return res.status(200).json({ message: 'Id not set' });

        const deletedUser = await deleteUserById(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.userId;
        const userData = req.body;

        if (Object.keys(userData).length === 0) {
            return res.status(401).json({ msg: 'At least one parameter is required for update.' });
        }
        const user = await getUserById(id);
        if (!user) return res.status(404).json({ error: 'User not found ' });

        // Update user property dynamically based on the request body
        for (const [key, value] of Object.entries(userData)) {
            // Check if key exist in user schema
            if (key in user.schema.paths) {
                (user as any)[key] = value;
            } else {
                console.warn(`Property ${key} deos not match existing user schema`);
            }
        }

        const updatedUser = await updateUserById(id, userData);

        return res.status(200).json(updatedUser);
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server Error' });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    try {
        const sessionToken = req.cookies['BIKESWAP-AUTH'];
        if (sessionToken) {
            return res
                .cookie('BIKESWAP-AUTH', '', { expires: new Date(0) })
                .status(200)
                .json({ message: 'Logged Out' });
        } else {
            return res.status(200).json({ message: 'Login first' });
        }
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default { getUserInfo, getAllUsers, deleteUser, updateUser, logoutUser };
