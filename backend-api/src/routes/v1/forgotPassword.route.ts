import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import User from '../../models/users.model';
import { env } from '../../helpers/env.helper';
import { httpStatus, sendJsonSuccess } from '../../helpers/response.helper';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';

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
console.log('=== DEBUG FORGOT PASSWORD ===');
router.post('/forgot-password', async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        
        // Kiểm tra email
        console.log('Received email:', email);
        if (!email || !email.trim()) {
            return next(createError(400, 'Email is required'));
        }

        // Tìm user
        console.log('2. Finding user in database...');
        const user = await User.findOne({ email });
        if (!user) {
            console.log('2.1. User not found');
            return next(createError(400, 'Email not found'));
        }
        console.log('2.2. User found:', user.email);

        // Tạo mật khẩu mới
        const newPassword = generatePassword();
        console.log('New password generated:', newPassword);
        
        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log('Hashed password:', hashedPassword);
        
        // Lưu mật khẩu mới
        user.password = hashedPassword; // Lưu mật khẩu đã hash, không phải mật khẩu gốc
        await user.save();
        console.log('Password updated successfully');
        
        // Gửi email
        console.log('3. Sending email...');
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env.GMAIL_USER,
                pass: env.GMAIL_APP_PASSWORD
            }
        });

        // Kiểm tra thông tin email
        console.log('Gmail config:', {
            user: env.GMAIL_USER,
            hasPassword: !!env.GMAIL_APP_PASSWORD
        });

        const mailOptions = {
            from: env.GMAIL_USER, // Sử dụng biến môi trường
            to: email,
            subject: 'Cấp lại mật khẩu',
            text: `Mật khẩu mới của bạn là: ${newPassword}
            Vui lòng thay đổi mật khẩu sau khi đăng nhập.
            Lưu ý: Đây là email tự động, vui lòng không trả lời email này.`,
        };

        // Gửi email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        
        // Phản hồi client
        sendJsonSuccess(res, {
            message: 'Password reset email has been sent successfully'
        }, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        console.error('Error in forgot-password:', error);
        if (error instanceof Error) {
            next(createError(500, error.message));
        } else {
            next(createError(500, 'Internal server error'));
        }
    }
});

export default router;