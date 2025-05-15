import Cart from '../models/cart.model';
import createError from 'http-errors';
import { ICart } from '../types/type';
import { Types } from "mongoose"


type TCartItemPayload = {
    product: Types.ObjectId,
    quantity: number,
    currentPrice: number,
    currentSalePrice: number,
    totalAmount: number  
}

type TUpdateCartPayLoad = {
    items: TCartItemPayload[],
    totalAmount: number
}

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

    const carts = await Cart
    .find(where)
    .populate('user')
    .skip((page-1)*limit)
    .limit(limit)
    .sort({...sortObject});
    
    //Đếm tổng số record hiện có của collection carts
    const count = await Cart.countDocuments(where);

    return {
        carts,
        pagination: {
            totalRecord: count,
            limit,
            page
        }
    };
}

//get by ID
const getById = async(id: string) => {
    const cart = await Cart.findById(id);
    if(!cart) {
        createError(404, 'cart not found, please try again with other id');
    }
    return cart;
}

//getby userId
const getByUserId = async(userId: string) => {
    const cart = await Cart
    .findOne({user: userId})
    .populate({
        path: 'items.product',
        select: 'product_name slug price salePrice images'
      });
    if(!cart) {
        createError(404, 'cart not found, please try again with other userId');
    }
    return cart;
}


// Create new carts (basic)
const create = async(payload: ICart) => {
    const cart = new Cart({
        items: payload.items,
        totalAmount: payload.totalAmount ? payload.totalAmount : 0,
        user: payload.user
    });
    // lưu dữ liệu
    await cart.save();
    return cart; // trả về kết quả để truy xuất dữ liệu trong controller
}

// add new productVariant to cartItems (click add to carts)
const createAddToCart = async(userId: string, payload: TCartItemPayload) => {
     //kiểm tra xem payload có tồn tại không
     if (!payload.product || !payload.quantity || !payload.currentPrice || !payload.currentSalePrice || !payload.totalAmount) {
        throw createError(400, "không có payload");
      }
    let cart = await Cart.findOne({user: userId});

    if(!cart) {
        //Tạo mới giỏ hàng
        cart = new Cart({
            user: userId,
            items: [payload],
            totalAmount: payload.totalAmount
        });
    } else {
        //kiểm tra xem product có tồn tại trong cart chưa
        const productExist = cart.items.find(item => item.product === payload.product)
        if(productExist) {
            throw createError(404, "product have been existed");
        }
    
        //thêm data vào giỏ hàng
        cart.items.push(payload);
        // cập nhật lại tổng tiền giỏ hàng
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalAmount, 0);
    }
    // lưu dữ liệu
    await cart.save();
    return cart;
};

// update by ID
const updateById = async(id: string, payload: any) => {
    //kiểm tra xem id có tồn tại không
    const cart = await getById(id);
    if(!cart) {
        throw createError(404, "cart not found");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(cart, payload);
    /*lưu ý dữ liệu sau khi trộn chỉ lưu vào bộ nhớ Ram chứ chưa lưu vào database
    --> cần lưu xuống database */
    await cart.save();
    // trả kết quả
    return cart;
}

// update by userId
const updateByUserId = async(userId: string, payload: TUpdateCartPayLoad) => {
    //kiểm tra xem id có tồn tại không
    const cart = await getByUserId(userId);
    if(!cart) {
        throw createError(404, "cart not found");
    }
    // trộn dữ liệu mới và cũ
    Object.assign(cart, payload);
    /*lưu ý dữ liệu sau khi trộn chỉ lưu vào bộ nhớ Ram chứ chưa lưu vào database
    --> cần lưu xuống database */
    await cart.save();
    // trả kết quả
    return cart;
}

//Delete by id
const deleteById = async(id: string) => {
    //kiểm tra xem id có tồn tại không
    const cart = await getById(id);
    if(!cart) {
        throw createError(404, "cart not found");
    }
    //xóa cart
    await cart.deleteOne({_id: cart.id});
    return cart;
}

//Delete by userId
const deleteByUserId = async(userId: string) => {
    //kiểm tra xem id có tồn tại không
    const cart = await getByUserId(userId);
    if(!cart) {
        throw createError(404, "cart not found");
    }
    //xóa cart
    await cart.deleteOne();
    return cart;
}

//Delete by itemId
const deleteByItemId = async(userId: string, itemId: string) => {
    //kiểm tra xem id có tồn tại không
    const cart = await getByUserId(userId);
    if(!cart) {
        throw createError(404, "cart not found");
    }
    //xóa item
    const itemIndex = cart.items.findIndex(item => item._id?.toString() === itemId);
    
    if (itemIndex === -1) {
        throw createError(404, "item not found");
    }

    // Loại bỏ item ra khỏi mảng
    cart.items.splice(itemIndex, 1);
    // cập nhật lại tổng tiền giỏ hàng
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalAmount, 0);
    //lưu xuống data
    await cart.save();
    return cart;
}


export default {
    getAll,
    getById,
    getByUserId,
    create,
    createAddToCart,
    updateById,
    updateByUserId,
    deleteById,
    deleteByUserId,
    deleteByItemId
}