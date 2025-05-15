import authsController from "../../controllers/auths.controller";
import express from "express";
import validateSchemaYup from "../../middlewares/validate.middleware";
import authsValidation from "../../validations/auths.validation";
import { authenticateToken } from "../../middlewares/auth.middleware";

const router = express.Router();

//login
router.post('/login', validateSchemaYup(authsValidation.loginSchema), authsController.login);
//get profile
router.get('/my-profile', authenticateToken, authsController.getProfile);

export default router;