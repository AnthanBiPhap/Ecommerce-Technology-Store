import { Schema, model } from 'mongoose';
import { IAddress } from '../types/type';


const addressSchema = new Schema<IAddress>({
    type: {
        type: String,
        maxLength: 50,
        require: true,
        enum: ["shipping", "billing"]
    },
    fullName: {
        type: String,
        maxLength: 100,
        require: true
    },
    phoneNumber: {
        type: String,
        maxLength: 20,
        require: true
    },
    street: {
        type: String,
        maxLength: 255,
        require: true
    },
    ward: {
        type: String,
        maxLength: 255,
        require: true
    },
    district: {
        type: String,
        maxLength: 255,
        require: true
    },
    city: {
        type: String,
        maxLength: 100,
        require: true
    },
    country: {
        type: String,
        maxLength: 100,
        require: true
    },
    isDefault: {
        type: Boolean,
        require: true,
        default: false
    },
    //tham chiếu
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    }
},
{
    timestamps: true, // Thêm createdAt và updatedAt
    versionKey: false
}
)

export default model('addresses', addressSchema);