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

  //get by userId
  const getByUserIdSchema = yup
  .object({
    params: yup.object({
      userId: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'ID is non-ObjectID'}).required(),
    }),
  })
  .required();// khi truyền vào object phải tồn tại

  //create
const createSchema = yup
  .object({
    body: yup.object({
        orderNumber: yup.string().max(50).required(), // required: bắt buộc
        products: yup.array().of(yup.object()).required(),  // required: không bắt buộc
        totalAmount: yup.number().min(0).required(), // required: bắt buộc
        shippingFee: yup.number().min(0).default(0),
        tax: yup.number().min(0).default(0).optional(),
        discount: yup.number().min(0).default(0),
        paymentMethod: yup.string().oneOf(["credit_card", "paypal", "cod"]).required(),
        paymentStatus: yup.string().oneOf(["pending", "paid", "failed"]).default("pending"),
        shippingAddress: yup.object().required(),
        shippingInfor: yup.object().required(),
        status: yup.string().oneOf(["pending", "processing", "shipped", "delivered", "cancelled"]).default("pending"),
        notes: yup.string().max(500).optional(),
        orderDate: yup.date().optional(),
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
        orderNumber: yup.string().max(50).optional(), // required: bắt buộc
        products: yup.array().of(yup.object()).optional(),  // required: không bắt buộc
        totalAmount: yup.number().min(0).optional(), // required: bắt buộc
        shippingFee: yup.number().min(0).optional(),
        tax: yup.number().min(0).optional(),
        discount: yup.number().min(0).optional(),
        paymentMethod: yup.string().oneOf(["credit_card", "paypal", "cod"]).optional(),
        paymentStatus: yup.string().oneOf(["pending", "paid", "failed"]).optional(),
        shippingAddress: yup.object().optional(),
        shippingInfor: yup.object().optional(),
        status: yup.string().oneOf(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
        notes: yup.string().max(500).optional(),
        orderDate: yup.date().optional(),
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
    orderNumber: yup.string().max(50).optional(), // required: bắt buộc
        products: yup.array().of(yup.object()).optional(),  // required: không bắt buộc
        totalAmount: yup.number().min(0).optional(), // required: bắt buộc
        shippingFee: yup.number().min(0).optional(),
        tax: yup.number().min(0).optional(),
        discount: yup.number().min(0).optional(),
        paymentMethod: yup.string().oneOf(["credit_card", "paypal", "cod"]).optional(),
        paymentStatus: yup.string().oneOf(["pending", "paid", "failed"]).optional(),
        shippingAddress: yup.object().optional(),
        shippingInfor: yup.object().optional(),
        status: yup.string().oneOf(["pending", "processing", "shipped", "delivered", "cancelled"]).optional(),
        notes: yup.string().max(500).optional(),
        orderDate: yup.date().optional(),
        user: yup.string().optional()
  })
})
.required();


export default {
    getAllSchema,
    getByIdSchema,
    getByUserIdSchema,
    createSchema,
    updateByIdSchema,
    deleteByIdSchema
};