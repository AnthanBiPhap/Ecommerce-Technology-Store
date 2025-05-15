import express, { NextFunction, Request, Response } from 'express';
import { uploadImage ,uploadImages } from '../../helpers/multer.helper';
import multer from 'multer';
import createError from 'http-errors';
import {httpStatus, sendJsonSuccess} from '../../helpers/response.helper';

const router = express.Router();
//upload 1 ảnh (từ fontend)
router.post("/uploads/single/:collectionName", (req: Request, res: Response, next: NextFunction) => {
    console.log('Request received:', req.params);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request file:', req.file);
    uploadImage(req, res, function (error) {
        if (error) {
            console.error("Upload Error:", error);
            return next(createError(500, error.message, { type: "UploadError" }));
        }

        const { collectionName } = req.params;
        const file = req.file;

        if (!file) {
            return next(createError(400, "No file uploaded"));
        }

        const avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${collectionName}/${file.filename}`;
        sendJsonSuccess(res, { url: avatarUrl }, httpStatus.OK.statusCode, httpStatus.OK.message);
    });
});

//upload nhiều ảnh (từ fontend)
router.post("/uploads/:collectionName", (req: Request, res: Response, next: NextFunction) => {
    console.log('Request received:', req.params);
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request file:', req.file);
    uploadImages(req, res, function (error) {
        if (error) {
            console.error("Upload Error:", error);
            return next(createError(500, error.message, { type: "UploadError" }));
        }

        const { collectionName } = req.params;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return next(createError(400, "No file uploaded"));
        }

        const urls = files.map((file) => {
            return `${req.protocol}://${req.get("host")}/uploads/${collectionName}/${file.filename}`;
        });
        sendJsonSuccess(res, { urls }, httpStatus.OK.statusCode, httpStatus.OK.message);
    });
});


/* router.post('/uploads/:collectionName', (req: Request, res: Response, next: NextFunction) => {
    uploadImages(req, res, function (error) {
        //Bắt lỗi
        if (error) {
            console.error("Upload Error:", error);  // Thêm dòng log này để kiểm tra
            next(createError(500, error.message, { type: error instanceof multer.MulterError ? 'MulterError' : 'UnknownError' }));
        } else {
            const { collectionName } = req.params;
            sendJsonSuccess(res, collectionName, httpStatus.OK.statusCode, httpStatus.OK.message);
        }
    });
}); */

export default router;
