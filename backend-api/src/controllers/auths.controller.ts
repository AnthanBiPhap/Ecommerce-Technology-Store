import {Request, Response, NextFunction} from 'express';
import authsService from '../services/auths.service';
import { httpStatus, sendJsonSuccess } from '../helpers/response.helper';


//login
const login = async(req :Request, res: Response,next: NextFunction) => {
    try {
        const tokens = await authsService.login(req.body);
        sendJsonSuccess(res, tokens, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error);
    }
}

//get Profile
const getProfile = async(req :Request, res: Response,next: NextFunction) => {
    try {
        const user = await authsService.getProfile(res);
        sendJsonSuccess(res, user, httpStatus.OK.statusCode, httpStatus.OK.message)
    } catch (error) {
        next(error); 
    }
}

export default {
    login,
    getProfile
}