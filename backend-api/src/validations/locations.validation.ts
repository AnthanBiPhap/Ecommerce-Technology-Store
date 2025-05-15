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
        name: yup.string().max(100).required(), 
        addressLine1: yup.string().max(255).required(),
        addressLine2: yup.string().max(255).optional(),
        city: yup.string().max(100).required(),
        state: yup.string().max(100).optional(),
        postalCode: yup.string().max(20).required(),
        country: yup.string().max(100).required(),
        isActive: yup.boolean().optional()
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
        name: yup.string().max(100).optional(), 
        addressLine1: yup.string().max(255).optional(),
        addressLine2: yup.string().max(255).optional(),
        city: yup.string().max(100).optional(),
        state: yup.string().max(100).optional(),
        postalCode: yup.string().max(20).optional(),
        country: yup.string().max(100).optional(),
        isActive: yup.boolean().optional()
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
    name: yup.string().max(100).optional(), 
        addressLine1: yup.string().max(255).optional(),
        addressLine2: yup.string().max(255).optional(),
        city: yup.string().max(100).optional(),
        state: yup.string().max(100).optional(),
        postalCode: yup.string().max(20).optional(),
        country: yup.string().max(100).optional(),
        isActive: yup.boolean().optional()
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