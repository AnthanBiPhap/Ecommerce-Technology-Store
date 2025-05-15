import wishlistsController from "../../controllers/wishlists.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import wishlistsValidation from "../../validations/wishlists.validation";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

//getAll
router.get('/wishlists'/* , authenticateToken */, validateSchemaYup(wishlistsValidation.getAllSchema), wishlistsController.getAll);
//get by id
router.get('/wishlists/:id', authenticateToken, validateSchemaYup(wishlistsValidation.getByIdSchema), wishlistsController.getById);
// create
router.post('/wishlists', authenticateToken, validateSchemaYup(wishlistsValidation.createSchema), wishlistsController.create);
// update by id
router.put('/wishlists/:id', authenticateToken, validateSchemaYup(wishlistsValidation.updateByIdSchema), wishlistsController.updateById);
//delete by id
router.delete('/wishlists/:id', authenticateToken, validateSchemaYup(wishlistsValidation.deleteByIdSchema), wishlistsController.deleteById);

export default router;