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
        type: yup.string().oneOf(["shipping", "billing"]).max(50).required(),
        fullName: yup.string().max(100).required(),
        phoneNumber: yup.string().max(20).required(),
        street: yup.string().max(255).required(),
        ward: yup.string().max(255).required(),
        district: yup.string().max(255).required(),
        city: yup.string().max(100).required(),
        country: yup.string().max(20).required(),
        isDefault: yup.boolean().required(),
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
        type: yup.string().oneOf(["shipping", "billing"]).max(50).optional(),
        fullName: yup.string().max(100).optional(),
        phoneNumber: yup.string().max(20).optional(),
        street: yup.string().max(255).optional(),
        ward: yup.string().max(255).optional(),
        district: yup.string().max(255).optional(),
        city: yup.string().max(100).optional(),
        country: yup.string().max(20).optional(),
        isDefault: yup.boolean().optional(),
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
    type: yup.string().oneOf(["shipping", "billing"]).max(50).optional(),
        fullName: yup.string().max(100).optional(),
        phoneNumber: yup.string().max(20).optional(),
        street: yup.string().max(255).optional(),
        ward: yup.string().max(255).optional(),
        district: yup.string().max(255).optional(),
        city: yup.string().max(100).optional(),
        country: yup.string().max(20).optional(),
        isDefault: yup.boolean().optional(),
        user: yup.string().optional()
  })
})
.required();

//update isDefault = true
const updateAddressDefault = yup
.object({
  params: yup.object({
      id: yup.string().matches(/^[0-9a-fA-F]{24}$/, {message: 'ID is non-ObjectID'}).required(),
  }),
  body: yup.object({
    type: yup.string().oneOf(["shipping", "billing"]).max(50).optional(),
        fullName: yup.string().max(100).optional(),
        phoneNumber: yup.string().max(20).optional(),
        street: yup.string().max(255).optional(),
        ward: yup.string().max(255).optional(),
        district: yup.string().max(255).optional(),
        city: yup.string().max(100).optional(),
        country: yup.string().max(20).optional(),
        isDefault: yup.boolean().optional(),
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
    deleteByIdSchema,
    updateAddressDefault
};