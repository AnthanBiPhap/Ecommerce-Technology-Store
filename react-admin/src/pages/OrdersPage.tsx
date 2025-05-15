"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, Button, Space, Modal, Form, Input, message, Select, InputNumber, Typography, Tag, Divider } from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined, 
  ShoppingCartOutlined,
} from "@ant-design/icons"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title, Text } = Typography
const { Search } = Input
const { TextArea } = Input
const { Option } = Select

interface Product {
  productId: string
  name: string
  quantity: number
  price: number
  salePrice?: number
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
  }>
  totalAmount: number
  shippingFee: number
  tax: number
  discount: number
  paymentMethod: "credit_card" | "paypal" | "cod"
  paymentStatus: "pending" | "paid" | "failed"
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    street: string
    ward: string
    district: string
    city: string
    postalCode: string
  }
  shippingInfor: {
    recipientName: string
    phone: string
    gender: "male" | "female"
  }
  user: {
    _id: string
    userName: string
    fullName: string
    email: string
    phone: string
  }
  createdAt: string
  updatedAt: string
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

interface ProductApi {
  _id: string
  product_name: string
  name?: string
  price: number
  salePrice?: number
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [orders, setOrders] = useState<Order[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [allProducts, setAllProducts] = useState<ProductApi[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const isAdmin = user?.roles === "admin"

  useEffect(() => {
    fetchOrders()
  }, [tokens?.accessToken, pagination.page, pagination.limit])

  const fetchOrders = async (search = "") => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      try {
      const response = await axios.get("http://localhost:8889/api/v1/orders", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          ...(search ? { orderNumber: search } : {}),
        },
      })
        console.log('API response:', response.data)
      setOrders(response.data.data.orders)
      setPagination(response.data.data.pagination)
    } catch (error: any) {
        console.error('Error fetching orders:', error.response?.data || error.message)
        message.error("Lỗi khi lấy danh sách đơn hàng")
      } finally {
        setLoading(false)
      }
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách đơn hàng")
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
    } else {
      message.error(defaultMessage)
    }
  }

  const handleEditOrder = (order: Order) => {
    console.log('Attempting to edit order:', {
      orderId: order._id,
      isAdmin: isAdmin,
      hasProducts: order.products && order.products.length > 0,
      hasShippingAddress: order.shippingAddress && order.shippingAddress.street
    })
    
    if (!isAdmin) {
      message.error('Bạn cần quyền admin để sửa đơn hàng')
      return
    }

    setSelectedOrder(order)
    // Set form values from API response
    form.setFieldsValue({
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus as "pending" | "paid" | "failed",
      status: order.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled",
      "user.fullName": order.user.fullName || '',
      "user.email": order.user.email || '',
      "user.phone": order.user.phone || '',
      "shippingAddress.street": order.shippingAddress.street || '',
      "shippingAddress.ward": order.shippingAddress.ward || '',
      "shippingAddress.district": order.shippingAddress.district || '',
      "shippingAddress.city": order.shippingAddress.city || '',
      "shippingAddress.postalCode": order.shippingAddress.postalCode || '',
      "shippingInfor.recipientName": order.shippingInfor?.recipientName || '',
      "shippingInfor.phone": order.shippingInfor?.phone || '',
      "shippingInfor.gender": order.shippingInfor?.gender || 'male'
    })
    setIsModalOpen(true)
  }

  const fetchProducts = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }
      
      const response = await axios.get("http://localhost:8889/api/v1/products", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: { limit: 1000 },
      })
      console.log('Products response:', response.data)
      setAllProducts(response.data.data.products || [])
    } catch (error: any) {
      message.error(error.response?.data?.message || "Lỗi khi lấy danh sách sản phẩm")
    }
  }

  const handleDeleteOrder = (orderId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa đơn hàng này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          if (!tokens?.accessToken) {
            message.error("Vui lòng đăng nhập để tiếp tục")
            navigate("/login")
            return
          }

          setLoading(true)
          await axios.delete(`http://localhost:8889/api/v1/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa đơn hàng thành công")
          fetchOrders(searchTerm)
        } catch (error: any) {
          handleError(error, "Lỗi khi xóa đơn hàng")
        } finally {
          setLoading(false)
        }
      },
    })
  }

  const handleModalOk = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setSaving(true)
      const values = await form.validateFields()

      const payload = {
        paymentMethod: values.paymentMethod,
        paymentStatus: values.paymentStatus as "pending" | "paid" | "failed",
        status: values.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled"
      }

      if (selectedOrder) {
        await axios.put(`http://localhost:8889/api/v1/orders/${selectedOrder._id}`, payload, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Cập nhật đơn hàng thành công")
      }

      setIsModalOpen(false)
      fetchOrders(searchTerm)
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý đơn hàng")
    } finally {
      setSaving(false)
    }
  }

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      page: newPagination.current,
      limit: newPagination.pageSize,
    })
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPagination({ ...pagination, page: 1 })
    fetchOrders(value)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const calculateTotalAmount = () => {
    const subtotal = selectedProducts.reduce((acc, p) => acc + p.price * p.quantity, 0)
    const total = subtotal + (form.getFieldValue("shippingFee") || 0) + (form.getFieldValue("tax") || 0) - (form.getFieldValue("discount") || 0)
    return total
  }

  const getPaymentMethodInfo = (method: string) => {
    const methodMap: { [key: string]: { color: string; label: string; icon: React.ReactNode } } = {
      credit_card: { color: "blue", label: "Thẻ Tín Dụng", icon: <CreditCardIcon /> },
      paypal: { color: "cyan", label: "PayPal", icon: <PaypalIcon /> },
      cod: { color: "green", label: "COD", icon: <CashIcon /> },
    }
    return methodMap[method] || { color: "default", label: method, icon: null }
  }

  const getPaymentStatusInfo = (status: string) => {
    const statusMap: { [key: string]: { color: string; label: string; icon: React.ReactNode } } = {
      pending: { color: "warning", label: "Chờ Thanh Toán", icon: <ClockCircleOutlined /> },
      paid: { color: "success", label: "Đã Thanh Toán", icon: <CheckOutlined /> },
      failed: { color: "error", label: "Thất Bại", icon: <CloseOutlined /> },
    }
    return statusMap[status] || { color: "default", label: status, icon: null }
  }

  const getOrderStatusInfo = (status: string) => {
    const statusMap: { [key: string]: { color: string; label: string; icon: React.ReactNode } } = {
      pending: { color: "warning", label: "Chờ Xử Lý", icon: <ClockCircleOutlined /> },
      processing: { color: "processing", label: "Đang Xử Lý", icon: <LoadingIcon /> },
      shipped: { color: "cyan", label: "Đang Giao", icon: <TruckIcon /> },
      delivered: { color: "success", label: "Đã Giao", icon: <CheckOutlined /> },
      cancelled: { color: "error", label: "Đã Hủy", icon: <CloseOutlined /> },
    }
    return statusMap[status] || { color: "default", label: status, icon: null }
  }

  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "orderNumber",
      key: "orderNumber",
      width: 150,
      render: (orderNumber: string) => <span className="font-medium">{orderNumber}</span>,
    },
    {
      title: "Sản phẩm",
      dataIndex: "products",
      key: "products",
      render: (products: any[]) => (
        <div className="flex flex-col gap-1">
          {products?.map((product, index) => {
            const productName = product?.product?.product_name || 'Không xác định'
            const price = product?.currentSalePrice || product?.currentPrice || 0
            return (
              <div key={index} className="flex items-center justify-between p-2 border-b last:border-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{productName}</span>
                  <span className="text-sm text-gray-600">x{product.quantity}</span>
                </div>
                <div className="text-sm">
                  <div className="text-gray-600">
                    {product.currentSalePrice ? (
                      <>
                        <span className="line-through mr-2">{formatCurrency(product.currentPrice)}</span>
                        <span className="text-red-500">{formatCurrency(product.currentSalePrice)}</span>
                      </>
                    ) : (
                      <span>{formatCurrency(product.currentPrice)}</span>
                    )}
                  </div>
                  <span className="text-blue-600 font-medium">Tổng: {formatCurrency((product.currentSalePrice || product.currentPrice) * product.quantity)}</span>
                </div>
              </div>
            )
          })}
        </div>
      ),
    },
    {
      title: "Tổng Tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (totalAmount: number) => <span className="font-medium text-blue-600">{formatCurrency(totalAmount)}</span>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => {
        const statusColors = {
          pending: 'yellow',
          processing: 'blue',
          shipped: 'orange',
          delivered: 'green',
          cancelled: 'red',
        }
        const statusLabels = {
          pending: 'Chờ xử lý',
          processing: 'Đang xử lý',
          shipped: 'Đang giao',
          delivered: 'Đã giao',
          cancelled: 'Đã hủy',
        }
        return (
          <Tag color={statusColors[status as keyof typeof statusColors]}>
            {statusLabels[status as keyof typeof statusLabels]}
          </Tag>
        )
      },
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      width: 180,
      render: (paymentMethod: string) => {
        const methodInfo = getPaymentMethodInfo(paymentMethod)
        return (
          <Tag color={methodInfo.color} className="flex items-center gap-1 px-2 py-1">
            {methodInfo.icon}
            <span>{methodInfo.label}</span>
          </Tag>
        )
      },
    },
    {
      title: "Trạng Thái Thanh Toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      width: 180,
      render: (paymentStatus: string) => {
        const statusInfo = getPaymentStatusInfo(paymentStatus)
        return (
          <Tag color={statusInfo.color} className="flex items-center gap-1 px-2 py-1">
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </Tag>
        )
      },
    },
    // {
    //   title: "Trạng Thái Đơn Hàng",
    //   dataIndex: "orderStatus",
    //   key: "orderStatus",
    //   width: 180,
    //   render: (orderStatus: string) => {
    //     const statusInfo = getOrderStatusInfo(orderStatus)
    //     return (
    //       <Tag color={statusInfo.color} className="flex items-center gap-1 px-2 py-1">
    //         {statusInfo.icon}
    //         <span>{statusInfo.label}</span>
    //       </Tag>
    //     )
    //   },
    // },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_: any, record: Order) =>
        isAdmin ? (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditOrder(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              Sửa
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteOrder(record._id)}
              className="text-red-500 hover:text-red-700"
            >
              Xóa
            </Button>
          </Space>
        ) : null,
    },
  ]

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <Title level={3} className="m-0 flex items-center">
          <ShoppingCartOutlined className="mr-2" /> Quản Lý Đơn Hàng
        </Title>
        <Space>
          <span className={`font-medium ${user?.roles === "admin" ? "text-blue-500" : "text-red-500"}`}>
            Current Role: {user?.roles ? user.roles.charAt(0).toUpperCase() + user.roles.slice(1) : "Unknown"}
          </span>
        </Space>
      </div>

      <div className="mb-6">
        <Space>
          <Search
            placeholder="Tìm kiếm theo mã đơn hàng"
            allowClear
            enterButton={
              <Button type="primary" icon={<SearchOutlined />}>
                Tìm kiếm
              </Button>
            }
            size="middle"
            onSearch={handleSearch}
            className="w-80 rounded-md"
          />
        </Space>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={orders}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalRecord,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} orders</span>,
            className: "ant-table-pagination",
          }}
          onChange={handleTableChange}
          rowKey="_id"
          bordered
          className="bg-white rounded-md shadow-sm"
          rowClassName="hover:bg-gray-50 transition-colors"
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-lg mb-3">Thông tin đơn hàng</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Phí vận chuyển:</span>
                        <span className="font-medium">{formatCurrency(record.shippingFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Thuế:</span>
                        <span className="font-medium">{formatCurrency(record.tax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Giảm giá:</span>
                        <span className="font-medium">{formatCurrency(record.discount)}</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Tổng cộng:</span>
                        <span className="text-blue-600">{formatCurrency(record.totalAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-lg mb-3">Thông tin người nhận</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Họ và tên:</span>
                        <span className="font-medium">{record.user.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Email:</span>
                        <span className="font-medium">{record.user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Số điện thoại:</span>
                        <span className="font-medium">{record.user.phone}</span>
                      </div>
                    </div>

                    <h4 className="font-medium text-lg mt-6 mb-3">Địa chỉ giao hàng</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Đường:</span>
                        <span className="font-medium">{record.shippingAddress.street}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Phường/Xã:</span>
                        <span className="font-medium">{record.shippingAddress.ward}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Quận/Huyện:</span>
                        <span className="font-medium">{record.shippingAddress.district}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Thành phố:</span>
                        <span className="font-medium">{record.shippingAddress.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Mã bưu chính:</span>
                        <span className="font-medium">{record.shippingAddress.postalCode}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ),
            rowExpandable: (record) => true,
          }}
        />
      </div>

      <Modal
        title={"Chỉnh sửa đơn hàng"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ loading: saving, className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ disabled: saving, className: "rounded-md" }}
        width={800}
        className="p-4"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="orderNumber"
            label="Mã Đơn Hàng"
          >
            <Input 
              className="rounded-md"
              disabled
              placeholder={selectedOrder ? selectedOrder.orderNumber : ""}
            />
          </Form.Item>

          <div className="border rounded-md p-4 bg-gray-50 mb-4">
            <div className="font-medium text-lg mb-3">Thông tin đơn hàng</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="font-medium">Tổng tiền:</div>
                <div className="text-lg font-bold text-blue-600">
                  {selectedOrder ? formatCurrency(selectedOrder.totalAmount) : ''}
                </div>
              </div>
              <div>
                <div className="font-medium">Ngày tạo:</div>
                <div>{selectedOrder ? formatDate(selectedOrder.createdAt) : ''}</div>
              </div>
            </div>
            
            <Divider orientation="left" className="mt-2">Sản phẩm</Divider>
            <div className="space-y-3 mt-4">
              {selectedOrder?.products?.map((item, index) => (
                <div key={index} className="border-b pb-3 last:border-b-0">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-white border rounded-md overflow-hidden">
                      {item.product?.images?.[0] ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <ShoppingCartOutlined className="text-gray-400 text-xl" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.product?.product_name || 'Sản phẩm không xác định'}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Số lượng: {item.quantity}</span>
                        <span>•</span>
                        <span>
                          {item.currentSalePrice ? (
                            <>
                              <span className="line-through mr-1">{formatCurrency(item.currentPrice)}</span>
                              <span className="text-red-500">{formatCurrency(item.currentSalePrice)}</span>
                            </>
                          ) : (
                            <span>{formatCurrency(item.currentPrice)}</span>
                          )}
                        </span>
                      </div>
                      <div className="font-medium text-blue-600">
                        Thành tiền: {formatCurrency((item.currentSalePrice || item.currentPrice) * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="paymentStatus"
              label="Trạng Thái Thanh Toán"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái thanh toán" }]}
            >
              <Select className="rounded-md">
                <Option value="pending">Chờ Thanh Toán</Option>
                <Option value="paid">Đã Thanh Toán</Option>
                <Option value="failed">Thất Bại</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng Thái Đơn Hàng"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái đơn hàng" }]}
            >
              <Select className="rounded-md">
                <Option value="pending">Chờ Xử Lý</Option>
                <Option value="processing">Đang Xử Lý</Option>
                <Option value="shipped">Đang Giao</Option>
                <Option value="delivered">Đã Giao</Option>
                <Option value="cancelled">Đã Hủy</Option>
              </Select>
            </Form.Item>
          </div>

          <Divider orientation="left">Thông tin người nhận</Divider>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium">Họ và tên:</div>
                <div>{selectedOrder?.user?.fullName || ''}</div>
              </div>
              <div>
                <div className="font-medium">Email:</div>
                <div>{selectedOrder?.user?.email || ''}</div>
              </div>
              <div>
                <div className="font-medium">Số điện thoại:</div>
                <div>{selectedOrder?.user?.phone || ''}</div>
              </div>
            </div>

            <Divider orientation="left" className="mt-4">Địa chỉ giao hàng</Divider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium">Địa chỉ:</div>
                <div>{selectedOrder?.shippingAddress?.street || ''}</div>
              </div>
              <div>
                <div className="font-medium">Phường/Xã:</div>
                <div>{selectedOrder?.shippingAddress?.ward || ''}</div>
              </div>
              <div>
                <div className="font-medium">Quận/Huyện:</div>
                <div>{selectedOrder?.shippingAddress?.district || ''}</div>
              </div>
              <div>
                <div className="font-medium">Thành phố:</div>
                <div>{selectedOrder?.shippingAddress?.city || ''}</div>
              </div>
              <div>
                <div className="font-medium">Mã bưu chính:</div>
                <div>{selectedOrder?.shippingAddress?.postalCode || ''}</div>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

// Custom icons for payment methods and order status
const CreditCardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
)

const PaypalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 11l5-5 5 5"></path>
    <path d="M12 6v12"></path>
  </svg>
)

const CashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M6 12h.01M18 12h.01"></path>
  </svg>
)

const LoadingIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="2" x2="12" y2="6"></line>
    <line x1="12" y1="18" x2="12" y2="22"></line>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
    <line x1="2" y1="12" x2="6" y2="12"></line>
    <line x1="18" y1="12" x2="22" y2="12"></line>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
  </svg>
)

const TruckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
)

export default OrdersPage