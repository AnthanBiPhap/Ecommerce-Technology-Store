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
        sku: yup.string().max(50).required(), 
        variantName: yup.string().max(100).required(),
        attributes: yup.object().required(),
        price: yup.number().min(0).required(),
        salePrice: yup.number().min(0).optional(),
        stock: yup.number().min(0).integer().required(),
        images: yup.array().of(yup.string()).optional(),
        isActive: yup.boolean().required(),
        product: yup.string().required()
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
        sku: yup.string().max(50).optional(), 
        variantName: yup.string().max(100).optional(),
        attributes: yup.object().optional(),
        price: yup.number().min(0).optional(),
        salePrice: yup.number().min(0).optional(),
        stock: yup.number().min(0).integer().optional(),
        images: yup.array().of(yup.string()).optional(),
        isActive: yup.boolean().optional(),
        product: yup.string().optional()
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
    sku: yup.string().max(50).optional(), 
        variantName: yup.string().max(100).optional(),
        attributes: yup.object().optional(),
        price: yup.number().min(0).optional(),
        salePrice: yup.number().min(0).optional(),
        stock: yup.number().min(0).integer().optional(),
        images: yup.array().of(yup.string()).optional(),
        isActive: yup.boolean().optional(),
        product: yup.string().optional()
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