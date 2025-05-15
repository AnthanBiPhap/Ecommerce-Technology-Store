import { Schema, model } from 'mongoose';
import { IProductInventory } from '../types/type';


const productInventorySchema = new Schema<IProductInventory>({
    quantity: {
        type: Number,
        min: 0,
        require: true,
        default: 0
    },
    reservedQuantity: {
        type: Number,
        min: 0,
        require: true,
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        min: 0,
        require: false
    },
    lastRestocked: {
        type: Date,
        require: false
    },
    //tham chiếu
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        require: true
    },
    variant: {
        type: Schema.Types.ObjectId,
        ref: 'productVariants',
        require: false
    },
    location: {
        type: Schema.Types.ObjectId,
        ref: 'locations',
        require: false
    },
},
{
    timestamps: true, // Thêm createdAt và updatedAt
    versionKey: false
}
)

export default model('productInventories', productInventorySchema);
