import locationsController from "../../controllers/locations.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import locationsValidation from "../../validations/locations.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//getAll
router.get('/locations'/* , authenticateToken */, validateSchemaYup(locationsValidation.getAllSchema), locationsController.getAll);
//get by id
router.get('/locations/:id', authenticateToken, validateSchemaYup(locationsValidation.getByIdSchema), locationsController.getById);
// create
router.post('/locations', authenticateToken, validateSchemaYup(locationsValidation.createSchema), locationsController.create);
// update by id
router.put('/locations/:id', authenticateToken, validateSchemaYup(locationsValidation.updateByIdSchema), locationsController.updateById);
//delete by id
router.delete('/locations/:id', authenticateToken, validateSchemaYup(locationsValidation.deleteByIdSchema), locationsController.deleteById);

export default router;