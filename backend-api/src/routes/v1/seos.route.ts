import seosController from "../../controllers/seos.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import seosValidation from "../../validations/seos.validation";
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

//getAll
router.get('/SEOs'/* , authenticateToken */, validateSchemaYup(seosValidation.getAllSchema), seosController.getAll);
//get by id
router.get('/SEOs/:id', authenticateToken, validateSchemaYup(seosValidation.getByIdSchema), seosController.getById);
// create
router.post('/SEOs', authenticateToken, validateSchemaYup(seosValidation.createSchema), seosController.create);
// update by id
router.put('/SEOs/:id', authenticateToken, validateSchemaYup(seosValidation.updateByIdSchema), seosController.updateById);
//delete by id
router.delete('/SEOs/:id', authenticateToken, validateSchemaYup(seosValidation.deleteByIdSchema), seosController.deleteById);

export default router;