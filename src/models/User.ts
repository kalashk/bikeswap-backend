import mongoose, { Document, Schema } from 'mongoose';

export interface IUser {
    name: string;
    email: string;
    gender: string;
    mobileNumber: number;
    authentication: {
        password: string;
        salt: string;
        sessionToken: string;
    };
    bookmarks: string[];
    vehicles: string[];
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        gender: { type: String, enum: ['male', 'female'], required: true },
        mobileNumber: { type: Number, required: true },
        authentication: {
            password: { type: String, required: true, select: false },
            salt: { type: String, required: true, select: false },
            sessionToken: { type: String, select: false }
        },
        bookmarks: [{ type: Schema.Types.ObjectId, required: true, ref: 'Vehicle' }],
        vehicles: [{ type: Schema.Types.ObjectId, required: true, ref: 'Vehicle' }]
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IUserModel>('User', UserSchema);
