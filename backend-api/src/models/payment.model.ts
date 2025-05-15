import { Schema, model } from 'mongoose';
import { IPayment } from '../types/type';


const paymentSchema = new Schema<IPayment>({
    amount: {
        type: Number,
        require: true,
        min: 0,
        default: 0
    },
    method: {
        type: String,
        require: true,
        maxLength: 50,
        enum: ["credit_card", "paypal", "cod"]
    },
    status: {
        type: String,
        require: true,
        maxLength: 20,
        enum: ["pending", "completed", "failed", "refunded"],
        default: "pending"
    },
    transactionId: {
        type: String,
        require: false,
        maxLength: 100
    },
    gateway: {
        type: String,
        require: false,
        maxLength: 50
    },
    metadata: {
        type: Object,
        require: false
    },
    //tham chiếu
    order: {
        type: Schema.Types.ObjectId,
        ref: 'orders',
        require: true
    },
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

export default model('payments', paymentSchema);