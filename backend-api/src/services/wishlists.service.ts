import Wishlist from '../models/wishlist.model';
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


    const wishlists = await Wishlist
    .find(where)
    .populate('user')
    .populate('product')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection wishlists
    const count = await Wishlist.countDocuments(where);

    return {
        wishlists,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const wishlist = await Wishlist.findById(id);
    if(!wishlist) {
        createError(404, 'wishlist not found, please try again with other id');
    }
    return wishlist;
}


// Create
const create = async(payload: any) => {
    const wishlist = new Wishlist({
        user: payload.user,
        product: payload.product
    });
    // lưu dữ liệu
    await wishlist.save();
    return wishlist; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const wishlist = await getById(id);
    if(!wishlist) {
        throw createError(404, "wishlist not found");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(wishlist, payload);
    /*lưu ý dữ liệu sau khi trộn chỉ lưu vào bộ nhớ Ram chứ chưa lưu vào database
    --> cần lưu xuống database */
    await wishlist.save();
    // trả kết quả
    return wishlist;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const wishlist = await getById(id);
    if(!wishlist) {
        throw createError(404, "wishlist not found");
    }
    //xóa wishlist
    await wishlist.deleteOne({_id: wishlist.id});
    return wishlist;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}