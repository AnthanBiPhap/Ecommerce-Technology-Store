import { Schema, model } from 'mongoose';
import { IWishlist } from '../types/type';


const wishlistSchema = new Schema<IWishlist>({
    //tham chiếu
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        require: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        require: true
    },
},
{
    timestamps: { createdAt: true, updatedAt: false }, // Thêm createdAt
    versionKey: false
}
)

export default model('wishlists', wishlistSchema);