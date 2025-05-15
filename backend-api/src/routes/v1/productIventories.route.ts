import productIventoriesController from "../../controllers/productIventories.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import productIventoriesValidation from "../../validations/productInventories.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//getAll
router.get('/productiventories'/* , authenticateToken */, validateSchemaYup(productIventoriesValidation.getAllSchema), productIventoriesController.getAll);
//get by id
router.get('/productiventories/:id'/* , authenticateToken */, validateSchemaYup(productIventoriesValidation.getByIdSchema), productIventoriesController.getById);
// create
router.post('/productiventories', authenticateToken, validateSchemaYup(productIventoriesValidation.createSchema), productIventoriesController.create);
// update by id
router.put('/productiventories/:id', authenticateToken, validateSchemaYup(productIventoriesValidation.updateByIdSchema), productIventoriesController.updateById);
//delete by id
router.delete('/productiventories/:id', authenticateToken, validateSchemaYup(productIventoriesValidation.deleteByIdSchema), productIventoriesController.deleteById);

export default router;