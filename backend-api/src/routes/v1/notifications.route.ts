import notificationsController from "../../controllers/notifications.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import notificationsValidation from "../../validations/notifications.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//getAll
router.get('/notifications'/* , authenticateToken */, validateSchemaYup(notificationsValidation.getAllSchema), notificationsController.getAll);
//get by id
router.get('/notifications/:id', authenticateToken, validateSchemaYup(notificationsValidation.getByIdSchema), notificationsController.getById);
// create
router.post('/notifications', authenticateToken, validateSchemaYup(notificationsValidation.createSchema), notificationsController.create);
// update by id
router.put('/notifications/:id', authenticateToken, validateSchemaYup(notificationsValidation.updateByIdSchema), notificationsController.updateById);
//delete by id
router.delete('/notifications/:id', authenticateToken, validateSchemaYup(notificationsValidation.deleteByIdSchema), notificationsController.deleteById);

export default router;