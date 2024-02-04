import VehicleModel from '../models/Vehicles';

export const getVehiclesByType = (type: string) => VehicleModel.find({ type: type });

export const getVehicleById = (id: string) => VehicleModel.findById(id);

export const createVehicle = (values: Record<string, any>) => new VehicleModel(values).save().then((vehicle) => vehicle.toObject());

export const deleteVehicleById = (id: string) => VehicleModel.findByIdAndDelete({ _id: id });

export const updateVehicleById = (id: string, values: Record<string, any>) => VehicleModel.findByIdAndUpdate(id, values, { new: true });
