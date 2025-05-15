import vendorsService from "../services/vendors.service";
import {Request, Response, NextFunction} from 'express';
import {httpStatus, sendJsonSuccess} from '../helpers/response.helper';


//Get All
const getAll = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const vendors = await vendorsService.getAll(req.query);
    sendJsonSuccess(res, vendors, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// get by id
const getById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
    const vendor = await vendorsService.getById(id);
    sendJsonSuccess(res, vendor, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
//create
const create = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const vendor = await vendorsService.create(payload);
        sendJsonSuccess(res, vendor, httpStatus.CREATED.statusCode, httpStatus.CREATED.message)
    } catch (error) {
        next(error);
    }
}
// update by id
const updateById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const payload = req.body;
        const vendor = await vendorsService.updateById(id, payload);
        sendJsonSuccess(res, vendor, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// delete by id
const deleteById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const vendor = vendorsService.deleteById(id);
        sendJsonSuccess(res, vendor, httpStatus.OK.statusCode, httpStatus.OK.message);
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