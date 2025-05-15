import addressesController from "../../controllers/addresses.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import addressesValidation from "../../validations/addresses.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//getAll
router.get('/addresses'/* , authenticateToken */, validateSchemaYup(addressesValidation.getAllSchema), addressesController.getAll);
//get by id
router.get('/addresses/:id', authenticateToken, validateSchemaYup(addressesValidation.getByIdSchema), addressesController.getById);
//get by userId
router.get('/addresses/user/:userId', authenticateToken, validateSchemaYup(addressesValidation.getByUserIdSchema), addressesController.getByUserId);
// create
router.post('/addresses', authenticateToken, validateSchemaYup(addressesValidation.createSchema), addressesController.create);
// update by id
router.put('/addresses/:id', authenticateToken, validateSchemaYup(addressesValidation.updateByIdSchema), addressesController.updateById);
//delete by id
router.delete('/addresses/:id', authenticateToken, validateSchemaYup(addressesValidation.deleteByIdSchema), addressesController.deleteById);
//update isDefault
router.put('/addresses/isDefault/:id', authenticateToken, validateSchemaYup(addressesValidation.updateAddressDefault), addressesController.updateAddressDefault);

export default router;