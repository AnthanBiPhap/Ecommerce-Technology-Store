import techNewsController from "../../controllers/techNews.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import techNewsValidation from "../../validations/techNews.validation";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

//getAll
router.get('/technews'/* , authenticateToken */, validateSchemaYup(techNewsValidation.getAllSchema), techNewsController.getAll);
//get by id
router.get('/technews/:id'/* , authenticateToken */, validateSchemaYup(techNewsValidation.getByIdSchema), techNewsController.getById);
// create
router.post('/technews', authenticateToken, validateSchemaYup(techNewsValidation.createSchema), techNewsController.create);
// update by id
router.put('/technews/:id', authenticateToken, validateSchemaYup(techNewsValidation.updateByIdSchema), techNewsController.updateById);
//delete by id
router.delete('/technews/:id', authenticateToken, validateSchemaYup(techNewsValidation.deleteByIdSchema), techNewsController.deleteById);

export default router;