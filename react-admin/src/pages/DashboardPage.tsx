import { 
  Layout,
  Menu,
  Card, 
  Row, 
  Col, 
  Avatar, 
  Typography, 
  Button,
  Dropdown,
  Segmented,
  Select,
  Progress,
  List,
  Table,
  DatePicker,
  Breadcrumb,
  Badge,
  Tag,
  message,
  Space
} from 'antd';

import { 
  ShoppingCartOutlined, 
  ProductOutlined, 
  UserOutlined,
  AppstoreOutlined, 
  TagOutlined,
  CreditCardOutlined, 
  AlipayCircleOutlined, 
  BankOutlined,
  DollarOutlined,
  DownOutlined,
  SyncOutlined,
  DownloadOutlined,
  RiseOutlined,
  FallOutlined,

  TeamOutlined,
  ThunderboltOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

const { Header, Content, Sider, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  totalBrands: number;
  totalCategories: number;
  totalCoupons: number;
  recentOrders: any[];
  topProducts: any[];
  paymentMethods: any[];
  orderChange: number;
  productChange: number;
  userChange: number;
  revenueChange: number;
  salesData: Array<{ date: string; sales: number }>;
  revenueData: Array<{ date: string; revenue: number }>;
  categoryData: Array<{ name: string; value: number }>;
  trafficData: Array<{ date: string; users: number }>;
}

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  user: {
    fullName: string;
  };
}

interface Product {
  _id: string;
  createdAt: string;
  product_name: string;
  salePrice: number;
  images: string[];
}

