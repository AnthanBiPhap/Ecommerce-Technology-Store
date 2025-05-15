import Location from '../models/location.model';
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
    // nếu có tìm kiếm theo name
    if(query.name && query.name.length > 0) {
        where = {...where, name: {$regex: query.name, $options: 'i'}};
    }

    const locations = await Location
    .find(where)
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection locations
    const count = await Location.countDocuments(where);

    return {
        locations,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const location = await Location.findById(id);
    if(!location) {
        createError(404, 'location not found, please try again with other id');
    }
    return location;
}


// Create
const create = async(payload: any) => {
    // kiểm tra xem tên của locations có tồn tại không
    const locationExist = await Location.findOne({name: payload.name});
    if(locationExist) {
        throw createError(404, "location already exists");
    }
    const location = new Location({
        name: payload.name,
        addressLine1: payload.addressLine1,
        addressLine2: payload.addressLine2,
        city: payload.city,
        state: payload.state,
        postalCode: payload.postalCode,
        country: payload.country,
        isActive: payload.isActive ? payload.isActive : true
    });
    // lưu dữ liệu
    await location.save();
    return location; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const location = await getById(id);
    if(!location) {
        throw createError(404, "location not found");
    }
    // kiểm tra xem location_name tồn tại không
    const locationExist = await Location.findOne({
        name: payload.name,
        _id: { $ne: id }
    });
    if(locationExist) {
        throw createError(404, "location already exists");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(location, payload);
    //lưu dữ liệu xuống database
    await location.save();
    // trả kết quả
    return location;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const location = await getById(id);
    if(!location) {
        throw createError(404, "location not found");
    }
    //xóa location
    await location.deleteOne({_id: location.id});
    return location;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}



