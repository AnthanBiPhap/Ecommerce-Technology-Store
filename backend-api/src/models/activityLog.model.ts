import { Schema, model } from 'mongoose';
import { IActivityLog } from '../types/type';


const activityLogSchema = new Schema<IActivityLog>({
    action: {
        type: String,
        maxLength: 50,
        require: true
    },
    entityType: {
        type: String,
        maxLength: 50,
        require: true
    },
    entityId: {
        type: Schema.Types.ObjectId,
        refPath: 'entityType',
        require: false
    },
    description: {
        type: String,
        maxLength: 255,
        require: true
    },
    metadata: {
        type: Object,
        require: false
    },
    ipAddress: {
        type: String,
        maxLength: 50,
        require: false
    },
    userAgent: {
        type: String,
        maxLength: 255,
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
    timestamps: {createdAt: true, updatedAt: false}, // Thêm createdAt
    versionKey: false
}
)

export default model('activityLogs', activityLogSchema);
