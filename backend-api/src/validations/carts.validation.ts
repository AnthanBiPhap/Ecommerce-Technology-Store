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
        items: yup.array().of(yup.object()).required(),
        totalAmount: yup.number().min(0).optional(), 
        user: yup.string().required()
    }),
  })
  .required();// khi truyền vào object phải tồn tại

  //create AddToCart
const createAddToCartSchema = yup
.object({
  params: yup.object({
    userId: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'ID is non-ObjectID'}).required(),
  }),
  body: yup.object({
    product: yup.string().required(),
    quantity: yup.number().integer().positive().required(),
    currentPrice: yup.number().integer().positive().required(),
    currentSalePrice: yup.number().integer().positive().required(),
    totalAmount: yup.number().integer().positive().required(),
  })
})
.required();// khi truyền vào object phải tồn tại




//update by id
const updateByIdSchema = yup
  .object({
    params: yup.object({
        id: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'ID is non-ObjectID'}).required(),
    }),
    body: yup.object({
        items: yup.array().of(yup.object()).optional(),
        totalAmount: yup.string().max(100).optional(), 
        user: yup.string().optional()
    })
  })
  .required();

  //update by userId
const updateByUserIdSchema = yup
.object({
  params: yup.object({
      userId: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'ID is non-ObjectID'}).required(),
  }),
  body: yup.object({
      items: yup
      .array()
      .of(yup.object({
        product: yup.string().optional(),
        quantity: yup.number().integer().positive().optional(),
        currentPrice: yup.number().integer().positive().optional(),
        currentSalePrice: yup.number().integer().positive().optional(),
        totalAmount: yup.number().integer().positive().optional(),
      }))
      .optional(),
      totalAmount: yup.string().max(100).optional(), 
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
    items: yup.array().of(yup.object()).optional(),
    totalAmount: yup.number().min(0).optional(), 
    user: yup.string().optional()
  })
})
.required();

//delete by id
const deleteByUserIdSchema = yup
.object({
  params: yup.object({
      userId: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'userID is non-ObjectID'}).required(),
  }),
  body: yup.object({
    items: yup.array().of(yup.object()).optional(),
    totalAmount: yup.number().min(0).optional()
  })
})
.required();

 //delete by itemId
 const deleteByItemIdSchema = yup
 .object({
   params: yup.object({
       userId: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'ID is non-ObjectID'}).required(),
       itemId: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'ID is non-ObjectID'}).required(),
   }),
   body: yup.object({
    product: yup.string().optional(),
    quantity: yup.number().integer().positive().optional(),
    currentPrice: yup.number().integer().positive().optional(),
    currentSalePrice: yup.number().integer().positive().optional(),
    totalAmount: yup.number().integer().positive().optional(),
   })
 })
 .required();


export default {
    getAllSchema,
    getByIdSchema,
    getByUserIdSchema,
    createSchema,
    createAddToCartSchema,
    updateByIdSchema,
    updateByUserIdSchema,
    deleteByIdSchema,
    deleteByUserIdSchema,
    deleteByItemIdSchema
};