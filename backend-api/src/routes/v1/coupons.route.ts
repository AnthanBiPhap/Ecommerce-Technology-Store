import couponsController from "../../controllers/coupons.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import couponsValidation from "../../validations/coupons.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//getAll
router.get('/coupons'/* , authenticateToken */, validateSchemaYup(couponsValidation.getAllSchema), couponsController.getAll);
//get by id
router.get('/coupons/:id'/* , authenticateToken */, validateSchemaYup(couponsValidation.getByIdSchema), couponsController.getById);
// create
router.post('/coupons', authenticateToken, validateSchemaYup(couponsValidation.createSchema), couponsController.create);
// update by id
router.put('/coupons/:id', authenticateToken, validateSchemaYup(couponsValidation.updateByIdSchema), couponsController.updateById);
//delete by id
router.delete('/coupons/:id', authenticateToken, validateSchemaYup(couponsValidation.deleteByIdSchema), couponsController.deleteById);

export default router;