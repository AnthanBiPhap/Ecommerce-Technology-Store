export interface User {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
  roles: string;
  status: string;
}

export interface ActivityLog {
  _id: string;
  createdAt: string;
  user: {
    _id: string;
    userName: string;
    fullName: string;
  };
  action: string;
  entityType: string;
  description: string;
  details: any;
}

export interface Pagination {
  totalRecord: number;
  limit: number;
  page: number;
}


export interface AddressSearchParams {
  fullName?: string;
  city?: string;
  phoneNumber?: string;
}

export interface Address {
  _id?: string;
  type: 'shipping' | 'billing';
  fullName: string;
  phoneNumber: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  isDefault: boolean;
  user: string | {
    _id: string;
    userName: string;
    fullName: string;
    email: string;
    roles: string;
    status: string;
    avatarUrl: string;
    createdAt: string;
    updatedAt: string;
    birthDay: string;
    gender: string;
    phone: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  totalRecord: number;
  limit: number;
  page: number;
}
