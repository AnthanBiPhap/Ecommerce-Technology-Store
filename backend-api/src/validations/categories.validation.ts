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

    // get children categories
  const getChildrenSchema = yup
  .object({
    params: yup.object({
      parentId: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'parentId is non-ObjectID'}).required(),
    }),
    query: yup.object({
      page: yup.number().integer().positive().optional(),
      limit: yup.number().integer().positive().optional(),
      keyword: yup.string().min(2).max(50).optional(),
    })
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
      category_name: yup.string().min(2).max(50).required(), 
      description: yup.string().max(255).required(),
      slug: yup.string().min(2).max(50).optional(),
      level: yup.number().integer().optional(),
      imageUrl: yup.string().max(255).required(),
      isActive: yup.boolean().optional(),
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
      category_name: yup.string().min(2).max(50).optional(), 
      description: yup.string().max(255).optional(),
      slug: yup.string().min(2).max(50).optional(),
      level: yup.number().integer().optional(),
      imageUrl: yup.string().max(255).optional(),
      isActive: yup.boolean().optional(),
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
    category_name: yup.string().min(2).max(50).optional(), 
    description: yup.string().max(255).optional(),
    slug: yup.string().min(2).max(50).optional(),
    level: yup.number().integer().optional(),
    imageUrl: yup.string().max(255).optional(),
    isActive: yup.boolean().optional(),
  })
})
.required();


export default {
    getAllSchema,
    getChildrenSchema,
    getByIdSchema,
    createSchema,
    updateByIdSchema,
    deleteByIdSchema
};