import { Schema, model } from 'mongoose';
import { INotification } from '../types/type';


const notificationSchema = new Schema<INotification>({
    type: {
        type: String,
        maxLength: 50,
        require: true,
        enum: ["order", "payment", "account", "promotion"]
    },
    title: {
        type: String,
        maxLength: 100,
        require: true
    },
    message: {
        type: String,
        maxLength: 500,
        require: true
    },
    metadata: {
        type: Object,
        require: false
    },
    isRead: {
        type: Boolean,
        require: true,
        default: false
    },
    //tham chiếu
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    }
},
{
    timestamps: {createdAt: true, updatedAt: false}, // Thêm createdAt
    versionKey: false
}
)

export default model('notifications', notificationSchema);