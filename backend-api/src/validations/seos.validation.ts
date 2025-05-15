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
        entityType: yup.string().oneOf(["products", "Category", "vendors", "pages"]).max(50).required(), 
        entityId: yup.string().required(),
        metaTitle: yup.string().max(100).optional(),
        metaDescription: yup.string().max(200).optional(),
        metaKeywords: yup.string().max(200).optional(),
        ogTitle: yup.string().max(100).optional(),
        ogDescription: yup.string().max(200).optional(),
        ogImage: yup.string().max(255).optional(),
        canonicalUrl: yup.string().max(255).optional()
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
        entityType: yup.string().oneOf(["product", "category", "vendor", "page"]).max(50).optional(), 
        entityId: yup.string().optional(),
        metaTitle: yup.string().max(100).optional(),
        metaDescription: yup.string().max(200).optional(),
        metaKeywords: yup.string().max(200).optional(),
        ogTitle: yup.string().max(100).optional(),
        ogDescription: yup.string().max(200).optional(),
        ogImage: yup.string().max(255).optional(),
        canonicalUrl: yup.string().max(255).optional()
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
    entityType: yup.string().oneOf(["product", "category", "vendor", "page"]).max(50).optional(), 
        entityId: yup.string().optional(),
        metaTitle: yup.string().max(100).optional(),
        metaDescription: yup.string().max(200).optional(),
        metaKeywords: yup.string().max(200).optional(),
        ogTitle: yup.string().max(100).optional(),
        ogDescription: yup.string().max(200).optional(),
        ogImage: yup.string().max(255).optional(),
        canonicalUrl: yup.string().max(255).optional()
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