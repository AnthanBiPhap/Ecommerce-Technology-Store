import multer, { StorageEngine } from 'multer';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';
interface CustomRequest extends Request {
    fileValidationError?: string;
}

const UPLOAD_DIRECTORY = './public/uploads';

// 1. Tạo cấu hình lưu trữ file trên ổ đĩa
const storageSetting: StorageEngine = multer.diskStorage({
    // Tạo đường dẫn lưu file
    destination: (req: Request, file, callback) => {
        const { collectionName } = req.params; // Lấy tên thư mục từ params
        const PATH = `${UPLOAD_DIRECTORY}/${collectionName}`;

        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(PATH)) {
            fs.mkdirSync(PATH, { recursive: true });
        }
        callback(null, PATH);
    },

    // Định dạng lại tên file
    filename: (req: Request, file, callback) => {
        const fileInfo = path.parse(file.originalname);
        // Chuyển tên file thành dạng an toàn
        const safeFileName = fileInfo.name.replace(/[^a-zA-Z0-9À-ỹ]/gi, '_').toLowerCase() + fileInfo.ext;
        callback(null, safeFileName);
    },
});

// 2. Tạo hàm lọc
/** Bộ lọc hình ảnh */
const imageFilter = (req: CustomRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const mimetypeAllow = ["image/png", "image/jpg", "image/gif", "image/jpeg", "image/webp"];
    if (!mimetypeAllow.includes(file.mimetype)) {
        req.fileValidationError = 'Only .png, .gif, .jpg, webp, and .jpeg formats allowed!';
        return cb(null, false);
    }
    cb(null, true);
};

/** Bộ lọc file chung */
const fileFilter = (req: CustomRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!file.originalname.match(/\.(jpg|zip|jpeg|doc|docx|png|xls|xlsx|gif|pdf|rar|webp|txt)$/)) {
        req.fileValidationError = 'Only files with extensions: jpg, zip, jpeg, doc, docx, png, xls, xlsx, gif, pdf, rar, webp, txt are allowed!';
        return cb(null, false);
    }
    cb(null, true);
};

// 3. Cấu hình upload
//Với 1 ảnh
export const uploadImage = multer({
    storage: storageSetting,
    limits: { fileSize: 2000000  }, //2MB in bytes
    fileFilter: imageFilter,
}).single('file');
//Với nhiều ảnh
export const uploadImages = multer({
    storage: storageSetting,
    limits: { fileSize: 104857600 }, //100MB
    fileFilter: imageFilter,
}).array('files', 50);//max 50 files per request

