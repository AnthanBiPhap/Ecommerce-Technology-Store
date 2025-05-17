import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import User from '../../models/users.model';
import { env } from '../../helpers/env.helper';
import { httpStatus, sendJsonSuccess } from '../../helpers/response.helper';
import createError from 'http-errors';
import bcrypt from 'bcrypt';

dotenv.config();
const router = express.Router();

function generatePassword(length: number = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let password ='';
    for (let i = 0;i < length; i++) {
        password += chars.charAt(Math.floor(Math.random()*chars.length));
    }
    return password;
}

router.post('/forgot-password', async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        //kiểm tra xem email có trong users không
        const user = await User.findOne({email});
        if(!user) {
            return next(createError(400, 'email not found, please try again with other email'))
        }
        //Tạo mật khẩu mới
        const newPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        //lưu mật khẩu vào database
        user.password = newPassword;
        await user.save();
        //gửi Email với nodemailer
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'nguyenhothedat88@gmail.com',
                pass: env.GMAIL_APP_PASSWORD
            },
        } as nodemailer.TransportOptions);
        //tạo nội dung email
        const mailOptions = {
            from: 'nguyenhothedat88@gmail.com',
            to: email,
            subject: 'Cấp lại mật khẩu',
            text: `Mật khẩu mới của bạn là : ${newPassword}`,
        };
        //gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        // Phản hồi về client
        sendJsonSuccess(res, info.response, httpStatus.OK.statusCode, httpStatus.OK.message);    
    } catch (error) {
        next(error);
    }
});

export default router;