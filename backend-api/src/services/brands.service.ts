import Brand from '../models/brand.model';
import { buildSlug } from '../helpers/slugify.helper';
import { IBrand } from '../types/type';
import createError from 'http-errors';


//get All
const getAll = async(query: any) => {
    const {page = 1, limit = 10} = query;
    const {search} = query;
    let sortObject = {};
    const sortType = query.sort_type || 'desc';
    const sortBy = query.sort_by || 'createdAt';
    sortObject = {...sortObject, [sortBy]: sortType === 'desc' ? 1 : -1};
    
    console.log('sortObject ===>', sortObject);

    //tìm kiếm ở đâu
    let where: any = {};
    //tìm kiếm theo tên hảng
    if(query.brand_name && query.brand_name.length > 0) {
        where = {...where, brand_name: {$regex: query.brand_name, $option: 'i'}}
    }

    // Tìm theo từ khóa
    if (search && typeof search === "string") {
        const keywords = search.split(/[\s-]+/).map((word) => word.trim()).filter(Boolean);
        const regex = new RegExp(keywords.join(".*"), "i");
        where["$or"] = [
            { brand_name: regex },
            { description: regex },
            { slug: regex }
        ];
    }

    const brands = await Brand
    .find(where)
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject})
    ;

    //đếm tổng số record trong brands
    const count = await Brand.countDocuments(where);

    return {
        brands,
        pagination: {
            totalRecord: count,
            page,
            limit
        }
    };
}

//get by id
const getById = async(id: string) => {
    const brand = await Brand.findById(id);
    if(!brand) {
        throw createError(404, 'Brand not found')
    }
    return brand;
}

//create
const create = async(payload: IBrand) => {
    //Kiểm tra xem brand_name đã tồn tại chưa
    const brandExists = await Brand.findOne({brand_name: payload.brand_name});
    if(brandExists) {
        throw createError(404,'Brand already exists');
    }
    const brand = new Brand({
        brand_name: payload.brand_name,
        description: payload.description,
        slug: buildSlug(payload.brand_name)
    })
    // lưu dữ liệu xuống
    await brand.save();
    return brand;
}

//update by id
const updateById = async(id: string, payload: IBrand) => {
    //Kiểm tra xem id có tồn tại không
    const brand = await getById(id);
    //Kiểm tra xem tên brand đã tồn tại chưa
    const brandNameExist = await Brand.findOne({
        brand_name: payload.brand_name,
        _id: { $ne: id }
    });
    if(brandNameExist) {
        throw createError(404, 'Brand Name already exists');
    }
    //Thêm trường slug tự động
    if(payload.brand_name) {
        payload.slug = buildSlug(payload.brand_name);
    }
    // trộn dữ liệu mới và cũ
    Object.assign(brand, payload);

    // Lưu thay đổi vào database
    await brand.save();

    return brand;
}

const deleteById = async(id: string) => {
    //Kiểm tra xem brand có tồn tại không
    const brand = await getById(id);
    // xóa dữ liệu
    await Brand.deleteOne({_id: brand.id});
    return brand;
}

export default {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}