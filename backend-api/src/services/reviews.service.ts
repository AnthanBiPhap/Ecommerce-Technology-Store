import Review from '../models/review.model';
import createError from 'http-errors';
import { Types } from "mongoose";



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
    // nếu có tìm kiếm theo tên review
    if(query.title && query.title.length > 0 ) {
        where = {...where, title: {$regex: query.title, $options: 'i'}};
    }

    //lọc theo productId nếu có
    if(query.productId && Types.ObjectId.isValid(query.productId)) {
        where = {...where, product: Types.ObjectId.createFromHexString(query.productId)};
    }

    const reviews = await Review
    .find(where)
    .populate('product')
    .populate('user')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection reviews
    const count = await Review.countDocuments(where);

    return {
        reviews,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const review = await Review.findById(id);
    if(!review) {
        createError(404, 'review not found, please try again with other id');
    }
    return review;
}


// Create
const create = async(payload: any) => {
    const review = new Review({
        rating: payload.rating,
        title: payload.title,
        comment: payload.comment,
        images: payload.images ? payload.images : [],
        isVerified: payload.isVerified ? payload.isVerified : false,
        product: payload.product,
        user: payload.user
    });
    // lưu dữ liệu
    await review.save();
    return review; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const review = await getById(id);
    if(!review) {
        throw createError(404, "review not found");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(review, payload);
    /*lưu ý dữ liệu sau khi trộn chỉ lưu vào bộ nhớ Ram chứ chưa lưu vào database
    --> cần lưu xuống database */
    await review.save();
    // trả kết quả
    return review;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const review = await getById(id);
    if(!review) {
        throw createError(404, "review not found");
    }
    //xóa review
    await review.deleteOne({_id: review.id});
    return review;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}