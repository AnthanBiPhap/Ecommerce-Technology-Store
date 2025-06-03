import { model, Schema } from "mongoose";
import { IProduct } from "../types/type";


const productSchema = new Schema<IProduct>({
    product_name: {
        type: String,
        maxlength: 255,
        require: true,
        unique: true
    },
    description: {
        type: String,
        maxlength: 2000,
        trim: true,
        require: true
    },
    slug: {
        type: String,
        maxlength: 300,
        require: true,
        unique: true
    },
    price: {
        type: Number,
        min: 0,
        require: true
    },
    salePrice: {
        type: Number,
        min: 0,
        require: false
    },
    stock: {
        type: Number,
        min: 0,
        max: 100,
        require: true,
        default: 0
    },
    images: {
        type: [String],
        maxlength: 255,
        require: true
    },
    attributes: Array,
    rating: {
        type: Number,
        min: 0,
        max: 5,
        require: true,
        default: 0
    },
    reviewCount: {
        type: Number,
        min: 0,
        require: true,
        default: 0
    },
    tags: {
        type: [String],
        maxlength: 255,
        require: true
    },
    isActive: {
        type: Boolean,
        require: true,
        default: true
    },
    bestSale: {
        type: Boolean,
        require: true,
        default: false
    },
    flashSale: {
        type: Boolean,
        require: true,
        default: false
    },
    promotion: {
        type: [String],
        maxlength: 255,
        require: false
    },
    contentBlock: [
        {
          type: {
            type: String,
            enum: ['text', 'image'],
            required: true
          },
          content: {
            type: String // dùng cho 'text'
          },
          src: {
            type: String // dùng cho 'image'
          },
          alt: {
            type: String // dùng cho 'image', optional
          }
        }
      ],
    //tham chiếu
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        require: true
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'brands',
        require: true
    },
    vendor: {
        type: Schema.Types.ObjectId,
        ref: 'vendors',
        require: true
    }
},
{
    timestamps: true,
    versionKey: false
})

export default model('products', productSchema)