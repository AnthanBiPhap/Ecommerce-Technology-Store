import Coupon from '../models/coupon.model';
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
    // nếu có tìm kiếm theo tên code
    if(query.code && query.code.length > 0) {
        where = {...where, code: {$regex: query.code, $options: 'i'}};
    }

    const coupons = await Coupon
    .find(where)
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection coupons
    const count = await Coupon.countDocuments(where);

    return {
        coupons,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const coupon = await Coupon.findById(id);
    if(!coupon) {
        createError(404, 'coupon not found, please try again with other id');
    }
    return coupon;
}


// Create
const create = async(payload: any) => {
    // kiểm tra xem mã của coupons có tồn tại không
    const couponExist = await Coupon.findOne({code: payload.code});
    if(couponExist) {
        throw createError(404, "coupon already exists");
    }
    const coupon = new Coupon({
        code: payload.code,
        type: payload.type,
        value: payload.value,
        minPurchase: payload.minPurchase ? payload.minPurchase : 0,
        startDate: payload.startDate,
        endDate: payload.endDate,
        usageLimit: payload.usageLimit ? payload.usageLimit : 0,
        usageCount: payload.usageCount,
        isActive: payload.isActive ? payload.isActive : true,
    });
    // lưu dữ liệu
    await coupon.save();
    return coupon; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const coupon = await getById(id);
    if(!coupon) {
        throw createError(404, "coupon not found");
    }
    // kiểm tra xem code tồn tại không
    const couponExist = await Coupon.findOne({
        code: payload.code,
        _id: { $ne: id }
    });
    if(couponExist) {
        throw createError(404, "coupon already exists");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(coupon, payload);
    //lưu dữ liệu xuống database
    await coupon.save();
    // trả kết quả
    return coupon;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const coupon = await getById(id);
    if(!coupon) {
        throw createError(404, "coupon not found");
    }
    //xóa coupon
    await coupon.deleteOne({_id: coupon.id});
    return coupon;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}



