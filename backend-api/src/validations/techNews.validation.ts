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
        title: yup.string().min(2).max(150).required(),
        keyword: yup.string().min(2).max(50).required(),
        thumbnail: yup.string().max(255).optional(),
        description: yup.string().max(255).required(),
        content: yup.string().max(10000).required(),
        date: yup.date().required(),
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
        title: yup.string().min(2).max(150).optional(),
        keyword: yup.string().min(2).max(50).optional(),
        thumbnail: yup.string().max(255).optional(),
        description: yup.string().max(255).optional(),
        content: yup.string().max(10000).optional(),
        date: yup.date().optional(),
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
    title: yup.string().min(2).max(150).optional(),
    keyword: yup.string().min(2).max(50).optional(),
    thumbnail: yup.string().max(255).optional(),
    description: yup.string().max(255).optional(),
    content: yup.string().max(10000).optional(),
    date: yup.date().optional(),
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