const statusColors: Record<string, string> = {
  pending: 'gold',
  processing: 'blue',
  shipped: 'geekblue',
  delivered: 'green',
  cancelled: 'red',
  paid: 'green',
  unpaid: 'orange'
};

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    totalBrands: 0,
    totalCategories: 0,
    totalCoupons: 0,
    recentOrders: [],
    topProducts: [],
    paymentMethods: [],
    orderChange: 0,
    productChange: 0,
    userChange: 0,
    revenueChange: 0,
    salesData: [],
    revenueData: [],
    categoryData: [],
    trafficData: []
  });
  
  const [timeRange, setTimeRange] = useState<string>('week');
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const { tokens } = useAuthStore();


  useEffect(() => {
    if (tokens?.accessToken) {
      fetchDashboardStats();
    }
  }, [tokens]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error('Vui lòng đăng nhập để xem thống kê');
        return;
      }

      setLoading(true);
      const apiPromises = [
        axios.get('http://localhost:8889/api/v1/orders', {
          headers: { 'Authorization': `Bearer ${tokens.accessToken}` },
          params: { limit: 1000 }
        }),
        axios.get('http://localhost:8889/api/v1/products?limit=100', {
          headers: { 'Authorization': `Bearer ${tokens.accessToken}` },
          params: { limit: 1000 }
        }),
        axios.get('http://localhost:8889/api/v1/users?limit=100', {
          headers: { 'Authorization': `Bearer ${tokens.accessToken}` },
          params: { limit: 1000 }
        }),
        axios.get('http://localhost:8889/api/v1/brands?limit=100', {
          headers: { 'Authorization': `Bearer ${tokens.accessToken}` }
        }),
        axios.get('http://localhost:8889/api/v1/categories/root?limit=100', {
          headers: { 'Authorization': `Bearer ${tokens.accessToken}` }
        }),
        axios.get('http://localhost:8889/api/v1/coupons?limit=100', {
          headers: { 'Authorization': `Bearer ${tokens.accessToken}` }
        }),
        axios.get('http://localhost:8889/api/v1/payments?limit=100', {
          headers: { 'Authorization': `Bearer ${tokens.accessToken}` }
        })
      ];

      const responses = await Promise.all(apiPromises);
      
      // Check for API errors
      const hasApiError = responses.some((res: any) => res.data?.statusCode !== 200);
      if (hasApiError) {
        message.error('Có lỗi khi lấy dữ liệu từ server');
        return;
      }

      // Process data
      const ordersData = responses[0].data.data?.orders || [];
      const productsData = responses[1].data.data?.products || [];
      const usersData = responses[2].data.data?.users || [];
      const brandsData = responses[3].data.data?.brands || [];
      const categoriesData = responses[4].data.data?.categories || [];
      const couponsData = responses[5].data.data?.coupons || [];
      const paymentsData = responses[6].data.data?.payments || [];

      // Process sales data from orders
      const now = new Date();
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(now.getDate() - (6 - i));
        return date.toISOString().split('T')[0];
      });

      // Filter orders based on selected time range
      let filteredOrders = [...ordersData];
      if (timeRange === 'day') {
        const today = new Date().toISOString().split('T')[0];
        filteredOrders = ordersData.filter((order: Order) => 
          new Date(order.createdAt).toISOString().split('T')[0] === today
        );
      } else if (timeRange === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filteredOrders = ordersData.filter((order: Order) => 
          new Date(order.createdAt) >= oneWeekAgo
        );
      } else if (timeRange === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        filteredOrders = ordersData.filter((order: Order) => 
          new Date(order.createdAt) >= oneMonthAgo
        );
      }

      // Count orders by date for selected time range
      const salesByDate = filteredOrders.reduce((acc: Record<string, number>, order: Order) => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        acc[orderDate] = (acc[orderDate] || 0) + 1;
        return acc;
      }, {});

      // Create sales data for chart
      const salesData = last7Days.map(date => ({
        date,
        sales: salesByDate[date] || 0
      }));

      // Process revenue data from orders (based on time range)
      const monthsToShow = timeRange === 'month' ? 12 : 6; // Show 6 months for day/week view
      const last12Months = Array.from({ length: monthsToShow }, (_, i) => {
        const date = new Date(now);
        date.setMonth(now.getMonth() - (11 - i));
        return {
          month: date.getMonth(),
          year: date.getFullYear(),
          key: `${date.getFullYear()}-${date.getMonth()}`
        };
      });

      const revenueByMonth = filteredOrders.reduce((acc: Record<string, number>, order: Order) => {
        const orderDate = new Date(order.createdAt);
        const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;
        acc[monthKey] = (acc[monthKey] || 0) + (order.totalAmount || 0);
        return acc;
      }, {});

      const revenueData = last12Months.map(({ month, year, key }) => ({
        date: new Date(year, month, 1).toLocaleString('default', { month: 'short' }),
        revenue: revenueByMonth[key] || 0
      }));

      // Define interface for category data
      interface CategoryData {
        name: string;
        value: number;
      }


      // Calculate category usage count from products
      const categoryUsage = productsData.reduce((acc: Record<string, number>, product: any) => {
        // Check both possible category name fields
        const categoryName = product.category?.category_name || 
                           product.category?.name || 
                           'Không xác định';
        
        // Count each occurrence of the category
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {});

      // Convert to array, sort by count (descending) and take top 5
      const sortedCategories: CategoryData[] = Object.entries(categoryUsage)
        .map(([name, count]) => ({
          name,
          value: count as number
        }))
        .sort((a: CategoryData, b: CategoryData) => b.value - a.value);

      const topCategories = sortedCategories.slice(0, 5);
      const otherCategories = sortedCategories.slice(5);
      
      // Calculate total for 'Other' category
      const otherTotal = otherCategories.reduce((sum: number, cat: CategoryData) => sum + cat.value, 0);

      // Combine top 5 with 'Other' category if needed
      const categoryData: CategoryData[] = [
        ...topCategories,
        ...(otherTotal > 0 ? [{
          name: 'Khác',
          value: otherTotal
        }] : [])
      ];

      // Get traffic data for last 30 days (sample data - replace with real API if available)
      const trafficData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        users: Math.floor(Math.random() * 1000) + 100
      }));

      // Calculate statistics
      const totalOrders = ordersData.length;
      const totalProducts = productsData.length;
      const totalUsers = usersData.length;
      const totalBrands = brandsData.length;
      const totalCategories = categoriesData.length;
      const totalCoupons = couponsData.length;

      // Calculate percentage changes compared to previous month
      const currentMonth = new Date().getMonth();
      const lastMonthOrders = ordersData.filter((order: Order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === currentMonth - 1;
      }).length;

      const lastMonthProducts = productsData.filter((product: Product) => {
        const productDate = new Date(product.createdAt);
        return productDate.getMonth() === currentMonth - 1;
      }).length;

      const lastMonthUsers = usersData.filter((user: any) => {
        const userDate = new Date(user.createdAt);
        return userDate.getMonth() === currentMonth - 1;
      }).length;

      // Calculate revenue for last month
      const lastMonthRevenue = ordersData
        .filter((order: Order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getMonth() === currentMonth - 1;
        })
        .reduce((acc: number, order: Order) => acc + (order.totalAmount || 0), 0);

      // Calculate total revenue
      const totalRevenue = ordersData.reduce(
        (acc: number, order: any) => acc + (order.totalAmount || 0),
        0
      );

      // Recent orders (last 5)
      const recentOrders = responses[0].data.data.orders
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((order: any) => ({
          ...order,
          key: order._id,
          createdAt: new Date(order.createdAt).toLocaleString(),
          totalAmount: order.totalAmount?.toLocaleString() || '0'
        }));

      // Top products (by sales)
      const productSales: Record<string, number> = {};
      responses[0].data.data.orders.forEach((order: any) => {
        order.products?.forEach((item: any) => {
          const productId = item.product?._id;
          if (productId) {
            productSales[productId] = (productSales[productId] || 0) + (item.quantity || 0);
          }
        });
      });

      const topProducts = Object.entries(productSales)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 5)
        .map(([productId, sales]) => {
          const product = responses[1].data.data.products.find((p: any) => p._id === productId);
          return {
            ...product,
            sales: sales || 0,
            key: productId,
            salePrice: product?.salePrice?.toLocaleString() || '0'
          };
        });

      // Payment methods
      const paymentMethods = [
        {
          method: 'credit_card',
          count: paymentsData.filter((p: any) => p.method === 'credit_card').length,
          amount: paymentsData
            .filter((p: any) => p.method === 'credit_card')
            .reduce((acc: number, p: any) => acc + (p.amount || 0), 0)
        },
        {
          method: 'paypal',
          count: paymentsData.filter((p: any) => p.method === 'paypal').length,
          amount: paymentsData
            .filter((p: any) => p.method === 'paypal')
            .reduce((acc: number, p: any) => acc + (p.amount || 0), 0)
        },
        {
          method: 'cod',
          count: paymentsData.filter((p: any) => p.method === 'cod').length,
          amount: paymentsData
            .filter((p: any) => p.method === 'cod')
            .reduce((acc: number, p: any) => acc + (p.amount || 0), 0)
        }
      ];

      // Calculate percentage changes
      const orderChange = lastMonthOrders > 0 
        ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100 
        : 0;
      
      const productChange = lastMonthProducts > 0 
        ? ((totalProducts - lastMonthProducts) / lastMonthProducts) * 100 
        : 0;
      
      const userChange = lastMonthUsers > 0 
        ? ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100 
        : 0;
      
      const revenueChange = lastMonthRevenue > 0 
        ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;

      setStats({
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
        totalBrands,
        totalCategories,
        totalCoupons,
        recentOrders,
        topProducts,
        paymentMethods,
        orderChange,
        productChange,
        userChange,
        revenueChange,
        salesData,
        revenueData,
        categoryData,
        trafficData
      });

      // Only show success message if data actually changed
      const hasDataChanged = JSON.stringify(stats) !== JSON.stringify({
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
        totalBrands,
        totalCategories,
        totalCoupons,
        recentOrders,
        topProducts,
        paymentMethods
      });

      if (hasDataChanged) {
        message.success('Đã cập nhật thống kê thành công');
      }

    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      message.error(error.response?.data?.message || 'Có lỗi khi lấy dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => <Link to={`/orders/${text}`}>{text}</Link>,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => user.fullName,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `${amount.toLocaleString()} VND`,
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => (
        <Badge 
          status={statusColors[status] as any} 
          text={status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'} 
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status]}>
          {status === 'pending' && 'Chờ xử lý'}
          {status === 'processing' && 'Đang xử lý'}
          {status === 'shipped' && 'Đang giao'}
          {status === 'delivered' && 'Đã giao'}
          {status === 'cancelled' && 'Đã hủy'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
      <Layout>
        <Content className="p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Title level={3} className="mb-1">Bảng điều khiển</Title>
              <Text type="secondary">Tổng quan về hiệu suất kinh doanh</Text>
            </div>
            <div className="flex space-x-2">
              <Button type="text" icon={<DownloadOutlined />}>Báo cáo</Button>
              <Button type="primary">Tạo báo cáo mới</Button>
            </div>
          </div>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="h-full border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <Text type="secondary" className="text-sm">Tổng đơn hàng</Text>
                    <Title level={3} className="my-1">{stats.totalOrders}</Title>
                    <div className="flex items-center">
                      {stats.orderChange >= 0 ? (
                        <RiseOutlined className="text-green-500 mr-1" />
                      ) : (
                        <FallOutlined className="text-red-500 mr-1" />
                      )}
                      <Text type={stats.orderChange >= 0 ? 'success' : 'danger'}>
                        {stats.orderChange >= 0 ? '+' : ''}{stats.orderChange.toFixed(1)}% so với tháng trước
                      </Text>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <ShoppingCartOutlined className="text-blue-600 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <Text type="secondary" className="text-sm">Tổng sản phẩm</Text>
                    <Title level={3} className="my-1">{stats.totalProducts}</Title>
                    <div className="flex items-center">
                      {stats.productChange >= 0 ? (
                        <RiseOutlined className="text-green-500 mr-1" />
                      ) : (
                        <FallOutlined className="text-red-500 mr-1" />
                      )}
                      <Text type={stats.productChange >= 0 ? 'success' : 'danger'}>
                        {stats.productChange >= 0 ? '+' : ''}{stats.productChange.toFixed(1)}% so với tháng trước
                      </Text>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <ProductOutlined className="text-green-600 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <Text type="secondary" className="text-sm">Tổng người dùng</Text>
                    <Title level={3} className="my-1">{stats.totalUsers}</Title>
                    <div className="flex items-center">
                      {stats.userChange >= 0 ? (
                        <RiseOutlined className="text-green-500 mr-1" />
                      ) : (
                        <FallOutlined className="text-red-500 mr-1" />
                      )}
                      <Text type={stats.userChange >= 0 ? 'success' : 'danger'}>
                        {stats.userChange >= 0 ? '+' : ''}{stats.userChange.toFixed(1)}% so với tháng trước
                      </Text>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                    <TeamOutlined className="text-orange-600 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <Text type="secondary" className="text-sm">Doanh thu</Text>
                    <Title level={3} className="my-1">{stats.totalRevenue.toLocaleString()} VND</Title>
                    <div className="flex items-center">
                      {stats.revenueChange >= 0 ? (
                        <RiseOutlined className="text-green-500 mr-1" />
                      ) : (
                        <FallOutlined className="text-red-500 mr-1" />
                      )}
                      <Text type={stats.revenueChange >= 0 ? 'success' : 'danger'}>
                        {stats.revenueChange >= 0 ? '+' : ''}{stats.revenueChange.toFixed(1)}% so với tháng trước
                      </Text>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <DollarOutlined className="text-purple-600 text-xl" />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24} lg={16}>
              <Card 
                title="Biểu đồ doanh số bán hàng" 
                className="shadow-sm"
                extra={
                  <div className="flex items-center space-x-2">
                    <Segmented
                      options={['Ngày', 'Tuần', 'Tháng']}
                      value={timeRange === 'day' ? 'Ngày' : timeRange === 'week' ? 'Tuần' : 'Tháng'}
                      onChange={(value) => {
                        const newRange = value === 'Ngày' ? 'day' : value === 'Tuần' ? 'week' : 'month';
                        setTimeRange(newRange);
                        fetchDashboardStats();
                      }}
                      className="ml-4"
                    />
                    <Button type="text" icon={<DownloadOutlined />} />
                  </div>
                }
              >
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={stats.salesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#1890ff" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <RechartsTooltip />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#1890ff" 
                        fillOpacity={1} 
                        fill="url(#colorSales)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card 
                title="Phân bổ danh mục" 
                className="shadow-sm h-full"
                extra={
                  <Button type="text" icon={<DownloadOutlined />} />
                }
              >
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        {stats.categoryData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} className="mt-6">
            <Col xs={24} lg={16}>
              <Card 
                title="Lịch sử giao dịch gần đây"
                className="shadow-sm"
                extra={<Link to="/orders">Xem tất cả</Link>}
              >
                <Table 
                  columns={columns} 
                  dataSource={stats.recentOrders} 
                  pagination={false}
                  size="middle"
                  scroll={{ x: true }}
                />
              </Card>
              {/* Phương thức thanh toán & Thống kê hệ thống */}
              <Row gutter={[24, 24]} className="mt-6">
                <Col xs={24} lg={12}>
                  <Card 
                    title="Phương thức thanh toán" 
                    loading={loading}
                    className="shadow-sm h-full"
                    extra={<Link to="/payments">Xem chi tiết</Link>}
                  >
                    <List
                      itemLayout="horizontal"
                      dataSource={stats.paymentMethods}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar 
                                className={item.method === 'credit_card' ? 'bg-blue-100 text-blue-600' : 
                                        item.method === 'paypal' ? 'bg-green-100 text-green-600' : 
                                        'bg-orange-100 text-orange-600'}
                                icon={item.method === 'credit_card' ? <CreditCardOutlined /> : 
                                      item.method === 'paypal' ? <AlipayCircleOutlined /> : 
                                      <BankOutlined />}
                              />
                            }
                            title={
                              <div className="flex justify-between items-center w-full">
                                <span>{item.method === 'credit_card' ? 'Thẻ tín dụng' : 
                                      item.method === 'paypal' ? 'Chuyển khoản' : 
                                      'COD'}</span>
                                <span className="font-medium">{item.count} đơn</span>
                              </div>
                            }
                            description={
                              <div className="flex justify-between items-center">
                                <Text type="secondary">Tổng: {item.amount.toLocaleString()} VND</Text>
                                <Progress 
                                  percent={Math.min(100, (item.amount / (stats.totalRevenue || 1)) * 100)} 
                                  size="small" 
                                  showInfo={false}
                                  strokeWidth={4}
                                  strokeColor={
                                    item.method === 'credit_card' ? '#1890ff' : 
                                    item.method === 'paypal' ? '#52c41a' : '#faad14'
                                  }
                                  style={{ width: 100 }}
                                />
                              </div>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
                <Col xs={24} lg={12}>
                  <Card 
                    title="Thống kê hệ thống" 
                    loading={loading}
                    className="shadow-sm"
                  >
                    <Space direction="vertical" className="w-full">
                      <div>
                        <Text strong>Thương hiệu</Text>
                        <Progress 
                          percent={Math.min(100, (stats.totalBrands / 50) * 100)} 
                          status={stats.totalBrands >= 45 ? 'exception' : 'active'}
                          format={() => `${stats.totalBrands}/50`}
                        />
                      </div>
                      <div>
                        <Text strong>Danh mục</Text>
                        <Progress 
                          percent={Math.min(100, (stats.totalCategories / 30) * 100)} 
                          status={stats.totalCategories >= 25 ? 'exception' : 'active'}
                          format={() => `${stats.totalCategories}/30`}
                        />
                      </div>
                      <div>
                        <Text strong>Mã giảm giá</Text>
                        <Progress 
                          percent={Math.min(100, (stats.totalCoupons / 20) * 100)} 
                          status={stats.totalCoupons >= 15 ? 'exception' : 'active'}
                          format={() => `${stats.totalCoupons}/20`}
                        />
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Col>
            <Col xs={24} lg={8}>
              <Row gutter={[0, 24]}>
                <Col span={24}>
                  <Card 
                    title="Lưu lượng truy cập" 
                    className="shadow-sm"
                    extra={<Text strong>+12%</Text>}
                  >
                    <div style={{ height: 100 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={stats.trafficData}>
                          <defs>
                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="users" 
                            stroke="#8884d8" 
                            fillOpacity={1} 
                            fill="url(#colorTraffic)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div>
                        <Text type="secondary">Tổng lượt xem</Text>
                        <div className="text-lg font-semibold">12,456</div>
                      </div>
                      <div>
                        <Text type="secondary">Tỷ lệ thoát</Text>
                        <div className="text-lg font-semibold">23%</div>
                      </div>
                      <div>
                        <Text type="secondary">Thời gian TB</Text>
                        <div className="text-lg font-semibold">2m 30s</div>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card 
                    title="Sản phẩm bán chạy" 
                    className="shadow-sm"
                    extra={<Link to="/products">Xem tất cả</Link>}
                  >
                    <List
                      itemLayout="horizontal"
                      dataSource={stats.topProducts}
                      renderItem={(item: any) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar 
                                src={item.images?.[0]} 
                                icon={<ProductOutlined />}
                                shape="square"
                              />
                            }
                            title={<Link to={`/products/${item._id}`}>{item.product_name}</Link>}
                            description={`${item.sales} đã bán`}
                          />
                          <div className="font-medium">{item.salePrice} VND</div>
                        </List.Item>
                      )}
                    />
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
          


        </Content>
        <Footer className="text-center py-4 bg-white shadow-sm">
          <Text type="secondary">
          
          </Text>
        </Footer>
      </Layout>
  );
};

export default DashboardPage;