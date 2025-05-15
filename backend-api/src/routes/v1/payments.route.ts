import paymentsController from "../../controllers/payments.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import paymentsValidation from "../../validations/payments.validation";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

//getAll
router.get('/payments'/* , authenticateToken */, validateSchemaYup(paymentsValidation.getAllSchema), paymentsController.getAll);
//get by id
router.get('/payments/:id', authenticateToken, validateSchemaYup(paymentsValidation.getByIdSchema), paymentsController.getById);
// create
router.post('/payments', authenticateToken, validateSchemaYup(paymentsValidation.createSchema), paymentsController.create);
// update by id
router.put('/payments/:id', authenticateToken, validateSchemaYup(paymentsValidation.updateByIdSchema), paymentsController.updateById);
//delete by id
router.delete('/payments/:id', authenticateToken, validateSchemaYup(paymentsValidation.deleteByIdSchema), paymentsController.deleteById);

export default router;