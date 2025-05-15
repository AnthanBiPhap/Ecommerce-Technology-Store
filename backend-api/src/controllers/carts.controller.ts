import cartsService from "../services/carts.service";
import {Request, Response, NextFunction} from 'express';
import {httpStatus, sendJsonSuccess} from '../helpers/response.helper';


//Get All
const getAll = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const carts = await cartsService.getAll(req.query);
    sendJsonSuccess(res, carts, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// get by id
const getById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
    const cart = await cartsService.getById(id);
    sendJsonSuccess(res, cart, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
// get by userId
const getByUserId = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId} = req.params;
    const cart = await cartsService.getByUserId(userId);
    sendJsonSuccess(res, cart, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
//create
const create = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const cart = await cartsService.create(payload);
        sendJsonSuccess(res, cart, httpStatus.CREATED.statusCode, httpStatus.CREATED.message)
    } catch (error) {
        next(error);
    }
}
// add new productVariant to cartItems (click add to carts)
const createAddToCart = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId} = req.params;
        const payload = req.body;
        const cart = await cartsService.createAddToCart(userId ,payload);
        sendJsonSuccess(res, cart, httpStatus.CREATED.statusCode, httpStatus.CREATED.message)
    } catch (error) {
        next(error);
    }
}
// update by id
const updateById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const payload = req.body;
        const cart = await cartsService.updateById(id, payload);
        sendJsonSuccess(res, cart, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// update by userId
const updateByUserId = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId} = req.params;
        const payload = req.body;
        const cart = await cartsService.updateByUserId(userId, payload);
        sendJsonSuccess(res, cart, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// delete by id
const deleteById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const cart = await cartsService.deleteById(id);
        sendJsonSuccess(res, cart, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}

// delete by userId
const deleteByUserId = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId} = req.params;
        const cart = await cartsService.deleteByUserId(userId);
        sendJsonSuccess(res, cart, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}

// delete by itemId
const deleteByItemId = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId, itemId} = req.params;
        const cart = await cartsService.deleteByItemId(userId, itemId);
        sendJsonSuccess(res, cart, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}

export default {
    getAll,
    getById,
    getByUserId,
    create,
    createAddToCart,
    updateById,
    updateByUserId,
    deleteById,
    deleteByUserId,
    deleteByItemId
}