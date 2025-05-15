import ProductAttribute from '../models/productAttribute.model';
import createError from 'http-errors';



//Get all
const getAll = async(query: any) => {
    const {page = 1, limit = 10} = query;
    let sortObject = {};
    const sortType = query.sort_type || 'desc';
    const sortBy = query.sort_by || 'createdAt';
    sortObject = {...sortObject, [sortBy]: sortType === 'desc' ? -1 : 1};
    
    console.log('sortObject : ', sortObject);

    //tìm kiếm theo điều kiện
    let where = {};
    // nếu có tìm kiếm theo tên
    if(query.name && query.name.length > 0) {
        where = {...where, name: {$regex: query.name, $options: 'i'}};
    }

    const productAttributes = await ProductAttribute
    .find(where)
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection productAttributes
    const count = await ProductAttribute.countDocuments(where);

    return {
        productAttributes,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const productAttribute = await ProductAttribute.findById(id);
    if(!productAttribute) {
        createError(404, 'productAttribute not found, please try again with other id');
    }
    return productAttribute;
}


// Create
const create = async(payload: any) => {
    // kiểm tra xem tên của productAttributes có tồn tại không
    const productAttributeExist = await ProductAttribute.findOne({name: payload.name});
    if(productAttributeExist) {
        throw createError(404, "productAttribute already exists");
    }
    const productAttribute = new ProductAttribute({
        name: payload.name,
        displayName: payload.displayName,
        description: payload.description,
        type: payload.type,
        options: payload.options,
        isFilterable: payload.isFilterable ? payload.isFilterable : false,
        isVariant: payload.isVariant ? payload.isVariant : false,
        isRequired: payload.isRequired ? payload.isRequired : false,
    });
    // lưu dữ liệu
    await productAttribute.save();
    return productAttribute; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const productAttribute = await getById(id);
    if(!productAttribute) {
        throw createError(404, "productAttribute not found");
    }
    // kiểm tra xem name tồn tại không
    const productAttributeExist = await ProductAttribute.findOne({
        name: payload.name,
        _id: { $ne: id }
    });
    if(productAttributeExist) {
        throw createError(404, "productAttribute already exists");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(productAttribute, payload);
    //lưu dữ liệu xuống database
    await productAttribute.save();
    // trả kết quả
    return productAttribute;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const productAttribute = await getById(id);
    if(!productAttribute) {
        throw createError(404, "productAttribute not found");
    }
    //xóa productAttribute
    await productAttribute.deleteOne({_id: productAttribute.id});
    return productAttribute;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}



