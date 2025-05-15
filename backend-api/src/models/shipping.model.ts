import { Schema, model } from 'mongoose';
import { IShipping } from '../types/type';


const shippingSchema = new Schema<IShipping>({
    carrier: {
        type: String,
        maxLength: 100,
        require: true
    },
    trackingNumber: {
        type: String,
        maxLength: 100,
        require: false
    },
    status: {
        type: String,
        maxLength: 20,
        require: true,
        enum: ["processing", "shipped", "delivered", "failed"],
        default: "processing"
    },
    estimatedDelivery: {
        type: Date,
        require: false
    },
    actualDelivery: {
        type: Date,
        require: false
    },
    shippingMethod: {
        type: String,
        maxLength: 50,
        require: true
    },
    shippingFee: {
        type: Number,
        require: true,
        default: 0,
        min: 0
    },
    //tham chiếu
    order: {
        type: Schema.Types.ObjectId,
        ref: 'orders',
        require: true
    }
},
{
    timestamps: true, // Thêm createdAt và updatedAt
    versionKey: false
}
)

export default model('shippings', shippingSchema);