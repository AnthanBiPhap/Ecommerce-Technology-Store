import SEO from '../models/seo.model';
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

    const seos = await SEO
    .find(where)
    .populate('entityId')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection seos
    const count = await SEO.countDocuments(where);

    return {
        seos,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const seo = await SEO.findById(id);
    if(!seo) {
        createError(404, 'seo not found, please try again with other id');
    }
    return seo;
}


// Create
const create = async(payload: any) => {
    const seo = new SEO({
        entityType: payload.entityType,
        entityId: payload.entityId,
        metaTitle: payload.metaTitle,
        metaDescription: payload.metaDescription,
        metaKeywords: payload.metaKeywords,
        ogTitle: payload.ogTitle,
        ogDescription: payload.ogDescription,
        ogImage: payload.ogImage,
        canonicalUrl: payload.canonicalUrl,
    });
    // lưu dữ liệu
    await seo.save();
    return seo; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const seo = await getById(id);
    if(!seo) {
        throw createError(404, "seo not found");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(seo, payload);
    //lưu dữ liệu xuống database
    await seo.save();
    // trả kết quả
    return seo;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const seo = await getById(id);
    if(!seo) {
        throw createError(404, "seo not found");
    }
    //xóa seo
    await seo.deleteOne({_id: seo.id});
    return seo;
}


export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}



