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
        type: yup.string().oneOf(["order", "payment", "account", "promotion"]).max(50).required(), 
        title: yup.string().max(100).required(),
        message: yup.string().max(500).required(),
        metadata: yup.object().optional(),
        isRead: yup.boolean().required(),
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
      type: yup.string().max(50).optional(), 
        title: yup.string().max(100).optional(),
        message: yup.string().max(500).optional(),
        metadata: yup.object().optional(),
        isRead: yup.boolean().optional(),
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
    type: yup.string().max(50).optional(), 
        title: yup.string().max(100).optional(),
        message: yup.string().max(500).optional(),
        metadata: yup.object().optional(),
        isRead: yup.boolean().optional(),
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