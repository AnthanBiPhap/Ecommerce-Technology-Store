import brandsController from "../../controllers/brands.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import brandsValidation from "../../validations/brands.validation";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

//getAll
router.get('/brands'/* , authenticateToken */, validateSchemaYup(brandsValidation.getAllSchema), brandsController.getAll);
//get by id
router.get('/brands/:id'/* , authenticateToken */, validateSchemaYup(brandsValidation.getByIdSchema), brandsController.getById);
// create
router.post('/brands', authenticateToken, validateSchemaYup(brandsValidation.createSchema), brandsController.create);
// update by id
router.put('/brands/:id', authenticateToken, validateSchemaYup(brandsValidation.updateByIdSchema), brandsController.updateById);
//delete by id
router.delete('/brands/:id', authenticateToken, validateSchemaYup(brandsValidation.deleteByIdSchema), brandsController.deleteById);

export default router;