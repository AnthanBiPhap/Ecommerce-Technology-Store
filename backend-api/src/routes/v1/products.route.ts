import productsController from "../../controllers/products.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import productsValidation from "../../validations/products.validation";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

//getAll
router.get('/products'/* , authenticateToken */, validateSchemaYup(productsValidation.getAllSchema), productsController.getAll);
//getAllByType
router.get('/collections/:slug'/* , authenticateToken */, validateSchemaYup(productsValidation.getAllByTypeSchema), productsController.getAllByType);
//get by id
//router.get('/products/:id'/* , authenticateToken */, validateSchemaYup(productsValidation.getByIdSchema), productsController.getById);
//get by slug
router.get('/products/:slug'/* , authenticateToken */, validateSchemaYup(productsValidation.getBySlugSchema), productsController.getBySlug);
// create
router.post('/products', authenticateToken, validateSchemaYup(productsValidation.createSchema), productsController.create);
// update by id
router.put('/products/:id', authenticateToken, validateSchemaYup(productsValidation.updateByIdSchema), productsController.updateById);
//delete by id
router.delete('/products/:id', authenticateToken, validateSchemaYup(productsValidation.deleteByIdSchema), productsController.deleteById);

export default router;