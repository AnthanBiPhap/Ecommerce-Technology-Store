import TechNew from '../models/techNew.model';
import { ITechNew } from '../types/type';
import createError from 'http-errors';


//get All
const getAll = async(query: any) => {
    const {page = 1, limit = 8} = query;
    let sortObject = {};
    const sortType = query.sort_type || 'desc';
    const sortBy = query.sort_by || 'createdAt';
    sortObject = {...sortObject, [sortBy]: sortType === 'desc' ? 1 : -1};
    
    console.log('sortObject ===>', sortObject);

    //tìm kiếm ở đâu
    let where = {};
    //tìm kiếm theo title
    if(query.title && query.title.length > 0) {
        where = {...where, title: {$regex: query.title, $option: 'i'}}
    }

    const techNews = await TechNew
    .find(where)
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject})
    ;

    //đếm tổng số record trong news
    const count = await TechNew.countDocuments(where);

    return {
        techNews,
        pagination: {
            totalRecord: count,
            page,
            limit
        }
    };
}

//get by id
const getById = async(id: string) => {
    const techNew = await TechNew.findById(id);
    if(!techNew) {
        throw createError(404, 'technology new not found')
    }
    return techNew;
}

//create
const create = async(payload: ITechNew) => {
    //Kiểm tra xem tile đã tồn tại chưa
    const techNewExists = await TechNew.findOne({title: payload.title});
    if(techNewExists) {
        throw createError(404,'new already exists');
    }
    const techNew = new TechNew({
        title: payload.title,
        keyword: payload.keyword,
        thumbnail: payload.thumbnail,
        description: payload.description,
        content: payload.content,
        date: payload.date
    })
    // lưu dữ liệu xuống
    await techNew.save();
    return techNew;
}

//update by id
const updateById = async(id: string, payload: ITechNew) => {
    //Kiểm tra xem id có tồn tại không
    const techNew = await getById(id);
    //Kiểm tra xem tile đã tồn tại chưa
    if (payload.title && payload.title !== techNew.title) {
        const techNewExists = await TechNew.findOne({
        title: payload.title,
        _id: { $ne: id }
        });
        if(techNewExists) {
           throw createError(404, 'Technology new already exists');
        }
    }
    // trộn dữ liệu mới và cũ
    Object.assign(techNew, payload);

    // Lưu thay đổi vào database
    await techNew.save();
    
    return techNew;
}

const deleteById = async(id: string) => {
    //Kiểm tra xem new có tồn tại không
    const techNew = await getById(id);
    // xóa dữ liệu
    await techNew.deleteOne({_id: techNew.id});
    return techNew;
}

export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}