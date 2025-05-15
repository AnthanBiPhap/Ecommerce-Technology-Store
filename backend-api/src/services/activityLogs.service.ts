import ActivityLog from '../models/activityLog.model';
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

    const activityLogs = await ActivityLog
    .find(where)
    .populate('entityId')
    .populate('user')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection activityLogs
    const count = await ActivityLog.countDocuments(where);

    return {
        activityLogs,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const activityLog = await ActivityLog.findById(id);
    if(!activityLog) {
        createError(404, 'activityLog not found, please try again with other id');
    }
    return activityLog;
}


// Create
const create = async(payload: any) => {
    const activityLog = new ActivityLog({
        action: payload.action,
        entityType: payload.entityType,
        entityId: payload.entityId,
        description: payload.description,
        metadata: payload.metadata,
        ipAddress: payload.ipAddress,
        userAgent: payload.userAgent,
        user: payload.user,
    });
    // lưu dữ liệu
    await activityLog.save();
    return activityLog; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const activityLog = await getById(id);
    if(!activityLog) {
        throw createError(404, "activityLog not found");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(activityLog, payload);
    //lưu dữ liệu xuống database
    await activityLog.save();
    // trả kết quả
    return activityLog;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const activityLog = await getById(id);
    if(!activityLog) {
        throw createError(404, "activityLog not found");
    }
    //xóa activityLog
    await activityLog.deleteOne({_id: activityLog.id});
    return activityLog;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}



