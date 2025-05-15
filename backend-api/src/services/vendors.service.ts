import Vendor from '../models/vendor.model';
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
    // nếu có tìm kiếm theo tên số điện thoại
    if(query.contactPhone && query.contactPhone.length > 0) {
        where = {...where, contactPhone: {$regex: query.contactPhone, $options: 'i'}};
    }

    const vendors = await Vendor
    .find(where)
    .populate('user')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection vendors
    const count = await Vendor.countDocuments(where);

    return {
        vendors,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const vendor = await Vendor.findById(id);
    if(!vendor) {
        createError(404, 'vendor not found, please try again with other id');
    }
    return vendor;
}


// Create
const create = async(payload: any) => {
    // kiểm tra xem tên của vendors có tồn tại không
    const vendorExist = await Vendor.findOne({companyName: payload.companyName});
    if(vendorExist) {
        throw createError(404, "vendor already exists");
    }
    const vendor = new Vendor({
        companyName: payload.companyName,
        description: payload.description,
        logoUrl: payload.logoUrl,
        coverImageUrl: payload.coverImageUrl,
        address: payload.address,
        contactPhone: payload.contactPhone,
        contactEmail: payload.contactEmail,
        website: payload.website,
        socialLinks: payload.socialLinks,
        rating: payload.rating ? payload.rating : 0,
        status: payload.status ? payload.status : "pending",
        user: payload.user
    });
    // lưu dữ liệu
    await vendor.save();
    return vendor; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const vendor = await getById(id);
    if(!vendor) {
        throw createError(404, "vendor not found");
    }
    // kiểm tra xem tên của vendor tồn tại không
    const vendorExist = await Vendor.findOne({
        companyName: payload.companyName,
        _id: { $ne: id }
    });
    if(vendorExist) {
        throw createError(404, "vendor already exists");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(vendor, payload);
    /*lưu ý dữ liệu sau khi trộn chỉ lưu vào bộ nhớ Ram chứ chưa lưu vào database
    --> cần lưu xuống database */
    await vendor.save();
    // trả kết quả
    return vendor;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const vendor = await getById(id);
    if(!vendor) {
        throw createError(404, "vendor not found");
    }
    //xóa vendor
    await vendor.deleteOne({_id: vendor.id});
    return vendor;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}