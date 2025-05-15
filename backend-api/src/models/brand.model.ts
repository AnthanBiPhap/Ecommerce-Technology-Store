import { Schema, model } from 'mongoose';
import { IBrand } from '../types/type';


const brandSchema = new Schema<IBrand>({
    brand_name: {
        type: String,
        maxLength: 50,
        minLength: 2,
        require: true,
        unique: true
    },
    description: {
        type: String,
        maxLength: 500,
        require: true,
        unique: false,
        trim: true,
        default: ""
    },
    slug: {
        type: String,
        maxLength: 50,
        minLength: 2,
        require: true,
        unique: true,
        lowercase: true
    },
},
{
    timestamps: true, // Thêm createdAt và updatedAt
    versionKey: false
}
)

export default model('brands', brandSchema);
