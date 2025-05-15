import { Schema, model } from 'mongoose';
import { IReview } from '../types/type';


const reviewSchema = new Schema<IReview>({
    rating: {
        type: Number,
        require: true,
        min: 1,
        max: 5
    },
    title: {
        type: String,
        require: false,
        maxLength: 100
    },
    comment: {
        type: String,
        require: true,
        maxLength: 1000,
        trim: true
    },
    images: {
        type: [String],
        require: false,
        default: []
    },
      isVerified: {
        type: Boolean,
        require: true,
        default: false
    },
    //tham chiếu
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
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

export default model('reviews', reviewSchema);