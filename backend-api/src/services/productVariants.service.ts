import ProductVariant from '../models/productVariant.model';
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
    // nếu có tìm kiếm theo sku
    if(query.sku && query.sku.length > 0) {
        where = {...where, sku: {$regex: query.sku, $options: 'i'}};
    }

    const productVariants = await ProductVariant
    .find(where)
    .populate('product')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection productVariants
    const count = await ProductVariant.countDocuments(where);

    return {
        productVariants,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const productVariant = await ProductVariant.findById(id);
    if(!productVariant) {
        createError(404, 'productVariant not found, please try again with other id');
    }
    return productVariant;
}


// Create
const create = async(payload: any) => {
    // kiểm tra xem tên của sku có tồn tại không
    const productVariantExist = await ProductVariant.findOne({sku: payload.sku});
    if(productVariantExist) {
        throw createError(404, "productVariant already exists");
    }
    const productVariant = new ProductVariant({
        sku: payload.sku,
        variantName: payload.variantName,
        attributes: payload.attributes,
        price: payload.price,
        salePrice: payload.salePrice,
        stock: payload.stock ? payload.stock : 0,
        images: payload.images ? payload.images : [],
        isActive: payload.isActive ? payload.isActive : true,
        product: payload.product
    });
    // lưu dữ liệu
    await productVariant.save();
    return productVariant; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const productVariant = await getById(id);
    if(!productVariant) {
        throw createError(404, "productVariant not found");
    }
    // kiểm tra xem sku tồn tại không
    const productVariantExist = await ProductVariant.findOne({
        sku: payload.sku,
        _id: { $ne: id }
    });
    if(productVariantExist) {
        throw createError(404, "productVariant already exists");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(productVariant, payload);
    //lưu dữ liệu xuống database
    await productVariant.save();
    // trả kết quả
    return productVariant;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const productVariant = await getById(id);
    if(!productVariant) {
        throw createError(404, "productVariant not found");
    }
    //xóa productVariant
    await productVariant.deleteOne({_id: productVariant.id});
    return productVariant;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}



