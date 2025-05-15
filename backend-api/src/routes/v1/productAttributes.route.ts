import productAttributesController from "../../controllers/productAttributes.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import productAttributesValidation from "../../validations/productAttributes.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//getAll
router.get('/productattributes'/* , authenticateToken */, validateSchemaYup(productAttributesValidation.getAllSchema), productAttributesController.getAll);
//get by id
router.get('/productattributes/:id'/* , authenticateToken */, validateSchemaYup(productAttributesValidation.getByIdSchema), productAttributesController.getById);
// create
router.post('/productattributes', authenticateToken, validateSchemaYup(productAttributesValidation.createSchema), productAttributesController.create);
// update by id
router.put('/productattributes/:id', authenticateToken, validateSchemaYup(productAttributesValidation.updateByIdSchema), productAttributesController.updateById);
//delete by id
router.delete('/productattributes/:id', authenticateToken, validateSchemaYup(productAttributesValidation.deleteByIdSchema), productAttributesController.deleteById);

export default router;