import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt';
import { Iuser } from '../types/type';

const saltRounds = 10;

const UserSchema = new Schema<Iuser>({
    userName: {
        type: String,
        maxlength: 50,
        required: true,
    },
    fullName: {
        type: String,
        maxlength: 100,
        required: true,
    },
    email: {
        type: String,
        maxlength: 100,
        required: true,
        unique: true,//duy nhất
        validate: {
            validator: function (v: string) {
                return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
            },
            message: (props: {value: string}) => `${props.value} is not a valid email`
        }
    },
    password: {
        type: String,
        maxlength: 255,
        required: true
    },
    roles: {
        type: String,
        maxlength: 50,
        required: true,
        default: "customer"
    },
    status: {
        type: String,
        enum: ["active", "inactive","banned"],
        required: true,
        default: "active"
    },
    avatarUrl: {
        type: String,
        maxlength: 255,
        required: false
    },
    lastLogin: {
        type: Date,
        require: false
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: false,
      },
      phone: {
        type: String,
        maxlength: 20,
        required: false,
        unique: true
      },
      birthDay: {
        type: Date,
        required: false,
      },
},
{
    timestamps: true,
});

//Middleware pre save ở lớp database
//trước khi data được lưu xuống ---> mã khóa mật khẩu

UserSchema.pre('save', async function (next) {
    const user = this;

    if (!user.password) {
        return next(new Error("Password is required"));
    }

    const hash = bcrypt.hashSync(user.password, saltRounds);

    user.password = hash;

    next();
})

export default model('users', UserSchema)