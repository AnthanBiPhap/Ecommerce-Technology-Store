import Notification from '../models/notification.model';
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
    // nếu có tìm kiếm theo title
    if(query.title && query.title.length > 0) {
        where = {...where, title: {$regex: query.title, $options: 'i'}};
    }

    const notifications = await Notification
    .find(where)
    .populate('user')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection notifications
    const count = await Notification.countDocuments(where);

    return {
        notifications,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const notification = await Notification.findById(id);
    if(!notification) {
        createError(404, 'notification not found, please try again with other id');
    }
    return notification;
}


// Create
const create = async(payload: any) => {
    const notification = new Notification({
        type: payload.type,
        title: payload.title,
        message: payload.message,
        metadata: payload.metadata,
        isRead: payload.isRead ? payload.isRead : false,
        user: payload.user
    });
    // lưu dữ liệu
    await notification.save();
    return notification; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const notification = await getById(id);
    if(!notification) {
        throw createError(404, "notification not found");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(notification, payload);
    //lưu dữ liệu xuống database
    await notification.save();
    // trả kết quả
    return notification;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const notification = await getById(id);
    if(!notification) {
        throw createError(404, "notification not found");
    }
    //xóa notification
    await notification.deleteOne({_id: notification.id});
    return notification;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}



