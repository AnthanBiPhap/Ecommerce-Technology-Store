import { Mixed, Types } from "mongoose"

export interface ICategory{
    category_name: string,
    description: string,
    slug: string,
    parentId: Types.ObjectId | null,
    level: number,
    imageUrl: string,
    isActive: boolean
}

export interface IBrand{
    brand_name: string,
    description: string,
    slug: string
}

interface IAttribute{
    name: string,
    value: string,
    time: string,
}

export interface IProduct{
    product_name: string,
    words?: string,
    description: string,
    slug: string,
    price: number,
    salePrice?: number,
    stock: number,
    images: string[],
    attributes: IAttribute[],
    rating: number,
    reviewCount: number,
    tags: string[],
    isActive: boolean,
    bestSale: boolean,
    flashSale: boolean,
    promotion: string[],
    contentBlock: object[],
    category: Types.ObjectId,
    brand: Types.ObjectId,
    vendor: Types.ObjectId,
}

export interface IVendor {
    companyName: string,
    description: string,
    logoUrl: string,
    coverImageUrl: string,
    address: object,
    contactPhone: string,
    contactEmail: string,
    website: string,
    socialLinks: object,
    rating: number,
    status: string,
    user: Types.ObjectId,
}

export interface IOrder{
    orderNumber: string,
    products: object[],
    totalAmount: number,
    shippingFee: number,
    tax: number,
    discount: number,
    paymentMethod: string,
    paymentStatus: string,
    shippingAddress: object,
    shippingInfor: object,
    status: string,
    notes: string,
    orderDate: Date,
    user: Types.ObjectId
}

export interface IReview {
    rating: number,
    title: string,
    comment: string,
    images: string[],
    isVerified: boolean,
    product: Types.ObjectId
    user: Types.ObjectId
}


export interface ICartItem {
    _id?: Types.ObjectId,
    product: Types.ObjectId
    quantity: number,
    currentPrice: number,
    currentSalePrice: number,
    totalAmount: number
}

export interface ICart {
    items: ICartItem[],
    totalAmount: number,
    user: Types.ObjectId
}

export interface IPayment {
    amount: number,
    method: string,
    status: string,
    transactionId: string,
    gateway: string,
    metadata: object,
    order: Types.ObjectId
    user: Types.ObjectId
}

export interface IWishlist {
    user: Types.ObjectId
    product: Types.ObjectId | string
}

export interface ICoupon {
    code: string,
    type: string,
    value: number,
    minPurchase: number,
    startDate: Date,
    endDate: Date,
    usageLimit: number,
    usageCount: number,
    isActive: boolean
}

export interface IAddress {
    type: string,
    fullName: string,
    phoneNumber: string,
    street: string,
    ward: string,
    district: string,
    city: string,
    country: string,
    isDefault: boolean,
    user: Types.ObjectId | string
}

export interface IShipping {
    carrier: string,
    trackingNumber: string,
    status: string,
    estimatedDelivery: Date,
    actualDelivery: Date,
    shippingMethod: string,
    shippingFee: number,
    order: Types.ObjectId | string
}


export interface INotification {
    type: string,
    title: string,
    message: string,
    metadata: object,
    isRead: boolean,
    user: Types.ObjectId | string
}

export interface IProductVariant {
    sku: string,
    variantName: string,
    attributes: object,
    price: number,
    salePrice: number,
    stock: number,
    images: string[],
    isActive: boolean,
    product: Types.ObjectId | string
}

export interface ILocation {
    name: string;           
    addressLine1: string;   
    addressLine2: string;  
    city: string;           
    state: string;         
    postalCode: string;     
    country: string;        
    isActive: boolean;     
  }

export interface IProductInventory {
    quantity: number,
    reservedQuantity: number,
    lowStockThreshold: number,
    lastRestocked: Date,
    product: Types.ObjectId
    variant: Types.ObjectId
    location: Types.ObjectId
}

export interface ISetting {
    key: string,
    value: Mixed,
    type: string,
    group: string,
    isPublic: boolean,
    description: string,
}

export interface IProductAttribute {
    name: string,
    displayName: string,
    description: string,
    type: string,
    options: string[],
    isFilterable: boolean,
    isVariant: boolean,
    isRequired: boolean
}

export interface IPaymentMethod {
    type: string,
    provider: string,
    accountNumber: string,
    expiryDate: Date,
    cardholderName: string,
    billingAddress: object,
    isDefault: boolean,
    metadata: object,
    user: Types.ObjectId | string
}

export interface IActivityLog {
    action: string,
    entityType: string,
    entityId: object,
    description: string,
    metadata: object,
    ipAddress: string,
    userAgent: string,
    user: Types.ObjectId | string
}

export interface ISEO {
    entityType: string,
    entityId: object,
    metaTitle: string,
    metaDescription: string,
    metaKeywords: string,
    ogTitle: string,
    ogDescription: string,
    ogImage: string,
    canonicalUrl: string,
}

export interface ITechNew {
    title: string,
    keyword: string,
    thumbnail: string,
    description: string,
    content: string,
    date: Date
}

export interface Iuser{
    userName: string,
    fullName: string,
    email: string,
    password: string,
    roles: string,
    status: string,
    avatarUrl: string,
    lastLogin: Date,
    gender?: string,
    phone?: string,
    birthDay?: Date
}