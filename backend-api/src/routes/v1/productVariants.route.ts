import productVariantsController from "../../controllers/productVariants.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import productVariantsValidation from "../../validations/productVariants.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//getAll
router.get('/productvariants'/* , authenticateToken */, validateSchemaYup(productVariantsValidation.getAllSchema), productVariantsController.getAll);
//get by id
router.get('/productvariants/:id'/* , authenticateToken */, validateSchemaYup(productVariantsValidation.getByIdSchema), productVariantsController.getById);
// create
router.post('/productvariants', authenticateToken, validateSchemaYup(productVariantsValidation.createSchema), productVariantsController.create);
// update by id
router.put('/productvariants/:id', authenticateToken, validateSchemaYup(productVariantsValidation.updateByIdSchema), productVariantsController.updateById);
//delete by id
router.delete('/productvariants/:id', authenticateToken, validateSchemaYup(productVariantsValidation.deleteByIdSchema), productVariantsController.deleteById);

export default router;