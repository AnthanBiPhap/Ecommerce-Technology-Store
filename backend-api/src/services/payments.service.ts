import Payment from '../models/payment.model';
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
    // nếu có tìm kiếm theo tên transactionId
    if(query.transactionId && query.title.transactionId > 0) {
        where = {...where, transactionId: {$regex: query.transactionId, $options: 'i'}};
    }

    const payments = await Payment
    .find(where)
    .populate('order')
    .populate('user')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection payments
    const count = await Payment.countDocuments(where);

    return {
        payments,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const payment = await Payment.findById(id);
    if(!payment) {
        createError(404, 'payment not found, please try again with other id');
    }
    return payment;
}


// Create
const create = async(payload: any) => {
    const payment = new Payment({
        amount: payload.amount ? payload.amount : 0,
        method: payload.method,
        status: payload.status ? payload.status: "pending",
        transactionId: payload.transactionId,
        gateway: payload.gateway,
        metadata: payload.metadata,
        order: payload.order,
        user: payload.user
    });
    // lưu dữ liệu
    await payment.save();
    return payment; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const payment = await getById(id);
    if(!payment) {
        throw createError(404, "payment not found");
    }
    // kiểm tra xem transactionId tồn tại không
    const paymentExist = await Payment.findOne({
        transactionId: payload.transactionId,
        _id: { $ne: id }
    });
    if(paymentExist) {
        throw createError(404, "payment already exists");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(payment, payload);
    /*lưu ý dữ liệu sau khi trộn chỉ lưu vào bộ nhớ Ram chứ chưa lưu vào database
    --> cần lưu xuống database */
    await payment.save();
    // trả kết quả
    return payment;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const payment = await getById(id);
    if(!payment) {
        throw createError(404, "payment not found");
    }
    //xóa payment
    await payment.deleteOne({_id: payment.id});
    return payment;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}