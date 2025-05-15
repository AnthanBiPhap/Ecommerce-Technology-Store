import User from '../models/users.model';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import {env} from '../helpers/env.helper';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

// login
const login = async({
    email,
    password,
}:{
    email: string,
    password: string
}) => {
    //Kiểm tra nhân viên có tồn tại không ?
    const user = await User.findOne({email});
    if(!user) {
        throw createError(400, "email or password invalid");       
    }
    //so sánh password 
    const isValid = await bcrypt.compare(password, user.password as string) // bcrypt.compare sẽ tự mã hóa dữ liệu đầu tiên và đi so sánh với dữ liệu thứ 2
    if(!isValid) {
        throw createError(400, "password invalid");
    }
    // Login thành công
    //Tạo accessToken
    const accessToken = jwt.sign(
        { _id: user._id, email: user.email},
        env.JWT_SECRET as string,
        {
            expiresIn: '24h', //expires in 24 hours (24x60x60)
        }
    );

    const refreshToken = jwt.sign(
        {_id: user._id, email: user.email},
        env.JWT_SECRET as string,
        {
            expiresIn: '365d', // expires in 24 hours (24x60x60)
        }
    );
    return {
        accessToken,
        refreshToken
    }
}

// getProfile
const getProfile = async(res: Response) => {
    const {user} = res.locals;
    return user;
}

export default {
    login,
    getProfile
}