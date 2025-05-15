"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, Button, Space, Modal, Form, Input, message, Select, Tag, Typography, InputNumber, Divider } from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  UndoOutlined,
} from "@ant-design/icons"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { Search } = Input
const { TextArea } = Input
const { Option } = Select

interface Payment {
  _id: string
  amount: number
  method: "credit_card" | "paypal" | "cod"
  status: "pending" | "completed" | "failed" | "refunded"
  transactionId: string
  gateway: string
  metadata: any
  order: {
    _id: string
    orderNumber: string
  }
  user: {
    _id: string
    userName: string
  }
  createdAt: string
  updatedAt: string
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [payments, setPayments] = useState<Payment[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [users, setUsers] = useState<{ _id: string; userName: string }[]>([])
  const [orders, setOrders] = useState<{ _id: string; orderNumber: string }[]>([])
  const [customMetadata, setCustomMetadata] = useState("")
  const [metadataMode, setMetadataMode] = useState<"select" | "custom">("select")
  const [searchTerm, setSearchTerm] = useState("")

  const isAdmin = user?.roles === "admin"

  useEffect(() => {
    fetchPayments()
  }, [tokens?.accessToken, pagination.page, pagination.limit])

  const fetchPayments = async (search = "") => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/payments", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          ...(search ? { transactionId: search } : {}),
        },
      })

      setPayments(response.data.data.payments)
      setPagination(response.data.data.pagination)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách thanh toán")
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

  const fetchUsers = async () => {
    try {
      if (!tokens?.accessToken) return
      const res = await axios.get("http://localhost:8889/api/v1/users", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: { page: 1, limit: 100 },
      })
      setUsers(res.data.data.users)
    } catch {}
  }

  const fetchOrders = async () => {
    try {
      if (!tokens?.accessToken) return
      const res = await axios.get("http://localhost:8889/api/v1/orders", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: { page: 1, limit: 100 },
      })
      setOrders(res.data.data.orders)
    } catch {}
  }

  const handleAddPayment = () => {
    setSelectedPayment(null)
    form.resetFields()
    setMetadataMode("select")
    setCustomMetadata("")
    form.setFieldsValue({ metadata: JSON.stringify({}) })
    fetchUsers()
    fetchOrders()
    setIsModalOpen(true)
  }

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment)
    const metaStr = payment.metadata ? JSON.stringify(payment.metadata) : JSON.stringify({})
    const preset = [
      JSON.stringify({}),
      JSON.stringify({ fast: true }),
      JSON.stringify({ refunded: true }),
      JSON.stringify({ note: "Khách VIP" }),
    ]
    if (!preset.includes(metaStr)) {
      setMetadataMode("custom")
      setCustomMetadata(metaStr)
      form.setFieldsValue({ metadata: metaStr })
    } else {
      setMetadataMode("select")
      setCustomMetadata("")
      form.setFieldsValue({ metadata: metaStr })
    }
    form.setFieldsValue({
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      transactionId: payment.transactionId,
      gateway: payment.gateway,
      user: payment.user?._id || "",
      order: payment.order?._id || "",
    })
    fetchUsers()
    fetchOrders()
    setIsModalOpen(true)
  }

  const handleDeletePayment = (paymentId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thanh toán này?",
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
          await axios.delete(`http://localhost:8889/api/v1/payments/${paymentId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa thanh toán thành công")
          fetchPayments(searchTerm)
        } catch (error: any) {
          handleError(error, "Lỗi khi xóa thanh toán")
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
      let metadata = metadataMode === "custom" ? customMetadata : values.metadata
      if (typeof metadata === "string") {
        try {
          metadata = metadata ? JSON.parse(metadata) : {}
        } catch {
          metadata = {}
        }
      }
      const payload = { ...values, metadata, user: values.user, order: values.order }

      if (selectedPayment) {
        await axios.put(`http://localhost:8889/api/v1/payments/${selectedPayment._id}`, payload, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success("Cập nhật thanh toán thành công")
      } else {
        await axios.post("http://localhost:8889/api/v1/payments", payload, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success("Tạo mới thanh toán thành công")
      }

      setIsModalOpen(false)
      fetchPayments(searchTerm)
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý thanh toán")
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
    fetchPayments(value)
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
      pending: { color: "warning", label: "Chờ Xử Lý", icon: <ClockCircleOutlined /> },
      completed: { color: "success", label: "Hoàn Thành", icon: <CheckOutlined /> },
      failed: { color: "error", label: "Thất Bại", icon: <CloseOutlined /> },
      refunded: { color: "orange", label: "Hoàn Trả", icon: <UndoOutlined /> },
    }
    return statusMap[status] || { color: "default", label: status, icon: null }
  }

  const columns = [
    {
      title: "Mã Giao Dịch",
      dataIndex: "transactionId",
      key: "transactionId",
      width: 180,
      render: (id: string) => <span className="font-medium font-mono">{id}</span>,
    },
    {
      title: "Số Tiền",
      dataIndex: "amount",
      key: "amount",
      width: 150,
      render: (amount: number) => <span className="font-medium text-blue-600">{formatCurrency(amount)}</span>,
    },
    {
      title: "Phương Thức",
      dataIndex: "method",
      key: "method",
      width: 150,
      render: (method: string) => {
        const methodInfo = getPaymentMethodInfo(method)
        return (
          <Tag color={methodInfo.color} className="flex items-center gap-1 px-2 py-1">
            {methodInfo.icon}
            <span>{methodInfo.label}</span>
          </Tag>
        )
      },
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status: string) => {
        const statusInfo = getPaymentStatusInfo(status)
        return (
          <Tag color={statusInfo.color} className="flex items-center gap-1 px-2 py-1">
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </Tag>
        )
      },
    },
    {
      title: "Gateway",
      dataIndex: "gateway",
      key: "gateway",
      width: 150,
    },
    {
      title: "Đơn Hàng",
      dataIndex: ["order", "orderNumber"],
      key: "order",
      width: 150,
      render: (orderNumber: string) => <span className="text-blue-600">{orderNumber}</span>,
    },
    {
      title: "Người Dùng",
      dataIndex: ["user", "userName"],
      key: "user",
      width: 150,
    },
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
      render: (_: any, record: Payment) =>
        isAdmin ? (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditPayment(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              Sửa
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeletePayment(record._id)}
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
          <DollarOutlined className="mr-2" /> Quản Lý Thanh Toán
        </Title>
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddPayment}
              className="rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Thêm Mới Thanh Toán
            </Button>
          )}
          <span className={`font-medium ${user?.roles === "admin" ? "text-blue-500" : "text-red-500"}`}>
            Current Role: {user?.roles ? user.roles.charAt(0).toUpperCase() + user.roles.slice(1) : "Unknown"}
          </span>
        </Space>
      </div>

      <div className="mb-6">
        <Space>
          <Search
            placeholder="Tìm kiếm theo mã giao dịch"
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
          dataSource={payments}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalRecord,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} payments</span>,
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Thông tin thanh toán:</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Mã giao dịch:</span>
                        <span className="font-mono">{record.transactionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Số tiền:</span>
                        <span className="text-blue-600">{formatCurrency(record.amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phương thức:</span>
                        <span>{getPaymentMethodInfo(record.method).label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Trạng thái:</span>
                        <span>{getPaymentStatusInfo(record.status).label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gateway:</span>
                        <span>{record.gateway}</span>
                      </div>
                    </div>
                  </div>
                  {/* <div>
                    <h4 className="font-medium mb-2">Thông tin liên quan:</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Đơn hàng:</span>
                        <span className="text-blue-600">{record.order?.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Người dùng:</span>
                        <span>{record.user?.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ngày tạo:</span>
                        <span>{formatDate(record.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cập nhật:</span>
                        <span>{formatDate(record.updatedAt)}</span>
                      </div>
                    </div>
                  </div> */}
                </div>
                {/* {record.metadata && Object.keys(record.metadata).length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Thông tin bổ sung:</h4>
                    <pre className="bg-gray-100 p-2 rounded-md text-sm overflow-auto">
                      {JSON.stringify(record.metadata, null, 2)}
                    </pre>
                  </div>
                )} */}
              </div>
            ),
            rowExpandable: (record) => true,
          }}
        />
      </div>

      <Modal
        title={selectedPayment ? "Chỉnh sửa thanh toán" : "Thêm mới thanh toán"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ loading: saving, className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ disabled: saving, className: "rounded-md" }}
        width={700}
        className="p-4"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="amount"
              label="Số Tiền"
              rules={[
                { required: true, message: "Vui lòng nhập số tiền" },
                { type: "number", min: 0, message: "Số tiền phải lớn hơn 0" },
              ]}
            >
              <InputNumber
                className="w-full rounded-md"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                prefix={<DollarOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="transactionId"
              label="Mã Giao Dịch"
              rules={[{ required: true, message: "Vui lòng nhập mã giao dịch" }]}
            >
              <Input className="rounded-md" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              name="method"
              label="Phương Thức Thanh Toán"
              rules={[{ required: true, message: "Vui lòng chọn phương thức thanh toán" }]}
            >
              <Select className="rounded-md">
                <Option value="credit_card">Thẻ Tín Dụng</Option>
                <Option value="paypal">PayPal</Option>
                <Option value="cod">COD</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng Thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select className="rounded-md">
                <Option value="pending">Chờ Xử Lý</Option>
                <Option value="completed">Hoàn Thành</Option>
                <Option value="failed">Thất Bại</Option>
                <Option value="refunded">Hoàn Trả</Option>
              </Select>
            </Form.Item>

            <Form.Item name="gateway" label="Gateway">
              <Input className="rounded-md" />
            </Form.Item>
          </div>

          <Divider orientation="left">Thông Tin Liên Quan</Divider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="user" label="Người Dùng" rules={[{ required: true, message: "Vui lòng chọn người dùng" }]}>
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Chọn người dùng"
                filterOption={(input, option) =>
                  String(option?.children || "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="rounded-md"
              >
                {users.map((u) => (
                  <Option key={u._id} value={u._id}>
                    {u.userName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="order" label="Đơn Hàng" rules={[{ required: true, message: "Vui lòng chọn đơn hàng" }]}>
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Chọn đơn hàng"
                filterOption={(input, option) =>
                  String(option?.children || "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="rounded-md"
              >
                {orders.map((o) => (
                  <Option key={o._id} value={o._id}>
                    {o.orderNumber}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Divider orientation="left">Thông Tin Bổ Sung</Divider>

          <Form.Item name="metadata" label="Điều Kiện Khác" rules={[{ required: false }]}>
            {metadataMode === "select" ? (
              <Select
                onChange={(val) => {
                  if (val === "__custom__") setMetadataMode("custom")
                  else form.setFieldsValue({ metadata: val })
                }}
                placeholder="Chọn điều kiện hoặc tùy chỉnh"
                className="rounded-md"
              >
                <Option value={JSON.stringify({})}>Không có</Option>
                <Option value={JSON.stringify({ fast: true })}>Thanh toán nhanh</Option>
                <Option value={JSON.stringify({ refunded: true })}>Đã hoàn trả</Option>
                <Option value={JSON.stringify({ note: "Khách VIP" })}>Ghi chú đặc biệt</Option>
                <Option value="__custom__">Tùy chỉnh...</Option>
              </Select>
            ) : (
              <div>
                <TextArea
                  rows={4}
                  placeholder="Nhập JSON cho metadata"
                  value={customMetadata}
                  onChange={(e) => setCustomMetadata(e.target.value)}
                  onBlur={() => form.setFieldsValue({ metadata: customMetadata })}
                  className="rounded-md mb-2"
                />
                <Button
                  size="small"
                  onClick={() => {
                    setMetadataMode("select")
                    form.setFieldsValue({ metadata: JSON.stringify({}) })
                  }}
                  className="rounded-md"
                >
                  Quay lại lựa chọn có sẵn
                </Button>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// Custom icons for payment methods
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

export default PaymentsPage
