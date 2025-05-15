"use client"

import type React from "react"

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
  DatePicker,
  InputNumber,
  Typography,
} from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/useAuthStore"
import type { ColumnType } from "antd/es/table"
import type { Key } from "antd/es/table/interface"
import dayjs from "dayjs"

const { Title } = Typography
const { Option } = Select

interface Shipping {
  _id: string
  carrier: string
  trackingNumber?: string
  status: "processing" | "shipped" | "delivered" | "failed"
  estimatedDelivery?: string
  actualDelivery?: string
  shippingMethod: string
  shippingFee: number
  order: string | null
  createdAt: string
  updatedAt: string
}

interface ShippingFormValues {
  carrier: string
  trackingNumber?: string
  status: "processing" | "shipped" | "delivered" | "failed"
  estimatedDelivery?: any
  actualDelivery?: any
  shippingMethod: string
  shippingFee: number
  order: string | null
}

interface Order {
  _id: string
  orderNumber: string
  products: Array<{
    product: {
      _id: string
      product_name: string
      price: number
      salePrice: number
      images: string[]
    }
    quantity: number
    currentPrice: number
    currentSalePrice: number
    totalAmount: number
    _id: string
  }>
  totalAmount: number
  shippingFee: number
  tax: number
  discount: number
  paymentMethod: string
  paymentStatus: string
  shippingAddress: {
    street: string
    ward: string
    district: string
    city: string
    _id: string
  }
  shippingInfor: {
    recipientName: string
    phone: string
    gender: string
    _id: string
  }
  status: string
  user: {
    _id: string
    userName: string
    fullName: string
    email: string
  } | null
  createdAt: string
  updatedAt: string
}

