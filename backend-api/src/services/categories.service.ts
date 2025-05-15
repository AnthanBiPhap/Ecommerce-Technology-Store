import Category from '../models/category.model';
import { buildSlug } from '../helpers/slugify.helper';
import createError from 'http-errors';
import mongoose from 'mongoose';


//Get AllCategories level = 1
const getAllCategories = async(query: any) => {
    const {page = 1, limit = 20} = query;

    //tìm kiếm theo điều kiện
    let where: any = { level: 1 };
    // nếu có tìm kiếm theo tên danh mục
    if(query.category_name && query.category_name.length > 0) {
        where = {...where, category_name: {$regex: query.category_name, $options: 'i'}};
    }

    const categories = await Category
    .find(where)
    .skip((page-1)*limit)
    .limit(limit)
    .sort({ createAt: 1 });
    
    //Đếm tổng số record hiện có của collection categories
    const count = await Category.countDocuments(where);

    return {
        categories,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//Get RootCategories level = 0
const getRootCategories = async(query: any) => {
    const {page = 1, limit = 20} = query;
    let sortObject = {};
    const sortType = query.sort_type || 'desc';
    const sortBy = query.sort_by || 'createdAt';
    sortObject = {...sortObject, [sortBy]: sortType === 'desc' ? -1 : 1};
    
    console.log('sortObject : ', sortObject);

    //tìm kiếm theo điều kiện
    let where: any = { level: 0 };
    // nếu có tìm kiếm theo tên danh mục
    if(query.category_name && query.category_name.length > 0) {
        where = {...where, category_name: {$regex: query.category_name, $options: 'i'}};
    }

    const categories = await Category
    .find(where)
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection categories
    const count = await Category.countDocuments(where);

    return {
        categories,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get ChildrenCategories
const getChildrenCategories = async(parentId: string, query: any) => {
    
    const {page = 1, limit = 20} = query;
    console.log('parentId==>',parentId);
    //Tạo Objectid cho parentId
    const objectParentId = new mongoose.Types.ObjectId(parentId);

    let where: any = {};

    // Tạo điều kiện tìm kiếm cho parentId
    if (parentId) {
        if (!mongoose.Types.ObjectId.isValid(parentId)) {
          throw new Error("Invalid parentId");
        }
        where.parentId = new mongoose.Types.ObjectId(parentId);
      }

    const categories = await Category
    .find({parentId: objectParentId})
    .skip((page-1)*limit)
    .limit(limit)
    .sort({ createAt: 1 });
    
    //Đếm tổng số record hiện có của collection categories
    const count = await Category.countDocuments(where);

    return {
        categories,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}


//get by ID
const getById = async(id: string) => {
    const category = await Category.findById(id);
    if(!category) {
        createError(404, 'category not found, please try again with other id');
    }
    return category;
}


// Create
const create = async(payload: any) => {
    // kiểm tra xem tên của categories có tồn tại không
    const categoryExist = await Category.findOne({category_name: payload.category_name});
    if(categoryExist) {
        throw createError(404, "category already exists");
    }
    const category = new Category({
        category_name: payload.category_name,
        description: payload.description,
        slug: buildSlug(payload.category_name),
        parentId: payload.parentId ? payload.parentId : null,
        level: payload.level,
        imageUrl: payload.imageUrl,
        isActive: payload.isActive ? payload.isActive : true
    });
    // lưu dữ liệu
    await category.save();
    return category; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const category = await getById(id);
    if(!category) {
        throw createError(404, "category not found");
    }
    // kiểm tra xem category_name tồn tại không
    const categoryExist = await Category.findOne({
        category_name: payload.category_name,
        _id: { $ne: id } // loại trừ sản phẩm hiện tại
    });
    if(categoryExist) {
        throw createError(404, "category already exists");
    }
    // update slug
    if(payload.category_name){
        payload.slug = buildSlug(payload.category_name);// tự động tạo trường slug vào payload
    }
    // trộn dữ liệu mới và cũ
    Object.assign(category, payload);
    //lưu dữ liệu xuống database
    await category.save();
    // trả kết quả
    return category;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const category = await getById(id);
    if(!category) {
        throw createError(404, "category not found");
    }
    //xóa category
    await Category.deleteOne({_id: category.id});
    return category;
}


export default {
    getAllCategories,
    getRootCategories,
    getChildrenCategories,
    getById,
    create,
    updateById,
    deleteById
}



