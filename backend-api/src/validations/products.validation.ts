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

  //get all by type
const getAllByTypeSchema = yup
  .object({
    params: yup.object({
      slug: yup.string()
        .matches(/^[a-z0-9-]+$/, { message: 'Slug không hợp lệ, chỉ được dùng chữ thường, số và dấu gạch ngang' })
        .required(),
    }),
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

  //get by slug
  const getBySlugSchema = yup
  .object({
    params: yup.object({
      slug: yup.string().required('Slug is required').matches(/^[\w-]+$/, 'Slug must be a valid string with only letters, numbers, hyphens, and underscores').required('Slug is required'),
    }),
  })
  .required();

  //create
const createSchema = yup
  .object({
    body: yup.object({
        product_name: yup.string().min(2).max(150).required(),
        words: yup.string().min(0).max(255).optional(),
        description: yup.string().min(0).max(255).optional(),
        slug: yup.string().min(2).max(150).optional(),
        price: yup.number().positive().required(),
        salePrice: yup.number().positive().optional(), 
        stock: yup.number().max(100).positive().integer().optional(),
        images: yup.array().required(),
        attributes: yup.array().optional(),
        rating: yup.number().min(0).max(5).optional(),
        reviewCount: yup.number().min(0).optional(),
        tags: yup.array().required(),
        isActive: yup.boolean().optional(),
        bestSale: yup.boolean().optional(),
        flashSale: yup.boolean().optional(),
        promotion: yup.array().of(yup.string()).optional(),
        contentBlock: yup.array().of(yup.object()).optional(),
        category: yup.string().required(),
        brand: yup.string().required(),
        vendor: yup.string().required()
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
      product_name: yup.string().min(2).max(150).optional(), 
      words: yup.string().min(0).max(255).optional(),
      description: yup.string().min(0).max(255).optional(),
      slug: yup.string().min(2).max(150).optional(),
      price: yup.number().positive().optional(), 
      salePrice: yup.number().positive().optional(),
      stock: yup.number().max(100).positive().integer().optional(),
      images: yup.array().optional(),
      attributes: yup.array().optional(),
      rating: yup.number().min(0).max(5).optional(),
      reviewCount: yup.number().min(0).optional(),
      tags: yup.array().optional(),
      isActive: yup.boolean().optional(),
      bestSale: yup.boolean().optional(),
      flashSale: yup.boolean().optional(),
      category: yup.string().optional(),
      brand: yup.string().optional(),
      vendor: yup.string().optional()
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
    product_name: yup.string().min(2).max(150).optional(),
    words: yup.string().min(0).max(255).optional(),
      description: yup.string().min(0).max(255).optional(),
      slug: yup.string().min(2).max(150).optional(),
      price: yup.number().positive().optional(),
      salePrice: yup.number().positive().optional(),
      stock: yup.number().max(100).positive().integer().optional(),
      images: yup.array().optional(),
      attributes: yup.array().optional(),
      rating: yup.number().min(0).max(5).optional(),
      reviewCount: yup.number().min(0).optional(),
      tags: yup.array().optional(),
      isActive: yup.boolean().optional(),
      bestSale: yup.boolean().optional(),
      flashSale: yup.boolean().optional(),
      category: yup.string().optional(),
      brand: yup.string().optional(),
      vendor: yup.string().optional()
  })
})
.required();


export default {
    getAllSchema,
    getAllByTypeSchema,
    getByIdSchema,
    getBySlugSchema,
    createSchema,
    updateByIdSchema,
    deleteByIdSchema
};