import reviewsController from "../../controllers/reviews.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import reviewsValidation from "../../validations/reviews.validation";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

//getAll
router.get('/reviews'/* , authenticateToken */, validateSchemaYup(reviewsValidation.getAllSchema), reviewsController.getAll);
//get by id
router.get('/reviews/:id'/* , authenticateToken */, validateSchemaYup(reviewsValidation.getByIdSchema), reviewsController.getById);
// create
router.post('/reviews', authenticateToken, validateSchemaYup(reviewsValidation.createSchema), reviewsController.create);
// update by id
router.put('/reviews/:id', authenticateToken, validateSchemaYup(reviewsValidation.updateByIdSchema), reviewsController.updateById);
//delete by id
router.delete('/reviews/:id', authenticateToken, validateSchemaYup(reviewsValidation.deleteByIdSchema), reviewsController.deleteById);

export default router;