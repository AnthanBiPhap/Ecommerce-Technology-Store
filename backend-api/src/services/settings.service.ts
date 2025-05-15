import Setting from '../models/setting.model';
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
    // nếu có tìm kiếm theo key
    if(query.key && query.key.length > 0) {
        where = {...where, key: {$regex: query.key, $options: 'i'}};
    }

    const settings = await Setting
    .find(where)
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection settings
    const count = await Setting.countDocuments(where);

    return {
        settings,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const setting = await Setting.findById(id);
    if(!setting) {
        createError(404, 'setting not found, please try again with other id');
    }
    return setting;
}


// Create
const create = async(payload: any) => {
    // kiểm tra xem key có tồn tại không
    const settingExist = await Setting.findOne({key: payload.key});
    if(settingExist) {
        throw createError(404, "setting already exists");
    }
    const setting = new Setting({
        key: payload.key,
        value: payload.value,
        type: payload.type,
        group: payload.group,
        isPublic: payload.isPublic ? payload.isPublic : false,
        description: payload.description
    });
    // lưu dữ liệu
    await setting.save();
    return setting; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const setting = await getById(id);
    if(!setting) {
        throw createError(404, "setting not found");
    }
    // kiểm tra xem key tồn tại không
    const settingExist = await Setting.findOne({
        key: payload.key,
        _id: { $ne: id }
    });
    if(settingExist) {
        throw createError(404, "setting already exists");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(setting, payload);
    //lưu dữ liệu xuống database
    await setting.save();
    // trả kết quả
    return setting;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const setting = await getById(id);
    if(!setting) {
        throw createError(404, "setting not found");
    }
    //xóa setting
    await setting.deleteOne({_id: setting.id});
    return setting;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}



