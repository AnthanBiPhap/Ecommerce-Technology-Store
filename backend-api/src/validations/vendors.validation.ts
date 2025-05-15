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
        companyName: yup.string().max(100).required(), // required: bắt buộc
        description: yup.string().max(1000).optional(),  // required: không bắt buộc
        logoUrl: yup.string().max(255).optional(), // required: bắt buộc
        coverImageUrl: yup.string().max(255).optional(),
        address: yup.object().required(),
        contactPhone: yup.string().max(20).required(),
        contactEmail: yup.string().max(100).required(),
        website: yup.string().max(255).required(),
        rating: yup.number().min(0).max(5).positive().integer().required(),
        status: yup.string().min(0).max(20).optional(),
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
        companyName: yup.string().max(100).optional(), // required: bắt buộc
        description: yup.string().max(1000).optional(),  // required: không bắt buộc
        logoUrl: yup.string().max(255).optional(), // required: bắt buộc
        coverImageUrl: yup.string().max(255).optional(),
        address: yup.object().optional(),
        contactPhone: yup.string().max(20).optional(),
        contactEmail: yup.string().max(100).optional(),
        website: yup.string().max(255).optional(),
        rating: yup.number().min(0).max(5).positive().integer().optional(),
        status: yup.string().min(0).max(20).optional(),
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
    companyName: yup.string().max(100).optional(), // required: bắt buộc
        description: yup.string().max(1000).optional(),  // required: không bắt buộc
        logoUrl: yup.string().max(255).optional(), // required: bắt buộc
        coverImageUrl: yup.string().max(255).optional(),
        address: yup.object().optional(),
        contactPhone: yup.string().max(20).optional(),
        contactEmail: yup.string().max(100).optional(),
        website: yup.string().max(255).optional(),
        rating: yup.number().min(0).max(5).positive().integer().optional(),
        status: yup.string().min(0).max(20).optional(),
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