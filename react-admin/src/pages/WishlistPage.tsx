import {
  Table,
  Space,
  Input,
  Button,
  Modal,
  Form,
  message,
  Select,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { env } from '../constants/getEnvs';

interface Wishlist {
  _id: string;
  user: string;
  product: string;
  createdAt: string;
}

interface User {
  _id: string;
  fullName: string;
  email: string;
}

interface Product {
  _id: string;
  productName: string;
  price: number;
  salePrice?: number;
  images: string[];
}

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { tokens } = useAuthStore();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchWishlists();
    fetchUsers();
    fetchProducts();
  }, [pagination.current, pagination.pageSize]);

  const fetchWishlists = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error('Vui lòng đăng nhập để tiếp tục');
        navigate('/login');
        return;
      }

      setLoading(true);
      const response = await axios.get(`${env.API_URL}/api/v1/wishlists`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
        },
      });
      setWishlists(response.data.data.wishlists || []);
      setPagination({
        ...pagination,
        total: response.data.data.pagination?.total || 0,
      });
    } catch (error) {
      message.error('Lỗi khi lấy danh sách danh sách yêu thích');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      if (!tokens?.accessToken) return;
      
      const response = await axios.get(`${env.API_URL}/api/v1/users`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` }
      });
      setUsers(response.data.data.users || []);
    } catch (error: any) {
      handleError(error, 'Lỗi khi lấy danh sách người dùng');
    }
  };

  const fetchProducts = async () => {
    try {
      if (!tokens?.accessToken) return;
      
      const response = await axios.get(`${env.API_URL}/api/v1/products`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` }
      });
      setProducts(response.data.data.products || []);
    } catch (error: any) {
      handleError(error, 'Lỗi khi lấy danh sách sản phẩm');
    }
  };
  
  const handleError = (error: any, defaultMessage: string) => {
    if (error.response?.status === 401) {
      message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
      navigate('/login');
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message);
    } else {
      message.error(defaultMessage);
    }
  };

  const handleDeleteWishlist = async (wishlistId: string) => {
    try {
      await Modal.confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa mục này khỏi danh sách yêu thích?',
        okText: 'Xóa',
        okType: 'danger',
        cancelText: 'Hủy',
      });

      if (!tokens?.accessToken) {
        message.error('Vui lòng đăng nhập để tiếp tục');
        navigate('/login');
        return;
      }
      
      await axios.delete(`${env.API_URL}/api/v1/wishlists/${wishlistId}`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` }
      });
      message.success('Xóa khỏi danh sách yêu thích thành công');
      fetchWishlists();
    } catch (error) {
      message.error('Lỗi khi xóa khỏi danh sách yêu thích');
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (userId: string) => {
        const user = users.find(u => u._id === userId);
        return user ? (
          <div>
            <div style={{ fontWeight: 600 }}>{user.fullName || user.email}</div>
            <div style={{ color: '#666' }}>{user.email}</div>
          </div>
        ) : (
          <Tag color="warning">User not found</Tag>
        );
      },
    },
    {
      title: 'Product',
      dataIndex: 'product',
      key: 'product',
      render: (productId: string) => {
        const product = products.find(p => p._id === productId);
        return product ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img 
              src={product.images[0] || ''}
              alt="Product"
              style={{ width: 50, height: 50, objectFit: 'cover' }}
            />
            <div>
              <div style={{ fontWeight: 600 }}>{product.productName}</div>
              <div style={{ color: '#666' }}>
                {product.salePrice ? `$${product.salePrice.toFixed(2)}` : `$${product.price.toFixed(2)}`}
              </div>
            </div>
          </div>
        ) : (
          <Tag color="warning">Product not found</Tag>
        );
      },
    },
    {
      title: 'Added At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Wishlist) => (
        <Space size="middle">
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteWishlist(record._id)}>
            Remove
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Wishlist Management</h1>
      </div>
      <Table
        columns={columns}
        dataSource={wishlists}
        loading={loading}
        pagination={pagination}
        rowKey="_id"
        onChange={(newPagination) => {
          setPagination({
            ...pagination,
            current: newPagination.current || pagination.current,
            pageSize: newPagination.pageSize || pagination.pageSize,
          });
        }}
      />
    </div>
  );
};

export default WishlistPage;
