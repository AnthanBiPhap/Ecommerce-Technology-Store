import locationsService from "../services/locations.service";
import {Request, Response, NextFunction} from 'express';
import {httpStatus, sendJsonSuccess} from '../helpers/response.helper';


//Get All
const getAll = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const locations = await locationsService.getAll(req.query);
    sendJsonSuccess(res, locations, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// get by id
const getById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
    const location = await locationsService.getById(id);
    sendJsonSuccess(res, location, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
//create
const create = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const location = await locationsService.create(payload);
        sendJsonSuccess(res, location, httpStatus.CREATED.statusCode, httpStatus.CREATED.message)
    } catch (error) {
        next(error);
    }
}
// update by id
const updateById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const payload = req.body;
        const location = await locationsService.updateById(id, payload);
        sendJsonSuccess(res, location, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// delete by id
const deleteById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const location = locationsService.deleteById(id);
        sendJsonSuccess(res, location, httpStatus.OK.statusCode, httpStatus.OK.message);
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