import ordersService from "../services/orders.service";
import {Request, Response, NextFunction} from 'express';
import {httpStatus, sendJsonSuccess} from '../helpers/response.helper';


//Get All
const getAll = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await ordersService.getAll(req.query);
    sendJsonSuccess(res, orders, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// get by id
const getById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
    const order = await ordersService.getById(id);
    sendJsonSuccess(res, order, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
// get by userId
const getByUserId = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId} = req.params;
    const order = await ordersService.getByUserId(userId);
    sendJsonSuccess(res, order, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
//create
const create = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const order = await ordersService.create(payload);
        sendJsonSuccess(res, order, httpStatus.CREATED.statusCode, httpStatus.CREATED.message)
    } catch (error) {
        next(error);
    }
}
// update by id
const updateById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const payload = req.body;
        const order = await ordersService.updateById(id, payload);
        sendJsonSuccess(res, order, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// delete by id
const deleteById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const order = ordersService.deleteById(id);
        sendJsonSuccess(res, order, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}

export default {
    getAll,
    getById,
    getByUserId,
    create,
    updateById,
    deleteById
}