import vendorsController from "../../controllers/vendors.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import vendorsValidation from "../../validations/vendors.validation";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

//getAll
router.get('/vendors'/* , authenticateToken */, validateSchemaYup(vendorsValidation.getAllSchema), vendorsController.getAll);
//get by id
router.get('/vendors/:id'/* , authenticateToken */, validateSchemaYup(vendorsValidation.getByIdSchema), vendorsController.getById);
// create
router.post('/vendors', authenticateToken, validateSchemaYup(vendorsValidation.createSchema), vendorsController.create);
// update by id
router.put('/vendors/:id', authenticateToken, validateSchemaYup(vendorsValidation.updateByIdSchema), vendorsController.updateById);
//delete by id
router.delete('/vendors/:id', authenticateToken, validateSchemaYup(vendorsValidation.deleteByIdSchema), vendorsController.deleteById);

export default router;