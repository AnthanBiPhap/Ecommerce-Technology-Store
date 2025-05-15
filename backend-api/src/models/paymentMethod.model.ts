import { Schema, model } from 'mongoose';
import { IPaymentMethod } from '../types/type';


const paymentMethodSchema = new Schema<IPaymentMethod>({
    type: {
        type: String,
        maxLength: 20,
        require: true,
        enum: ["credit_card", "paypal", "bank_account"]
    },
    provider: {
        type: String,
        maxLength: 50,
        require: true
    },
    accountNumber: {
        type: String,
        maxLength: 50,
        require: false
    },
    expiryDate: {
        type: Date,
        require: false
    },
    cardholderName: {
        type: String,
        maxLength: 100,
        require: false
    },
    billingAddress: {
        type: Object,
        require: false,
    },
    isDefault: {
        type: Boolean,
        require: true,
        default: false
    },
    metadata: {
        type: Object,
        require: false
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

export default model('paymentMethods', paymentMethodSchema);
