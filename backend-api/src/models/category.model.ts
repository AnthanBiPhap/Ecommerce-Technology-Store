import { Schema, model } from 'mongoose';
import { ICategory } from '../types/type';


const categorySchema = new Schema<ICategory>({
    category_name: {
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
    parentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Category', 
        default: null 
    },
    level: {
        type: Number,
        require: true,
        default: 0
    },
    imageUrl: {
        type: String,
        maxLength:255,
        require: true,
        trim: true,
    },
    isActive: {
        type: Boolean,
        require: true,
        default: true
    }
},
{
    timestamps: true, // Thêm createdAt và updatedAt
    versionKey: false
}
)

export default model('Category', categorySchema);
