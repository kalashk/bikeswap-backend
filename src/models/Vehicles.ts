import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle {
    name: string;
    year: number;
    modelInfo: string;
    ownerName: string;
    ownerId: string;
    cost: number;
    contactNo: number;
    image: string;
    sold: boolean;
    type: string;
}

export interface IVehicleModel extends IVehicle, Document {}

const VehicleSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        year: { type: Number, required: true },
        modelInfo: { type: String, required: true },
        ownerName: { type: String, required: true },
        ownerId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        type: { type: String, enum: ['bike', 'scooty', 'cycle'], required: true },
        cost: { type: Number, required: true },
        contactNo: { type: Number, required: true },
        image: { type: String, required: true },
        sold: { type: Boolean, default: false }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<IVehicleModel>('Vehicle', VehicleSchema);
