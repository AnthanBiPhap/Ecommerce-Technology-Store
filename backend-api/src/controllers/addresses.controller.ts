import addressesService from "../services/addresses.service";
import {Request, Response, NextFunction} from 'express';
import {httpStatus, sendJsonSuccess} from '../helpers/response.helper';


//Get All
const getAll = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const addresses = await addressesService.getAll(req.query);
    sendJsonSuccess(res, addresses, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// get by id
const getById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
    const address = await addressesService.getById(id);
    sendJsonSuccess(res, address, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
// get by userId
const getByUserId = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {userId} = req.params;
    const address = await addressesService.getByUserId(userId);
    sendJsonSuccess(res, address, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
//create
const create = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const address = await addressesService.create(payload);
        sendJsonSuccess(res, address, httpStatus.CREATED.statusCode, httpStatus.CREATED.message)
    } catch (error) {
        next(error);
    }
}
// update by id
const updateById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const payload = req.body;
        const address = await addressesService.updateById(id, payload);
        sendJsonSuccess(res, address, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// delete by id
const deleteById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const address = addressesService.deleteById(id);
        sendJsonSuccess(res, address, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
//update isDefault = true
const updateAddressDefault = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const address = await addressesService.updateAddressDefault(id);
        sendJsonSuccess(res, address, httpStatus.OK.statusCode, httpStatus.OK.message);
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
    deleteById,
    updateAddressDefault
}