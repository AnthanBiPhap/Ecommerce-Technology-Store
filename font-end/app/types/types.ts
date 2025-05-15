
  
export  interface IProduct {
    _id: string;
    product_name: string;
    slug: string;
    price: number;
    salePrice: number;
    images: string[];
  }
  
export  interface ICartItem {
    _id: string;
    product: IProduct;
    quantity: number;
    currentPrice: number;
    currentSalePrice: number;
    totalAmount: number;
  }
  
export interface ICart {
    _id: string;
    items: ICartItem[];
    totalAmount: number;
    user: string
  }

export interface IShippingAddress {
  street: string;
  ward: string;
  district: string;
  city: string;
  country?: string;
}

export interface IShippingInfor {
  recipientName: string;
  gender: "male" | "female";
  phone: string
}

export interface IOrderItem {
  _id: string,
  product: IProduct,
  quantity: number,
  currentPrice: number,
  currentSalePrice: number,
  totalAmount: number
}

export interface IOrder {
  _id: string,
  orderNumber: string;
  products: IOrderItem[];
  totalAmount: number;
  shippingFee: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: IShippingAddress;
  shippingInfor: IShippingInfor;
  createdAt: Date;
  status: string;
  notes: string;
  user: string;
}