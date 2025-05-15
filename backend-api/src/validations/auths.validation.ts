import * as yup from 'yup';


//login
const loginSchema = yup
  .object({
    body: yup.object({
        email: yup.string().email().required(),
        password: yup.string().min(6).max(255).optional(),
        }),
    })
  .required();


export default {
    loginSchema
};