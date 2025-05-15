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
        amount: yup.number().min(0).required(), // required: bắt buộc
        method: yup.string().oneOf(["credit_card", "paypal", "cod"]).max(50).required(),  // required: không bắt buộc
        status: yup.string().oneOf(["pending", "completed", "failed", "refunded"]).max(20).required(), // required: bắt buộc
        transactionId: yup.string().max(100).optional(),
        gateway: yup.string().max(50).optional(),
        metadata: yup.object().optional(),
        order: yup.string().required(),
        user: yup.string().required()
    }),
  })
  .required();// khi truyền vào object phải tồn tại




//update by id
const updateByIdSchema = yup
  .object({
    params: yup.object({
        id: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'ID is non-ObjectID'}).required(),
    }),
    body: yup.object({
        amount: yup.number().min(0).optional(),
        method: yup.string().oneOf(["credit_card", "paypal", "cod"]).max(50).optional(),  // required: không bắt buộc
        status: yup.string().oneOf(["pending", "completed", "failed", "refunded"]).max(20).optional(), // required: bắt buộc
        transactionId: yup.string().max(100).optional(),
        gateway: yup.string().max(50).optional(),
        metadata: yup.object().optional(),
        order: yup.string().optional(),
        user: yup.string().optional()
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
    amount: yup.number().min(0).optional(),
    method: yup.string().oneOf(["credit_card", "paypal", "cod"]).max(50).optional(),  // required: không bắt buộc
    status: yup.string().oneOf(["pending", "completed", "failed", "refunded"]).max(20).optional(), // required: bắt buộc
    transactionId: yup.string().max(100).optional(),
    gateway: yup.string().max(50).optional(),
    metadata: yup.object().optional(),
    order: yup.string().optional(),
    user: yup.string().optional()
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