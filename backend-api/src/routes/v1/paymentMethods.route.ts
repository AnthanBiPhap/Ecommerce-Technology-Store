import paymentMethodsController from "../../controllers/paymentMethods.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import paymentMethodsValidation from "../../validations/paymentMethods.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//getAll
router.get('/paymentmethods'/* , authenticateToken */, validateSchemaYup(paymentMethodsValidation.getAllSchema), paymentMethodsController.getAll);
//get by id
router.get('/paymentmethods/:id', authenticateToken, validateSchemaYup(paymentMethodsValidation.getByIdSchema), paymentMethodsController.getById);
// create
router.post('/paymentmethods', authenticateToken, validateSchemaYup(paymentMethodsValidation.createSchema), paymentMethodsController.create);
// update by id
router.put('/paymentmethods/:id', authenticateToken, validateSchemaYup(paymentMethodsValidation.updateByIdSchema), paymentMethodsController.updateById);
//delete by id
router.delete('/paymentmethods/:id', authenticateToken, validateSchemaYup(paymentMethodsValidation.deleteByIdSchema), paymentMethodsController.deleteById);

export default router;