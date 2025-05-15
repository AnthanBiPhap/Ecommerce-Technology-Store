import ProductIventory from '../models/productInventory.model';
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

    const productIventories = await ProductIventory
    .find(where)
    .populate('product')
    .populate('variant')
    .populate('location')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection productIventories
    const count = await ProductIventory.countDocuments(where);

    return {
        productIventories,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const productIventory = await ProductIventory.findById(id);
    if(!productIventory) {
        createError(404, 'productIventory not found, please try again with other id');
    }
    return productIventory;
}


// Create
const create = async(payload: any) => {
    const productIventory = new ProductIventory({
        quantity: payload.quantity ? payload.quantity : 0,
        reservedQuantity: payload.reservedQuantity ? payload.reservedQuantity : 0,
        lowStockThreshold: payload.lowStockThreshold,
        lastRestocked: payload.lastRestocked,
        product: payload.product,
        variant: payload.variant,
        location: payload.location
    });
    // lưu dữ liệu
    await productIventory.save();
    return productIventory; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const productIventory = await getById(id);
    if(!productIventory) {
        throw createError(404, "productIventory not found");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(productIventory, payload);
    //lưu dữ liệu xuống database
    await productIventory.save();
    // trả kết quả
    return productIventory;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const productIventory = await getById(id);
    if(!productIventory) {
        throw createError(404, "productIventory not found");
    }
    //xóa productIventory
    await productIventory.deleteOne({_id: productIventory.id});
    return productIventory;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}



