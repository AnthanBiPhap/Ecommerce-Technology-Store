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
        name: yup.string().max(50).required(), 
        displayName: yup.string().max(100).required(),
        description: yup.string().max(255).optional(),
        type: yup.string().oneOf(["text", "number", "boolean", "select"]).max(20).required(),
        options: yup.array().of(yup.string()).optional(),
        isFilterable: yup.boolean().required(),
        isVariant: yup.boolean().required(),
        isRequired: yup.boolean().required(),
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
        name: yup.string().max(50).optional(), 
        displayName: yup.string().max(100).optional(),
        description: yup.string().max(255).optional(),
        type: yup.string().oneOf(["text", "number", "boolean", "select"]).max(20).optional(),
        options: yup.array().of(yup.string()).optional(),
        isFilterable: yup.boolean().optional(),
        isVariant: yup.boolean().optional(),
        isRequired: yup.boolean().optional(),
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
    name: yup.string().max(50).optional(), 
        displayName: yup.string().max(100).optional(),
        description: yup.string().max(255).optional(),
        type: yup.string().oneOf(["text", "number", "boolean", "select"]).max(20).optional(),
        options: yup.array().of(yup.string()).optional(),
        isFilterable: yup.boolean().optional(),
        isVariant: yup.boolean().optional(),
        isRequired: yup.boolean().optional(),
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