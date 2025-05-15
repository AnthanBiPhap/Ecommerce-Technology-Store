import productVariantsService from "../services/productVariants.service";
import {Request, Response, NextFunction} from 'express';
import {httpStatus, sendJsonSuccess} from '../helpers/response.helper';


//Get All
const getAll = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const productVariants = await productVariantsService.getAll(req.query);
    sendJsonSuccess(res, productVariants, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// get by id
const getById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
    const productVariant = await productVariantsService.getById(id);
    sendJsonSuccess(res, productVariant, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
//create
const create = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const productVariant = await productVariantsService.create(payload);
        sendJsonSuccess(res, productVariant, httpStatus.CREATED.statusCode, httpStatus.CREATED.message)
    } catch (error) {
        next(error);
    }
}
// update by id
const updateById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const payload = req.body;
        const productVariant = await productVariantsService.updateById(id, payload);
        sendJsonSuccess(res, productVariant, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// delete by id
const deleteById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const productVariant = productVariantsService.deleteById(id);
        sendJsonSuccess(res, productVariant, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}

export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}