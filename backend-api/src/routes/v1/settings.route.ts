import settingsController from "../../controllers/settings.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import settingsValidation from "../../validations/settings.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//getAll
router.get('/settings'/* , authenticateToken */, validateSchemaYup(settingsValidation.getAllSchema), settingsController.getAll);
//get by id
router.get('/settings/:id', authenticateToken, validateSchemaYup(settingsValidation.getByIdSchema), settingsController.getById);
// create
router.post('/settings', authenticateToken, validateSchemaYup(settingsValidation.createSchema), settingsController.create);
// update by id
router.put('/settings/:id', authenticateToken, validateSchemaYup(settingsValidation.updateByIdSchema), settingsController.updateById);
//delete by id
router.delete('/settings/:id', authenticateToken, validateSchemaYup(settingsValidation.deleteByIdSchema), settingsController.deleteById);

export default router;