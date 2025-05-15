import { Schema, model } from 'mongoose';
import { IProductVariant } from '../types/type';


const productVariantSchema = new Schema<IProductVariant>({
    sku: {
        type: String,
        maxLength: 50,
        require: true,
        unique: true
    },
    variantName: {
        type: String,
        maxLength: 100,
        require: true,
    },
    attributes: {
        type: Object,
        require: true
    },
    price: {
        type: Number,
        require: true,
        min: 0
    },
    salePrice: {
        type: Number,
        require: false,
        min: 0
    },
    stock: {
        type: Number,
        require: true,
        default: 0,
        min: 0
    },
    images: {
        type: [String],
        require: false,
        default: []
    },
    isActive: {
        type: Boolean,
        require: true,
        default: true
    },
    //tham chiếu
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        require: true
    }
},
{
    timestamps: true, // Thêm createdAt và updatedAt
    versionKey: false
}
)

export default model('productVariants', productVariantSchema);
