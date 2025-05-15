import categoriesService from "../services/categories.service";
import {Request, Response, NextFunction} from 'express';
import {httpStatus, sendJsonSuccess} from '../helpers/response.helper';
import mongoose from "mongoose";


//Get AllCategories
const getAllCategories = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoriesService.getAllCategories(req.query);
    sendJsonSuccess(res, categories, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
//Get RootCategories
const getRootCategories = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoriesService.getRootCategories(req.query);
    sendJsonSuccess(res, categories, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
//Get ChidrenCategories
const getChildrenCategories = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {parentId} = req.params;
        const categories = await categoriesService.getChildrenCategories(parentId, req.query);
    sendJsonSuccess(res, categories, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// get by id
const getById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
    const category = await categoriesService.getById(id);
    sendJsonSuccess(res, category, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}
//create
const create = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const payload = req.body;
        const category = await categoriesService.create(payload);
        sendJsonSuccess(res, category, httpStatus.CREATED.statusCode, httpStatus.CREATED.message)
    } catch (error) {
        next(error);
    }
}
// update by id
const updateById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const payload = req.body;
        const category = await categoriesService.updateById(id, payload);
        sendJsonSuccess(res, category, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}
// delete by id
const deleteById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const category = categoriesService.deleteById(id);
        sendJsonSuccess(res, category, httpStatus.OK.statusCode, httpStatus.OK.message);
    } catch (error) {
        next(error);
    }
}

export default {
    getAllCategories,
    getRootCategories,
    getChildrenCategories,
    getById,
    create,
    updateById,
    deleteById
}