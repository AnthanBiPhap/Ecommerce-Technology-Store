import * as yup from 'yup';


//get all
const getAllSchema = yup
  .object({
    query: yup.object({
        page: yup.number().integer().positive().optional(),
        limit: yup.number().integer().positive().optional(),
        }),
        sort_type: yup.string().oneOf(['asc', 'desc']).optional(),
        sort_by: yup.string().oneOf(['createdAt', 'category_name']).optional(),
        keyword: yup.string().min(2).max(50).optional(), // search category_name
    })
  .required();

  //get by id
  const getByIdSchema = yup
  .object({
    params: yup.object({
      id: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'ID is non-ObjectID'}).required(),
    }),
  })
  .required();// khi truyền vào object phải tồn tại

  //create
const createSchema = yup
  .object({
    body: yup.object({
        type: yup.string().oneOf(["credit_card", "paypal", "bank_account"]).max(20).required(), 
        provider: yup.string().max(50).required(),
        accountNumber: yup.string().max(50).optional(),
        expiryDate: yup.date().optional(),
        cardholderName: yup.string().max(100).optional(),
        billingAddress: yup.object().optional(),
        isDefault: yup.boolean().required(),
        metadata: yup.object().optional(),
        user: yup.string().required(),
    }),
  })
  .required();




//update by id
const updateByIdSchema = yup
  .object({
    params: yup.object({
        id: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'ID is non-ObjectID'}).required(),
    }),
    body: yup.object({
        type: yup.string().oneOf(["credit_card", "paypal", "bank_account"]).max(20).optional(), 
        provider: yup.string().max(50).optional(),
        accountNumber: yup.string().max(50).optional(),
        expiryDate: yup.date().optional(),
        cardholderName: yup.string().max(100).optional(),
        billingAddress: yup.object().optional(),
        isDefault: yup.boolean().optional(),
        metadata: yup.object().optional(),
        user: yup.string().optional(),
    })
  })
  .required();

  //delete by id
const deleteByIdSchema = yup
.object({
  params: yup.object({
      id: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'ID is non-ObjectID'}).required(),
  }),
  body: yup.object({
    type: yup.string().oneOf(["credit_card", "paypal", "bank_account"]).max(20).optional(), 
        provider: yup.string().max(50).optional(),
        accountNumber: yup.string().max(50).optional(),
        expiryDate: yup.date().optional(),
        cardholderName: yup.string().max(100).optional(),
        billingAddress: yup.object().optional(),
        isDefault: yup.boolean().optional(),
        metadata: yup.object().optional(),
        user: yup.string().optional(),
  })
})
.required();


export default {
    getAllSchema,
    getByIdSchema,
    createSchema,
    updateByIdSchema,
    deleteByIdSchema
};