import express from 'express';
import usersController from '../../controllers/users.controller';
import validateSchemaYup from '../../middlewares/validate.middleware';
import usersValidation from '../../validations/users.vadidation';
import {authenticateToken} from '../../middlewares/auth.middleware';

const router = express.Router();

/* 
 * Route là để định tuyến path <==> controller nào 
*/

//get all
router.get('/users'/* , authenticateToken */, validateSchemaYup(usersValidation.getAllSchema), usersController.getAll);

//Get user by id
router.get('/users/:id',authenticateToken, validateSchemaYup(usersValidation.getByIdSchema), usersController.getById);

//Create user
//POST /api/v1/users
router.post('/users'/* , authenticateToken */, validateSchemaYup(usersValidation.createSchema), usersController.Create);

//Update user
//PUT /api/v1/users/:id
router.put('/users/:id',authenticateToken, validateSchemaYup(usersValidation.updateByIdSchema), usersController.Update);

//Delete user
//DELETE /api/v1/users/:id
router.delete('/users/:id',authenticateToken, usersController.Delete);

export default router;