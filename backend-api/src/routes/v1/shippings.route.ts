import shippingsController from "../../controllers/shippings.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import shippingsValidation from "../../validations/shippings.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//getAll
router.get('/shippings'/* , authenticateToken */, validateSchemaYup(shippingsValidation.getAllSchema), shippingsController.getAll);
//get by id
router.get('/shippings/:id', authenticateToken, validateSchemaYup(shippingsValidation.getByIdSchema), shippingsController.getById);
// create
router.post('/shippings', authenticateToken, validateSchemaYup(shippingsValidation.createSchema), shippingsController.create);
// update by id
router.put('/shippings/:id', authenticateToken, validateSchemaYup(shippingsValidation.updateByIdSchema), shippingsController.updateById);
//delete by id
router.delete('/shippings/:id', authenticateToken, validateSchemaYup(shippingsValidation.deleteByIdSchema), shippingsController.deleteById);

export default router;