import { Schema, model } from 'mongoose';
import { ISEO } from '../types/type';


const seoSchema = new Schema<ISEO>({
    entityType: {
        type: String,
        maxLength: 50,
        require: true,
        enum: ["products", "Category", "vendors", "pages"]
    },
    entityId: {
        type: Schema.Types.ObjectId,
        refPath: 'entityType',
        require: true
    },
    metaTitle: {
        type: String,
        maxLength: 100,
        require: false,
    },
    metaDescription: {
        type: String,
        maxLength: 200,
        require: false,
    },
    metaKeywords: {
        type: String,
        maxLength: 200,
        require: false,
    },
    ogTitle: {
        type: String,
        maxLength: 100,
        require: false,
    },
    ogDescription: {
        type: String,
        maxLength: 200,
        require: false,
    },
    ogImage: {
        type: String,
        maxLength: 255,
        require: false,
    },
    canonicalUrl: {
        type: String,
        maxLength: 255,
        require: false,
    },
},
{
    timestamps: true, // Thêm createdAt và updatedAt
    versionKey: false
}
)

export default model('SEOs', seoSchema);
