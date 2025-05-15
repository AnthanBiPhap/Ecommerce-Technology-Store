import ordersController from "../../controllers/orders.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import ordersValidation from "../../validations/orders.validation";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

//getAll
router.get('/orders'/* , authenticateToken */, validateSchemaYup(ordersValidation.getAllSchema), ordersController.getAll);
//get by id
router.get('/orders/:id', authenticateToken, validateSchemaYup(ordersValidation.getByIdSchema), ordersController.getById);
//get by userId
router.get('/orders/user/:userId', authenticateToken, validateSchemaYup(ordersValidation.getByUserIdSchema), ordersController.getByUserId);
// create
router.post('/orders', authenticateToken, validateSchemaYup(ordersValidation.createSchema), ordersController.create);
// update by id
router.put('/orders/:id', authenticateToken, validateSchemaYup(ordersValidation.updateByIdSchema), ordersController.updateById);
//delete by id
router.delete('/orders/:id', authenticateToken, validateSchemaYup(ordersValidation.deleteByIdSchema), ordersController.deleteById);

export default router;