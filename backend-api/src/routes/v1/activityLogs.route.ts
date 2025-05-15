import activityLogsController from "../../controllers/activityLogs.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import activityLogsValidation from "../../validations/activityLogs.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//getAll
router.get('/activitylogs'/* , authenticateToken */, validateSchemaYup(activityLogsValidation.getAllSchema), activityLogsController.getAll);
//get by id
router.get('/activitylogs/:id'/* , authenticateToken */, validateSchemaYup(activityLogsValidation.getByIdSchema), activityLogsController.getById);
// create
router.post('/activitylogs', authenticateToken, validateSchemaYup(activityLogsValidation.createSchema), activityLogsController.create);
// update by id
router.put('/activitylogs/:id', authenticateToken, validateSchemaYup(activityLogsValidation.updateByIdSchema), activityLogsController.updateById);
//delete by id
router.delete('/activitylogs/:id', authenticateToken, validateSchemaYup(activityLogsValidation.deleteByIdSchema), activityLogsController.deleteById);

export default router;