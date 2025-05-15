import cartsController from "../../controllers/carts.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import cartsValidation from "../../validations/carts.validation";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

//getAll
router.get('/carts', authenticateToken , validateSchemaYup(cartsValidation.getAllSchema), cartsController.getAll);
//get by id
router.get('/carts/:id' , authenticateToken , validateSchemaYup(cartsValidation.getByIdSchema), cartsController.getById);
//get by userId
router.get('/carts/user/:userId', authenticateToken, validateSchemaYup(cartsValidation.getByUserIdSchema), cartsController.getByUserId);
// create
router.post('/carts', authenticateToken, validateSchemaYup(cartsValidation.createSchema), cartsController.create);
//create AddToCart
router.post('/carts/user/:userId', authenticateToken, validateSchemaYup(cartsValidation.createAddToCartSchema), cartsController.createAddToCart);
// update by id
router.put('/carts/:id', authenticateToken, validateSchemaYup(cartsValidation.updateByIdSchema), cartsController.updateById);
// update by userId
router.put('/carts/user/:userId', authenticateToken, validateSchemaYup(cartsValidation.updateByUserIdSchema), cartsController.updateByUserId);
//delete by id
router.delete('/carts/:id', authenticateToken, validateSchemaYup(cartsValidation.deleteByIdSchema), cartsController.deleteById);
//delete by userId
router.delete('/carts/user/:userId', authenticateToken, validateSchemaYup(cartsValidation.deleteByUserIdSchema), cartsController.deleteByUserId);
//delete by itemId
router.delete('/carts/user/:userId/item/:itemId', authenticateToken, validateSchemaYup(cartsValidation.deleteByItemIdSchema), cartsController.deleteByItemId);

export default router;