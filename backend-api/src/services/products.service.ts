import Product from '../models/product.model';
import Category from '../models/category.model';
import Brand from '../models/brand.model';
import { buildSlug } from '../helpers/slugify.helper';
import createError from 'http-errors';



//Get all
const getAll = async(query: any) => {
    const {page = 1, limit = 12} = query;
    const {search} = query;
    let sortObject = {};
    const sortType = query.sort_type || 'desc';
    const sortBy = query.sort_by || 'createdAt';
    sortObject = {...sortObject, [sortBy]: sortType === 'desc' ? -1 : 1};
    
    console.log('sortObject : ', sortObject);

    //tìm kiếm theo điều kiện
    let where:any = {};
    // nếu có tìm kiếm theo tên sản phẩm
    if(query.product_name && query.product_name.length > 0) {
        where = {...where, product_name: {$regex: query.product_name, $options: 'i'}};
    }
    // Nếu có tìm kiếm theo slug danh mục
    if (query.category_slug && query.category_slug.length > 0) {
        // Tìm danh mục theo slug
        const category = await Category.findOne({ slug: { $regex: query.category_slug, $options: "i" } });
    
        if (category) {
            where = { ...where, category: category._id }; // Lọc theo category._id
        } else {
            return {
                products: [],
                pagination: { totalRecord: 0, limit, page },
            };
        }
    }
    // nếu có tìm kiếm theo flashSale
    if(query.flashSale && query.flashSale.length > 0) {
        where = {...where, flashSale: true};
    }

    // nếu có tìm kiếm theo bestSale
    if(query.bestSale && query.bestSale.length > 0) {
        where = {...where, bestSale: true};
    }

    // Nếu có tìm kiếm theo slug brand
    if (query.brand_slug && query.brand_slug.length > 0) {
        // Tìm danh mục theo slug
        const brand = await Brand.findOne({ slug: { $regex: query.brand_slug, $options: "i" } });
    
        if (brand) {
            where = { ...where, brand: brand._id }; // Lọc theo category._id
        } else {
            return {
                products: [],
                pagination: { totalRecord: 0, limit, page },
            };
        }
    }

    // Nếu có tìm kiếm theo giá
    let priceFilter: { $gte?: number; $lte?: number } = {};

    if (query.price_gte && !isNaN(parseFloat(query.price_gte))) {
        priceFilter.$gte = parseFloat(query.price_gte);
    }

    if (query.price_lte && !isNaN(parseFloat(query.price_lte))) {
        priceFilter.$lte = parseFloat(query.price_lte);
    }

    if (Object.keys(priceFilter).length > 0) {
        where = { ...where, salePrice: priceFilter };
    }

    //Nếu có tìm kiếm theo ratting
    let ratingFilter: { $gte?: number } = {};

    if (query.rating_gte && !isNaN(parseFloat(query.rating_gte))) {
        ratingFilter.$gte = parseFloat(query.rating_gte);
    }

    if (Object.keys(ratingFilter).length > 0) {
        where = { ...where, rating: ratingFilter };
    }

    // Tìm theo từ khóa
    if (search && typeof search === "string") {
        const keywords = search.split(/[\s-]+/).map((word) => word.trim()).filter(Boolean);
        const regex = new RegExp(keywords.join(".*"), "i");
        where["$or"] = [
            { product_name: regex },
            { description: regex },
            { slug: regex },
            { "attributes.value": regex },
        ];
    }


    const products = await Product
    .find(where)
    .populate('category')
    .populate('brand')
    .populate('vendor')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection products
    const count = await Product.countDocuments(where);

    return {
        products,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//Get all by type
const getAllByType = async(params: any ,query: any) => {
    const {page = 1, limit = 20} = query;
    let sortObject = {};
    const sortType = query.sort_type || 'desc';
    const sortBy = query.sort_by || 'createdAt';
    sortObject = {...sortObject, [sortBy]: sortType === 'desc' ? -1 : 1};
    
    console.log('sortObject getAllByType : ', sortObject);

    //tìm kiếm theo điều kiện
    let where = {};
    const slug = params.slug;

    console.log('slug===>', slug);
    // nếu có tìm kiếm theo tên sản phẩm
    if(query.product_name && query.product_name.length > 0) {
        where = {...where, product_name: {$regex: query.product_name, $options: 'i'}};
    }
    // Nếu có tìm kiếm theo params
    if (slug && slug.length > 0) {
        const category = await Category.findOne({
            slug: { $regex: slug, $options: 'i' },
        });

        if (category) {
            where = { ...where, category: category._id };
        } else if (slug === 'bestsale') {
            where = { ...where, bestSale: true };
        } else if (slug === 'flashsale') {
            where = { ...where, flashSale: true };
        } else {
            return {
                products: [],
                pagination: { totalRecord: 0, limit, page },
            };
        }
    }

    console.log('where===>', where);

    const products = await Product
    .find(where)
    .populate('category')
    .populate('brand')
    .populate('vendor')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection products
    const count = await Product.countDocuments(where);

    return {
        products,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const product = await Product.findById(id);
    if(!product) {
        createError(404, 'product not found, please try again with other id');
    }
    return product;
}

//get by slug
const getBySlug = async(slug: string) => {
    const product = await Product.findOne({slug});
    if(!product) {
        createError(404, 'product not found, please try again with other id');
    }
    return product;
}


// Create
const create = async(payload: any) => {
    // kiểm tra xem tên của products có tồn tại không
    const productExist = await Product.findOne({product_name: payload.product_name});
    if(productExist) {
        throw createError(404, "product already exists");
    }
    const product = new Product({
        product_name: payload.product_name,
        description: payload.description,
        slug: buildSlug(payload.product_name),
        price: payload.price,
        salePrice: payload.salePrice,
        stock: payload.stock ? payload.stock : 0,
        images: payload.images,
        attributes: payload.attributes,
        rating: payload.rating ? payload.rating : 0,
        reviewCount: payload.reviewCount ? payload.reviewCount : 0,
        tags: payload.tags,
        isActive: payload.isActive ? payload.isActive : true,
        bestSale: payload.bestSale ? payload.bestSale : false,
        flashSale: payload.flashSale ? payload.flashSale : false,
        promotion: payload.promotion,
        contentBlock: payload.contentBlock,
        category: payload.category,
        brand: payload.brand,
        vendor: payload.vendor
    });
    // lưu dữ liệu
    await product.save();
    return product; // trả về kết quả để truy xuất dữ liệu trong controller
    
}
// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const product = await getById(id);
    if(!product) {
        throw createError(404, "product not found");
    }
    // kiểm tra xem product_name tồn tại không
    const productExist = await Product.findOne({
        product_name: payload.product_name,
        _id: { $ne: id } // loại trừ sản phẩm hiện tại
    });
    if(productExist) {
        throw createError(404, "product already exists");
    }
    // update slug
    if(payload.product_name){
        payload.slug = buildSlug(payload.product_name);// tự động tạo trường slug vào payload
    }
    // trộn dữ liệu mới và cũ
    Object.assign(product, payload);
    /*lưu ý dữ liệu sau khi trộn chỉ lưu vào bộ nhớ Ram chứ chưa lưu vào database
    --> cần lưu xuống database */
    await product.save();
    // trả kết quả
    return product;
}
//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const product = await getById(id);
    if(!product) {
        throw createError(404, "product not found");
    }
    //xóa product
    await product.deleteOne({_id: product.id});
    return product;
}


export default {
    getAll,
    getAllByType,
    getById,
    getBySlug,
    create,
    updateById,
    deleteById
}