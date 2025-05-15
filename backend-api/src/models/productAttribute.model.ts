import { Schema, model } from 'mongoose';
import { IProductAttribute } from '../types/type';


const productAtributeSchema = new Schema<IProductAttribute>({
    name: {
        type: String,
        maxLength: 50,
        require: true,
        unique: true
    },
    displayName: {
        type: String,
        maxLength: 100,
        require: true
    },
    description: {
        type: String,
        maxLength: 255,
        require: false
    },
    type: {
        type: String,
        maxLength: 20,
        require: true,
        enum: ["text", "number", "boolean", "select"]
    },
    options: {
        type: [String],
        require: false
    },
    isFilterable: {
        type: Boolean,
        require: true,
        default: false
    },
    isVariant: {
        type: Boolean,
        require: true,
        default: false
    },
    isRequired: {
        type: Boolean,
        require: true,
        default: false
    }
},
{
    timestamps: true, // Thêm createdAt và updatedAt
    versionKey: false
}
)

export default model('productAttributes', productAtributeSchema);
