import { Schema, model } from 'mongoose';
import { IVendor } from '../types/type';


const vendorSchema = new Schema<IVendor>({
    companyName: {
        type: String,
        unique: true,
        require: true,
        maxLength: 100
    },
    description: {
        type: String,
        require: false,
        maxLength: 1000,
        trim: true
    },
    logoUrl: {
        type: String,
        require: false,
        maxLength: 255
    },
    coverImageUrl: {
        type: String,
        require: false,
        maxLength: 255
    },
    address: {
        type: {
          street: { type: String },
          ward: { type: String },
          district: { type: String },
          city: { type: String },
          country: { type: String },
          postalCode: { type: String }
        },
        required: true
      },
    contactPhone: {
        type: String,
        require: true,
        maxLength: 20
    },
    contactEmail: {
        type: String,
        unique: true,
        require: true,
        maxLength: 100
    },
    website: {
        type: String,
        unique: true,
        require: false,
        maxLength: 255
    },
    socialLinks: Object,
    rating: {
        type: Number,
        min: 0,
        max: 5,
        require: true,
        default: 0
    },
    status: {
        type: String,
        require: true,
        maxLength: 20,
        default: "pending",
        enum: ["pending", "active", "suspended"]
    },
    //tham chiếu
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
},
{
    timestamps: true, // Thêm createdAt và updatedAt
    versionKey: false
}
)

export default model('vendors', vendorSchema);