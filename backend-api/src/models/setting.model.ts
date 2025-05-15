import { Schema, model } from 'mongoose';
import { ISetting } from '../types/type';


const settingSchema = new Schema<ISetting>({
    key: {
        type: String,
        maxLength: 100,
        require: true,
        unique: true
    },
    value: {
        type: Schema.Types.Mixed,
        require: true
    },
    type: {
        type: String,
        maxLength: 20,
        require: true,
        enum: ["string", "number", "boolean", "object", "array"]
    },
    group: {
        type: String,
        maxLength: 50,
        require: true
    },
    isPublic: {
        type: Boolean,
        require: true,
        default: false
    },
    description: {
        type: String,
        maxLength: 255,
        require: false
    }
},
{
    timestamps: true, // Thêm createdAt và updatedAt
    versionKey: false
}
)

export default model('settings', settingSchema);
