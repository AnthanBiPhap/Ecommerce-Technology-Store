import { Schema, model } from 'mongoose';
import { ICoupon } from '../types/type';


const couponSchema = new Schema<ICoupon>({
    code: {
        type: String,
        maxLength: 50,
        require: true,
        unique: true
    },
    type: {
        type: String,
        maxLength: 20,
        require: true,
        enum: ["percentage", "fixed"]
    },
    value: {
        type: Number,
        min: 0,
        require: true
    },
    minPurchase: {
        type: Number,
        require: false,
        min: 0,
        default: 0
    },
    startDate: {
        type: Date,
        require: true
    },
    endDate: {
        type: Date,
        require: true
    },
    usageLimit: {
        type: Number,
        min: 0,
        require: false
    },
    usageCount: {
        type: Number,
        require: true,
        min: 0,
        default: 0
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

export default model('coupons', couponSchema);
