"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, Button, Space, message, Modal, Form, Input, Select, Switch, Typography, Badge, Tag } from "antd"
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  BellOutlined,
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { Search } = Input
const { TextArea } = Input
const { Option } = Select

interface Notification {
  _id: string
  type: "order" | "payment" | "account" | "promotion"
  title: string
  message: string
  metadata: any
  isRead: boolean
  user: {
    _id: string
    userName: string
  }
  createdAt: string
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<{ _id: string; userName: string }[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const isAdmin = user?.roles === "admin"

  useEffect(() => {
    fetchNotifications()
    fetchUsers()
  }, [tokens?.accessToken, pagination.page, pagination.limit])

  const fetchUsers = async () => {
    try {
      if (!tokens?.accessToken) return
      const response = await axios.get("http://localhost:8889/api/v1/users", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: { limit: 1000 },
      })
      setUsers(response.data.data.users || [])
    } catch {}
  }

  const fetchNotifications = async (search = "") => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/notifications", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          ...(search ? { title: search } : {}),
        },
      })

      setNotifications(response.data.data.notifications)
      setPagination(response.data.data.pagination)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách thông báo")
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

  const handleAddNotification = () => {
    setSelectedNotification(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEditNotification = (notification: Notification) => {
    setSelectedNotification(notification)
    form.setFieldsValue({
      type: notification.type,
      title: notification.title,
      message: notification.message,
      user: notification.user?._id,
      isRead: notification.isRead,
    })
    setIsModalOpen(true)
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
        ...values,
        user: values.user,
      }
      if (selectedNotification) {
        await axios.put(`http://localhost:8889/api/v1/notifications/${selectedNotification._id}`, payload, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Cập nhật thông báo thành công")
      } else {
        await axios.post("http://localhost:8889/api/v1/notifications", payload, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Tạo mới thông báo thành công")
      }
      setIsModalOpen(false)
      fetchNotifications(searchTerm)
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý thông báo")
    } finally {
      setSaving(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      await axios.put(
        `http://localhost:8889/api/v1/notifications/${notificationId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        },
      )

      message.success("Đánh dấu thông báo thành công")
      fetchNotifications(searchTerm)
    } catch (error: any) {
      handleError(error, "Lỗi khi đánh dấu thông báo")
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
    fetchNotifications(value)
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

  const getNotificationTypeInfo = (type: string) => {
    const typeMap: { [key: string]: { color: string; label: string; icon: React.ReactNode } } = {
      order: { color: "blue", label: "Đơn Hàng", icon: <ShoppingCartIcon /> },
      payment: { color: "green", label: "Thanh Toán", icon: <CreditCardIcon /> },
      account: { color: "purple", label: "Tài Khoản", icon: <UserIcon /> },
      promotion: { color: "orange", label: "Khuyến Mãi", icon: <GiftIcon /> },
    }
    return typeMap[type] || { color: "default", label: type, icon: null }
  }

  const columns = [
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type: string) => {
        const typeInfo = getNotificationTypeInfo(type)
        return (
          <Tag color={typeInfo.color} className="flex items-center gap-1 px-2 py-1">
            {typeInfo.icon}
            <span>{typeInfo.label}</span>
          </Tag>
        )
      },
    },
    {
      title: "Tiêu Đề",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (title: string, record: Notification) => (
        <div className="flex items-center gap-2">
          {!record.isRead && <Badge status="processing" color="blue" />}
          <span className={record.isRead ? "font-normal" : "font-medium"}>{title}</span>
        </div>
      ),
    },
    {
      title: "Nội Dung",
      dataIndex: "message",
      key: "message",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Người Nhận",
      dataIndex: ["user", "userName"],
      key: "user",
      width: 150,
      render: (_: any, record: Notification) => <span className="text-blue-600">{record.user?.userName || ""}</span>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "isRead",
      key: "isRead",
      width: 150,
      render: (isRead: boolean, record: Notification) => (
        <Button
          type="text"
          icon={
            isRead ? <EyeOutlined className="text-green-500" /> : <EyeInvisibleOutlined className="text-blue-500" />
          }
          onClick={() => handleMarkAsRead(record._id)}
          className={isRead ? "text-green-500" : "text-blue-500"}
        >
          {isRead ? "Đã Đọc" : "Chưa Đọc"}
        </Button>
      ),
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
      width: 120,
      render: (_: any, record: Notification) => (
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => handleEditNotification(record)}
          className="text-blue-500 hover:text-blue-700"
        >
          Sửa
        </Button>
      ),
    },
  ]

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <Title level={3} className="m-0 flex items-center">
          <BellOutlined className="mr-2" /> Quản Lý Thông Báo
        </Title>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddNotification}
            className="rounded-md bg-blue-500 hover:bg-blue-600"
          >
            Thêm Mới Thông Báo
          </Button>
          <span className={`font-medium ${user?.roles === "admin" ? "text-blue-500" : "text-red-500"}`}>
            Current Role: {user?.roles ? user.roles.charAt(0).toUpperCase() + user.roles.slice(1) : "Unknown"}
          </span>
        </Space>
      </div>

      <div className="mb-6">
        <Space>
          <Search
            placeholder="Tìm kiếm theo tiêu đề"
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
          dataSource={notifications}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalRecord,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} notifications</span>,
            className: "ant-table-pagination",
          }}
          onChange={handleTableChange}
          rowKey="_id"
          bordered
          className="bg-white rounded-md shadow-sm"
          rowClassName={(record) => `hover:bg-gray-50 transition-colors ${!record.isRead ? "bg-blue-50" : ""}`}
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title={selectedNotification ? "Chỉnh sửa thông báo" : "Thêm mới thông báo"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ loading: saving, className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ disabled: saving, className: "rounded-md" }}
        width={600}
        className="p-4"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="type" label="Loại" rules={[{ required: true, message: "Chọn loại thông báo" }]}>
            <Select className="rounded-md">
              <Option value="order">Đơn Hàng</Option>
              <Option value="payment">Thanh Toán</Option>
              <Option value="account">Tài Khoản</Option>
              <Option value="promotion">Khuyến Mãi</Option>
            </Select>
          </Form.Item>
          <Form.Item name="title" label="Tiêu Đề" rules={[{ required: true, message: "Nhập tiêu đề" }]}>
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item name="message" label="Nội Dung" rules={[{ required: true, message: "Nhập nội dung" }]}>
            <TextArea rows={3} className="rounded-md" />
          </Form.Item>
          <Form.Item name="user" label="Người Nhận" rules={[{ required: true, message: "Chọn người nhận" }]}>
            <Select
              showSearch
              optionFilterProp="children"
              placeholder="Chọn người nhận"
              className="rounded-md"
              filterOption={(input, option) =>
                (option?.children as unknown as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {users.map((u) => (
                <Option key={u._id} value={u._id}>
                  {u.userName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="isRead" label="Trạng Thái" valuePropName="checked">
            <Switch checkedChildren="Đã đọc" unCheckedChildren="Chưa đọc" className="bg-gray-300" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// Custom icons for notification types
const ShoppingCartIcon = () => (
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
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
)

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

const UserIcon = () => (
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
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
)

const GiftIcon = () => (
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
    <polyline points="20 12 20 22 4 22 4 12"></polyline>
    <rect x="2" y="7" width="20" height="5"></rect>
    <line x1="12" y1="22" x2="12" y2="7"></line>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
  </svg>
)

export default NotificationsPage
