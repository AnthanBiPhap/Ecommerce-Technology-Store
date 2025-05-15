import Shipping from '../models/shipping.model';
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
    // nếu có tìm kiếm theo carrier
    if(query.carrier && query.carrier.length > 0) {
        where = {...where, carrier: {$regex: query.carrier, $options: 'i'}};
    }

    const shippings = await Shipping
    .find(where)
    .populate('order')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection shippings
    const count = await Shipping.countDocuments(where);

    return {
        shippings,
        pagination: {
            totalRecord: count,
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const shipping = await Shipping.findById(id);
    if(!shipping) {
        createError(404, 'shipping not found, please try again with other id');
    }
    return shipping;
}


// Create
const create = async(payload: any) => {
    const shipping = new Shipping({
        carrier: payload.carrier,
        trackingNumber: payload.trackingNumber,
        status: payload.status ? payload.status : "processing",
        estimatedDelivery: payload.estimatedDelivery,
        actualDelivery: payload.actualDelivery,
        shippingMethod: payload.shippingMethod,
        shippingFee: payload.shippingFee ? payload.shippingFee : 0,
        order: payload.order,
    });
    // lưu dữ liệu
    await shipping.save();
    return shipping; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const shipping = await getById(id);
    if(!shipping) {
        throw createError(404, "shipping not found");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(shipping, payload);
    //lưu dữ liệu xuống database
    await shipping.save();
    // trả kết quả
    return shipping;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const shipping = await getById(id);
    if(!shipping) {
        throw createError(404, "shipping not found");
    }
    //xóa shipping
    await shipping.deleteOne({_id: shipping.id});
    return shipping;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}



