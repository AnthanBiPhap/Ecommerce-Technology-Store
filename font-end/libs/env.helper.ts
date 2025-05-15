import dotenv from 'dotenv';
dotenv.config();

/*
- Dùng file này để quản lý các biến môi trường
- Tập trung 1 chỗ
*/

export const env = {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    NODE_ENV: process.env.NODE_ENV || "development",
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET
}