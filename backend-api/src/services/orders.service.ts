import Order from '../models/order.model';
import createError from 'http-errors';
import User from '../models/users.model';



//Get all
const getAll = async(query: any) => {
    const {page = 1, limit = 10} = query;
    let sortObject = {};
    const sortType = query.sort_type || 'desc';
    const sortBy = query.sort_by || 'createdAt';
    sortObject = {...sortObject, [sortBy]: sortType === 'desc' ? -1 : 1};
    
    console.log('sortObject : ', sortObject);

    //tìm kiếm theo điều kiện
    let where: any = {};
    // nếu có tìm kiếm theo orderNumber
    if(query.orderNumber && query.orderNumber.length > 0) {
        where = {...where, orderNumber: {$regex: query.orderNumber, $options: 'i'}};
    }
    //nếu có tìm kiếm theo số điện thoại người nhận hàng
    if(query["shippingInfor.phone"] && query["shippingInfor.phone"].length > 0) {
        where = {...where, ["shippingInfor.phone"]: {$regex: query["shippingInfor.phone"], $options: 'i'}};
    }
    //nếu có tìm kiếm theo tên người nhận hàng
    if(query["shippingInfor.recipientName"] && query["shippingInfor.recipientName"].length > 0) {
        where = {...where, ["shippingInfor.recipientName"]: {$regex: query["shippingInfor.recipientName"], $options: 'i'}};
    }
    //nếu có tìm kiếm theo email user
    if(query.email && query.email.length > 0) {
        //tìm user theo email
        const user = await User.findOne({email: { $regex: query.email, $options: "i"} });
        if(user) {
            where = {...where, user: user._id};
            } else {
            return {
                products: [],
                pagination: { totalRecord: 0, limit, page },
            };
        }
    }
    //nếu có tìm kiếm theo ngày tháng đặt hàng
    let dateFilter: {$gte?: Date; $lte?: Date} = {};

    if(query.startDate) {
        const start = new Date(query.startDate);
        start.setHours(0,0,0,0);
        dateFilter.$gte = start;
    }

    if(query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23,59,59,999);
        dateFilter.$lte = end;
    }

    if(Object.keys(dateFilter).length > 0) {
        where = {...where, createdAt: dateFilter}
    }


    const orders = await Order
    .find(where)
    .populate('user')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection orders
    const count = await Order.countDocuments(where);

    return {
        orders,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const order = await Order.findById(id);
    if(!order) {
        createError(404, 'order not found, please try again with other id');
    }
    return order;
}

//get by userId
const getByUserId = async(userId: string) => {
    const order = await Order
    .find({user: userId})
    .populate('user')
    .sort({createdAt: -1});
    if(!order) {
        createError(404, 'order not found, please try again with other userId');
    }
    return order;
}


// Create
const create = async(payload: any) => {
    // kiểm tra xem orders có tồn tại không
    const orderExist = await Order.findOne({orderNumber: payload.orderNumber});
    if(orderExist) {
        throw createError(404, "order already exists");
    }
    // Lọc bỏ các field rỗng ("") hoặc null/undefined
    const cleanData = Object.fromEntries(
        Object.entries(payload).filter(
          ([_, value]) => value !== "" && value !== null && value !== undefined
        )
    )
    const order = new Order({
        orderNumber: cleanData.orderNumber,
        products: cleanData.products,
        totalAmount: cleanData.totalAmount ? cleanData.totalAmount : 0,
        shippingFee: cleanData.shippingFee ? cleanData.shippingFee : 0,
        tax: cleanData.tax ? cleanData.tax : 0,
        discount: cleanData.discount ? cleanData.discount : 0,
        paymentMethod: cleanData.paymentMethod,
        paymentStatus: cleanData.paymentStatus ? cleanData.status : "pending",
        shippingAddress: cleanData.shippingAddress,
        shippingInfor: cleanData.shippingInfor,
        status: cleanData.status ? cleanData.status : "pending",
        notes: cleanData.notes,
        orderDate: cleanData.orderDate,
        user: cleanData.user,
    });
    // lưu dữ liệu
    await order.save();
    return order; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const order = await getById(id);
    if(!order) {
        throw createError(404, "order not found");
    }
    // kiểm tra xem orderNumber tồn tại không
    const orderExist = await Order.findOne({
        orderNumber: payload.orderNumber,
        _id: { $ne: id }
    });
    if(orderExist) {
        throw createError(404, "orderNumber already exists");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(order, payload);
    /*lưu ý dữ liệu sau khi trộn chỉ lưu vào bộ nhớ Ram chứ chưa lưu vào database
    --> cần lưu xuống database */
    await order.save();
    // trả kết quả
    return order;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const order = await getById(id);
    if(!order) {
        throw createError(404, "order not found");
    }
    //xóa order
    await order.deleteOne({_id: order.id});
    return order;
}


export default {
    getAll,
    getById,
    getByUserId,
    create,
    updateById,
    deleteById
}