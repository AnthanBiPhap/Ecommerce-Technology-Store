import { Schema, model } from "mongoose";
import { ITechNew } from "../types/type";


const techNewSchema = new Schema<ITechNew>({
    title: {
        type: String,
        maxLength: 150,
        minLength: 2,
        require: true,
        unique: true
    },
    keyword: {
        type: String,
        maxLength: 50,
        minLength: 2,
        require: true
    },
    thumbnail: {
        type: String,
        maxLength: 255,
        require: false
    },
    description: {
        type: String,
        maxLength: 255,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true,
        default: Date.now
    }
},
{
    timestamps: true,
    versionKey: false
});

export default model('techNews', techNewSchema);