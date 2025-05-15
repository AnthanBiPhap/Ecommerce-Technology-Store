import productsService from "../services/products.service";
import {Request, Response, NextFunction} from 'express';
import {httpStatus, sendJsonSuccess} from '../helpers/response.helper';


//Get All
const getAll = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productsService.getAll(req.query);
    sendJsonSuccess(res, products, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}

//Get All by Type
const getAllByType = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productsService.getAllByType(req.params, req.query);
    sendJsonSuccess(res, products, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}

// get by id
const getById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
    const product = await productsService.getById(id);
    sendJsonSuccess(res, product, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
// get by slug
const getBySlug = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {slug} = req.params;
    const product = await productsService.getBySlug(slug);
    sendJsonSuccess(res, product, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
//create
const create = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const product = await productsService.create(payload);
        sendJsonSuccess(res, product, httpStatus.CREATED.statusCode, httpStatus.CREATED.message)
    } catch (error) {
        next(error);
    }
}
// update by id
const updateById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const payload = req.body;
        const product = await productsService.updateById(id, payload);
        sendJsonSuccess(res, product, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// delete by id
const deleteById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const product = productsService.deleteById(id);
        sendJsonSuccess(res, product, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}

export default {
    getAll,
    getAllByType,
    getBySlug,
    create,
    updateById,
    deleteById
}