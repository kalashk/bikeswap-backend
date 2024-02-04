import { Response } from 'express';
import Request from '../types/Request';
import Logging from '../library/Logging';
import { createVehicle, deleteVehicleById, getVehicleById, getVehiclesByType, updateVehicleById } from '../actions/Vehicles';
import { updateUserById } from '../actions/Users';

export const getDisplayVehicles = async (req: Request, res: Response) => {
    try {
        const bike = await getVehiclesByType('bike').limit(1);
        const scooty = await getVehiclesByType('scooty').limit(1);
        const cycle = await getVehiclesByType('cycle').limit(1);
        return res.status(200).json({ bike: bike, scooty: scooty, cycle: cycle });
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getVehicleType = async (req: Request, res: Response) => {
    try {
        const type = req.params.type;
        const vehicles = await getVehiclesByType(type);

        return res.status(200).json(vehicles);
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const getVehicle = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId;
        const vehicle = await getVehicleById(id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        return res.status(200).json({ vehicle: vehicle });
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const registerVehicle = async (req: Request, res: Response) => {
    try {
        const vehicleData = req.body;
        const owner = req.identity;
        const registered = await createVehicle({ ...vehicleData, ownerId: owner._id, ownerName: owner.name, contactNo: owner.mobileNumber });
        if (!registered) return res.status(400).json({ error: 'could not be registered' });
        owner.vehicles.push(registered._id);
        const updatedOwner = await updateUserById(registered.ownerId, owner);
        if (!updatedOwner) return res.status(400).json({ error: 'Not updated' });
        return res.status(200).json({ registered });
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const bookmarkVehicle = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        const vehicleExist = await getVehicleById(vehicleId);
        if (!vehicleExist) return res.status(404).json({ error: 'Vehicle not found' });
        const user = req.identity;
        if (!user) return res.status(404).json({ error: 'Login first' });
        user.bookmarks.push(vehicleId);
        const updatedUser = await updateUserById(user._id, user);
        if (!updatedUser) return res.status(400).json({ error: 'Bookmark not added' });
        return res.status(200).json({ updatedUser });
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateVehicle = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId;
        const vehicle = await getVehicleById(id);
        if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
        const vehicleData = req.body;
        if (Object.keys(vehicleData).length === 0) return res.status(400).json({ error: 'Atleast one parameter should be updated' });
        for (const [key, value] of Object.entries(vehicleData)) {
            if (key in vehicle.schema.paths) {
                (vehicle as any)[key] = value;
            } else {
                Logging.error(`Property ${key} does not match Vehicle Schema`);
            }
        }
        const updatedVehicle = await updateVehicleById(id, vehicleData);
        if (!updatedVehicle) return res.status(400).json({ error: 'Not updated' });
        return res.status(200).json(updatedVehicle);
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId;
        const deletedVehicle = await deleteVehicleById(id);
        if (!deletedVehicle) return res.status(400).json({ error: 'vehicle not found' });
        return res.status(200).json({ message: 'vehicle deleted' });
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const soldVehicle = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId;
        const soldVehicle = await updateVehicleById(id, { $set: { sold: true } });
        if (!soldVehicle) return res.status(400).json({ error: 'Not updated' });
        return res.status(200).json({ msg: 'Vehicle Updated', soldVehicle });
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export default { getDisplayVehicles, getVehicleType, getVehicle, registerVehicle, bookmarkVehicle, updateVehicle, deleteVehicle, soldVehicle };
