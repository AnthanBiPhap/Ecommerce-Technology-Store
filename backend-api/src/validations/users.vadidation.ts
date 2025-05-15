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
        keyword: yup.string().min(3).max(50).optional(), // search category_name
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
      userName: yup.string().min(2).max(50).required(), // required: bắt buộc
      fullName: yup.string().min(2).max(100).required(),
      email: yup
      .string()
      .max(100)
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Email address is invalid"
      )
      .required(),
      password: yup.string().min(6).max(255).required(),
      roles: yup.string().min(2).max(50).optional(),
      status: yup.string().oneOf(["active", "inactive", "banned"]).optional(),
      avatarUrl: yup.string().optional(),
      lastLogin: yup.date().optional(),
      gender: yup.string().optional(),
      phone: yup.string().optional(),
      birthDay: yup.date().optional(),
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
      userName: yup.string().max(50).optional(),
      fullName: yup.string().max(100).optional(),
      email: yup.string().max(100).email().optional(),
      password: yup.string().min(6).max(255).optional(),
      roles: yup.string().max(50).optional(),
      status: yup.string().oneOf(["active", "inactive", "banned"]).optional(),
      avatarUrl: yup.string().max(255).optional(),
      lastLogin: yup.date().optional(),
      gender: yup.string().optional(),
      phone: yup.string().optional(),
      birthDay: yup.date().optional(),
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
    userName: yup.string().max(50).optional(),
      fullName: yup.string().max(100).optional(),
      email: yup.string().max(100).email().optional(),
      password: yup.string().min(6).max(255).optional(),
      roles: yup.string().max(50).optional(),
      status: yup.string().oneOf(["active", "inactive", "banned"]).optional(),
      avatarUrl: yup.string().max(255).optional(),
      lastLogin: yup.date().optional(),
      gender: yup.string().optional(),
      phone: yup.string().optional(),
      birthDay: yup.date().optional(),
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