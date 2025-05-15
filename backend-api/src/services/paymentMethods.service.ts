import PaymentMethod from '../models/paymentMethod.model';
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

    const paymentMethods = await PaymentMethod
    .find(where)
    .populate('user')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection paymentMethods
    const count = await PaymentMethod.countDocuments(where);

    return {
        paymentMethods,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const paymentMethod = await PaymentMethod.findById(id);
    if(!paymentMethod) {
        createError(404, 'paymentMethod not found, please try again with other id');
    }
    return paymentMethod;
}


// Create
const create = async(payload: any) => {
    const paymentMethod = new PaymentMethod({
        type: payload.type,
        provider: payload.provider,
        accountNumber: payload.accountNumber,
        expiryDate: payload.expiryDate,
        cardholderName: payload.cardholderName,
        billingAddress: payload.billingAddress,
        isDefault: payload.isDefault ? payload.isDefault : false,
        metadata: payload.metadata,
        user: payload.user,
    });
    // lưu dữ liệu
    await paymentMethod.save();
    return paymentMethod; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const paymentMethod = await getById(id);
    if(!paymentMethod) {
        throw createError(404, "paymentMethod not found");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(paymentMethod, payload);
    //lưu dữ liệu xuống database
    await paymentMethod.save();
    // trả kết quả
    return paymentMethod;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const paymentMethod = await getById(id);
    if(!paymentMethod) {
        throw createError(404, "paymentMethod not found");
    }
    //xóa paymentMethod
    await paymentMethod.deleteOne({_id: paymentMethod.id});
    return paymentMethod;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}



