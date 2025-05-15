import { model, Schema } from "mongoose";
import { IOrder } from "../types/type";


const orderSchema = new Schema<IOrder>({
    orderNumber: {
        type: String,
        maxlength: 50,
        require: true,
        unique: true
    },
    products: {
        type: [Object],
        require: true
    },
    totalAmount: {
        type: Number,
        min: 0,
        require: true,
        default: 0
    },
    shippingFee: {
        type: Number,
        min: 0,
        require: true,
        default: 0
    },
    tax: {
        type: Number,
        min: 0,
        require: true,
        default: 0
    },
    discount: {
        type: Number,
        min: 0,
        require: true,
        default: 0
    },
    paymentMethod: {
        type: String,
        maxlength: 50,
        require: true,
        enum: ["credit_card", "paypal", "cod"],
    },
    paymentStatus: {
        type: String,
        maxlength: 50,
        require: true,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    shippingAddress: {
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
    shippingInfor: {
        type: {
          recipientName: { type: String },
          phone: { type: String },
          gender: { type: String }
        },
        required: true
    },
    status: {
        type: String,
        maxlength: 50,
        require: true,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    notes: {
        type: String,
        maxlength: 500,
        require: false
    },
    orderDate: {
        type: Date,
        require: true
    },
    //tham chiếu
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
},
{
    timestamps: true,
    versionKey: false
})

export default model('orders', orderSchema)