const ShippingPage: React.FC = () => {
  const navigate = useNavigate()
  const { tokens } = useAuthStore()
  const [shippings, setShippings] = useState<Shipping[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState<Shipping | null>(null)
  const [form] = Form.useForm()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchShippings()
    fetchOrders()
  }, [pagination.current, pagination.pageSize])

  const fetchShippings = async (search = "") => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/shippings", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          ...(search ? { carrier: search } : {}),
        },
      })

      if (response.data.statusCode === 200) {
        setShippings(response.data.data.shippings || [])
        setPagination({
          ...pagination,
          total: response.data.data.pagination?.totalRecord || 0,
        })
      } else {
        message.error(response.data.message || "Lỗi khi lấy danh sách vận chuyển")
      }
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách vận chuyển")
    } finally {
      setLoading(false)
    }
  }

  const handleError = (error: any, defaultMessage: string) => {
    if (error.response?.status === 401) {
      message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại")
      navigate("/login")
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message)
    } else if (error.message) {
      message.error(error.message)
    } else {
      message.error(defaultMessage)
    }
  }

  const fetchOrders = async () => {
    try {
      if (!tokens?.accessToken) return

      const response = await axios.get("http://localhost:8889/api/v1/orders", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })

      if (response.data.statusCode === 200) {
        setOrders(response.data.data.orders || [])
      } else {
        message.error(response.data.message || "Lỗi khi lấy danh sách đơn hàng")
      }
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách đơn hàng")
    }
  }

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 })
    fetchShippings(searchTerm)
  }

  const handleAddShipping = () => {
    setSelectedShipping(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEditShipping = (shipping: Shipping) => {
    setSelectedShipping(shipping)

    form.setFieldsValue({
      carrier: shipping.carrier,
      trackingNumber: shipping.trackingNumber,
      status: shipping.status,
      estimatedDelivery: shipping.estimatedDelivery ? dayjs(shipping.estimatedDelivery) : undefined,
      actualDelivery: shipping.actualDelivery ? dayjs(shipping.actualDelivery) : undefined,
      shippingMethod: shipping.shippingMethod,
      shippingFee: shipping.shippingFee,
      order: shipping.order,
    })

    setIsModalOpen(true)
  }

  const handleDeleteShipping = async (shippingId: string) => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      await Modal.confirm({
        title: "Xác nhận xóa",
        content: "Bạn có chắc chắn muốn xóa vận chuyển này?",
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
      })

      setLoading(true)
      const response = await axios.delete(`http://localhost:8889/api/v1/shippings/${shippingId}`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })

      if (response.data.statusCode === 200) {
        message.success("Xóa vận chuyển thành công")
        fetchShippings(searchTerm)
      } else {
        message.error(response.data.message || "Lỗi khi xóa vận chuyển")
      }
    } catch (error: any) {
      handleError(error, "Lỗi khi xóa vận chuyển")
    } finally {
      setLoading(false)
    }
  }

  const handleModalOk = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      const values = await form.validateFields()
      setLoading(true)

      // Format dates for API
      const formattedValues = {
        ...values,
        estimatedDelivery: values.estimatedDelivery ? values.estimatedDelivery.toISOString() : undefined,
        actualDelivery: values.actualDelivery ? values.actualDelivery.toISOString() : undefined,
      }

      let response
      if (selectedShipping) {
        // Update existing shipping
        response = await axios.put(`http://localhost:8889/api/v1/shippings/${selectedShipping._id}`, formattedValues, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        if (response.data.statusCode === 200) {
          message.success("Cập nhật vận chuyển thành công")
        } else {
          message.error(response.data.message || "Lỗi khi cập nhật vận chuyển")
        }
      } else {
        // Create new shipping
        response = await axios.post("http://localhost:8889/api/v1/shippings", formattedValues, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        if (response.data.statusCode === 200) {
          message.success("Tạo mới vận chuyển thành công")
        } else {
          message.error(response.data.message || "Lỗi khi tạo mới vận chuyển")
        }
      }

      setIsModalOpen(false)
      fetchShippings(searchTerm)
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý vận chuyển")
    } finally {
      setLoading(false)
    }
  }

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current || pagination.current,
      pageSize: newPagination.pageSize || pagination.pageSize,
    })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  // Render function for order info to handle both string ID and order object
  const renderOrderInfo = (orderData: any) => {
    try {
      console.log('Rendering order info for:', orderData);
      console.log('Available orders:', orders);
      
      // Handle case when orderData is null/undefined
      if (!orderData) {
        return <Tag color="red">No Order</Tag>;
      }

      // If orderData is an object with _id, use it directly
      let order = orderData;
      let orderId = orderData._id;
      
      // If orderData is just an ID string, find the order in the orders array
      if (typeof orderData === 'string') {
        order = orders.find((o) => o && o._id === orderData);
        orderId = orderData;
      }
      
      console.log('Using order:', order);
      
      if (!order) {
        return <Tag color="orange">Order not found: {typeof orderId === 'string' ? orderId.substring(0, 8) + '...' : 'Invalid order data'}</Tag>;
      }

      // Safely extract order information
      const orderNumber = order.orderNumber || "N/A";
      const recipientName = order.shippingInfor?.recipientName || "";
      const userName = order.user?.fullName || "";
      const displayName = recipientName || userName || "Unknown User";
      const status = order.status || "pending";

      return (
        <div>
          <div className="font-semibold mb-1">{orderNumber}</div>
          <div className="text-gray-500">{displayName}</div>
          <div className="text-gray-500">
            {status === "completed" ? (
              <Tag color="green">Completed</Tag>
            ) : (
              <Tag color="blue">{status}</Tag>
            )}
          </div>
        </div>
      );
    } catch (error) {
      console.error("Error rendering order info:", error);
      return <Tag color="red">Error loading order</Tag>;
    }
  };

  const columns: Array<ColumnType<Shipping>> = [
    {
      title: "Carrier",
      dataIndex: "carrier",
      key: "carrier",
      sorter: (a: Shipping, b: Shipping) => a.carrier.localeCompare(b.carrier),
    },
    {
      title: "Tracking Number",
      dataIndex: "trackingNumber",
      key: "trackingNumber",
      render: (text: string) => text || "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag
          color={
            status === "processing"
              ? "blue"
              : status === "shipped"
                ? "orange"
                : status === "delivered"
                  ? "green"
                  : "red"
          }
          className="text-center w-20"
        >
          {status}
        </Tag>
      ),
      filters: [
        { text: "Processing", value: "processing" },
        { text: "Shipped", value: "shipped" },
        { text: "Delivered", value: "delivered" },
        { text: "Failed", value: "failed" },
      ],
      onFilter: (value: boolean | Key, record: Shipping) => record.status === value,
    },
    {
      title: "Shipping Method",
      dataIndex: "shippingMethod",
      key: "shippingMethod",
    },
    {
      title: "Shipping Fee",
      dataIndex: "shippingFee",
      key: "shippingFee",
      render: (fee: number) => formatCurrency(fee),
      sorter: (a: Shipping, b: Shipping) => a.shippingFee - b.shippingFee,
    },
    {
      title: "Order Info",
      dataIndex: "order",
      key: "order",
      render: renderOrderInfo,
    },
    {
      title: "Estimated Delivery",
      dataIndex: "estimatedDelivery",
      key: "estimatedDelivery",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Actual Delivery",
      dataIndex: "actualDelivery",
      key: "actualDelivery",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Shipping) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditShipping(record)}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteShipping(record._id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <Title level={3} className="m-0">
          Shipping Management
        </Title>
        <Space>
          <Input
            placeholder="Search by carrier"
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            className="w-80 rounded-md"
            prefix={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            className="rounded-md bg-blue-500 hover:bg-blue-600"
          >
            Search
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddShipping}
            className="rounded-md bg-blue-500 hover:bg-blue-600"
          >
            Add Shipping
          </Button>
        </Space>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={shippings}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} shippings</span>,
            className: "ant-table-pagination",
          }}
          onChange={handleTableChange}
          rowKey="_id"
          bordered
          className="bg-white rounded-md shadow-sm"
          rowClassName="hover:bg-gray-50 transition-colors"
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title={selectedShipping ? "Edit Shipping" : "Add Shipping"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ className: "rounded-md" }}
        width={800}
        className="p-4"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="carrier"
            label="Carrier"
            rules={[
              { required: true, message: "Please enter carrier!" },
              { max: 100, message: "Maximum 100 characters!" },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="trackingNumber"
            label="Tracking Number"
            rules={[{ max: 100, message: "Maximum 100 characters!" }]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status!" }]}>
            <Select className="rounded-md">
              <Option value="processing">Processing</Option>
              <Option value="shipped">Shipped</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="failed">Failed</Option>
            </Select>
          </Form.Item>
          <Form.Item name="estimatedDelivery" label="Estimated Delivery">
            <DatePicker showTime style={{ width: "100%" }} className="rounded-md" />
          </Form.Item>
          <Form.Item name="actualDelivery" label="Actual Delivery">
            <DatePicker showTime style={{ width: "100%" }} className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="shippingMethod"
            label="Shipping Method"
            rules={[
              { required: true, message: "Please enter shipping method!" },
              { max: 50, message: "Maximum 50 characters!" },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="shippingFee"
            label="Shipping Fee"
            rules={[{ required: true, message: "Please enter shipping fee!" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} className="rounded-md" />
          </Form.Item>
          <Form.Item name="order" label="Order">
            <Select showSearch optionFilterProp="children" className="rounded-md" allowClear>
              <Option value={null}>No Order</Option>
              {orders.map((order) => (
                <Option key={order._id} value={order._id}>
                  {`${order.orderNumber} - ${order.shippingInfor?.recipientName || order.user?.fullName || "Unknown User"}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ShippingPage
