import categoriesController from "../../controllers/categories.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import categoriesValidation from "../../validations/categories.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//get AllCategories
router.get('/categories'/* , authenticateToken */, validateSchemaYup(categoriesValidation.getAllSchema), categoriesController.getAllCategories);
//get RootCategories
router.get('/categories/root'/* , authenticateToken */, validateSchemaYup(categoriesValidation.getAllSchema), categoriesController.getRootCategories);
//get ChildrenCategories
router.get('/categories/children/:parentId'/* , authenticateToken */, validateSchemaYup(categoriesValidation.getChildrenSchema), categoriesController.getChildrenCategories);
//get by id
router.get('/categories/:id'/* , authenticateToken */, validateSchemaYup(categoriesValidation.getByIdSchema), categoriesController.getById);
// create
router.post('/categories', authenticateToken, validateSchemaYup(categoriesValidation.createSchema), categoriesController.create);
// update by id
router.put('/categories/:id', authenticateToken, validateSchemaYup(categoriesValidation.updateByIdSchema), categoriesController.updateById);
//delete by id
router.delete('/categories/:id', authenticateToken, validateSchemaYup(categoriesValidation.deleteByIdSchema), categoriesController.deleteById);

export default router;