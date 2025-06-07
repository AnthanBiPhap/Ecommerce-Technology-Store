import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, Select, message, Typography } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, MailOutlined } from '@ant-design/icons'
import axios from 'axios'
import { useAuthStore } from '../stores/useAuthStore'
import { useNavigate } from 'react-router-dom'
import type { ColumnsType } from 'antd/es/table' // Import ColumnsType
import { env } from '../constants/getEnvs'

const { Option } = Select
const { Title } = Typography

interface User {
  _id: string
  userName: string
  fullName: string
  email: string
  password?: string
  roles: string
  status: string
  avatarUrl?: string
  lastLogin?: Date
  gender?: 'male' | 'female'
  phone?: string
  birthDay?: Date
  createdAt: string
  updatedAt: string
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const UserPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')

  const isAdmin = user?.roles === 'admin'

  useEffect(() => {
    fetchUsers()
  }, [tokens?.accessToken, pagination.page, pagination.limit])

  const fetchUsers = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error('Vui lòng đăng nhập để tiếp tục')
        navigate('/login')
        return
      }

      setLoading(true)
      const response = await axios.get(`${env.API_URL}/api/v1/users`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: { page: pagination.page, limit: pagination.limit },
      })

      const users = response.data.data.users.map((user: any) => ({
        ...user,
        roles: user.roles || 'customer',
      }))

      setUsers(users)
      setPagination(response.data.data.pagination)
    } catch (error: any) {
      handleError(error, 'Lỗi khi lấy danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleError = (error: any, defaultMessage: string) => {
    if (error.response?.status === 401) {
      message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại')
      navigate('/login')
    } else if (error.response?.data?.message) {
      const errorMessage = error.response.data.message
      if (typeof errorMessage === 'string') {
        message.error(errorMessage)
      } else if (Array.isArray(errorMessage)) {
        errorMessage.forEach((err: string) => {
          message.error(err)
        })
      }
    } else {
      message.error(defaultMessage)
    }
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    form.setFieldsValue({
      userName: user.userName,
      fullName: user.fullName,
      email: user.email,
      roles: user.roles,
      status: user.status,
      avatarUrl: user.avatarUrl,
    })
    setIsModalOpen(true)
  }

  const handleForgotPassword = async (email: string) => {
    try {
      if (!tokens?.accessToken) {
        message.error('Vui lòng đăng nhập để tiếp tục')
        navigate('/login')
        return
      }

      setLoading(true)
      await axios.post(`${env.API_URL}/api/v1/forgot-password`, { email }, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })

      message.success('Mật khẩu mới đã được gửi đến email của bạn')
      setIsForgotPasswordModalOpen(false)
    } catch (error: any) {
      handleError(error, 'Lỗi khi gửi yêu cầu cấp lại mật khẩu')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = (userId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa người dùng này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          if (!tokens?.accessToken) {
            message.error('Vui lòng đăng nhập để tiếp tục')
            navigate('/login')
            return
          }

          setLoading(true)
          await axios.delete(`${env.API_URL}/api/v1/users/${userId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success('Xóa người dùng thành công')
          fetchUsers()
        } catch (error: any) {
          handleError(error, 'Lỗi khi xóa người dùng')
        } finally {
          setLoading(false)
        }
      },
    })
  }

  const handleModalOk = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error('Vui lòng đăng nhập để tiếp tục')
        navigate('/login')
        return
      }

      setSaving(true)
      const values = await form.validateFields()

      if (selectedUser) {
        const updateData = { ...values }
        if (!values.password) delete updateData.password
        if (!values.avatarUrl) delete updateData.avatarUrl

        await axios.put(`${env.API_URL}/api/v1/users/${selectedUser._id}`, updateData, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success('Cập nhật người dùng thành công')
      } else {
        await axios.post(`${env.API_URL}/api/v1/users`, values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success('Tạo mới người dùng thành công')
      }

      setIsModalOpen(false)
      fetchUsers()
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors
        const formErrors: { [key: string]: { errors: string[] } } = {}
        
        Object.keys(backendErrors).forEach(field => {
          formErrors[field] = {
            errors: Array.isArray(backendErrors[field]) 
              ? backendErrors[field] 
              : [backendErrors[field]]
          }
        })
        
        form.setFields(
          Object.keys(formErrors).map(field => ({
            name: field,
            errors: formErrors[field].errors
          }))
        )
      } else {
        handleError(error, 'Lỗi khi xử lý người dùng')
      }
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

  // Define columns with explicit typing
  const columns: ColumnsType<User> = [
    {
      title: 'Username',
      dataIndex: 'userName',
      key: 'userName',
      sorter: (a: User, b: User) => a.userName.localeCompare(b.userName),
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: User, b: User) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string) => (
        <span className={roles === 'admin' ? 'text-blue-500' : 'text-green-500'}>
          {roles.charAt(0).toUpperCase() + roles.slice(1)}
        </span>
      ),
      filters: [
        { text: 'Admin', value: 'admin' },
        { text: 'Customer', value: 'customer' },
      ],
      onFilter: (value, record: User) => record.roles === value, // TypeScript will infer value as string
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={status === 'active' ? 'text-green-500' : 'text-red-500'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
        { text: 'Banned', value: 'banned' },
      ],
      onFilter: (value, record: User) => record.status === value, // TypeScript will infer value as string
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: User) =>
        isAdmin ? (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              Edit
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteUser(record._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </Button>
            <Button
              type="text"
              icon={<MailOutlined />}
              onClick={() => {
                setForgotPasswordEmail(record.email)
                setIsForgotPasswordModalOpen(true)
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              Forgot Password
            </Button>
          </Space>
        ) : null,
    },
  ]

  return (
    <div className="p-4">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <Title level={3} className="m-0">
          User Management
        </Title>
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddUser}
              className="rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Add User
            </Button>
          )}
          <span
            className={`font-medium ${
              user?.roles === 'admin' ? 'text-blue-500' : 'text-red-500'
            }`}
          >
            Current Role: {user?.roles ? user.roles.charAt(0).toUpperCase() + user.roles.slice(1) : 'Unknown'}
          </span>
        </Space>
      </div>

      <Table
        dataSource={users}
        columns={columns}
        loading={loading}
        rowKey="_id"
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.totalRecord,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => <span className="ml-0">Total {total} users</span>,
          className: 'ant-table-pagination'
        }}
        onChange={handleTableChange}
        bordered
        className="bg-white rounded-md shadow-sm"
        rowClassName="hover:bg-gray-50 transition-colors"
      />

      <Modal
        title={selectedUser ? 'Edit User' : 'Add User'}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        okButtonProps={{ loading: saving, className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ disabled: saving, className: "rounded-md" }}
        width={600}
        className="p-4"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ roles: 'customer', status: 'active' }}
          className="mt-4"
          validateTrigger={['onChange', 'onBlur']}
        >
          <Form.Item
            name="userName"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
              { max: 50, message: 'Tên đăng nhập không được vượt quá 50 ký tự!' }
            ]}
            validateFirst
          >
            <Input className="rounded-md" placeholder="Nhập tên đăng nhập" />
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { max: 100, message: 'Họ và tên không được vượt quá 100 ký tự!' }
            ]}
            validateFirst
          >
            <Input className="rounded-md" placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { max: 100, message: 'Email không được vượt quá 100 ký tự!' },
              { 
                pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Email không hợp lệ!'
              }
            ]}
            validateFirst
          >
            <Input className="rounded-md" placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            name="roles"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
            validateFirst
          >
            <Select className="rounded-md" placeholder="Chọn vai trò">
              <Option value="admin">Quản trị viên</Option>
              <Option value="customer">Khách hàng</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            validateFirst
          >
            <Select className="rounded-md" placeholder="Chọn trạng thái">
              <Option value="active">Hoạt động</Option>
              <Option value="inactive">Không hoạt động</Option>
              <Option value="banned">Bị cấm</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={
              selectedUser
                ? [
                    { max: 255, message: 'Mật khẩu không được vượt quá 255 ký tự!' }
                  ]
                : [
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                    { max: 255, message: 'Mật khẩu không được vượt quá 255 ký tự!' }
                  ]
            }
            validateFirst
          >
            <Input.Password className="rounded-md" placeholder="Nhập mật khẩu" />
          </Form.Item>
          <Form.Item 
            name="avatarUrl" 
            label="URL ảnh đại diện"
            rules={[
              { max: 255, message: 'URL không được vượt quá 255 ký tự!' }
            ]}
            validateFirst
          >
            <Input className="rounded-md" placeholder="Nhập URL ảnh đại diện" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Forgot Password"
        open={isForgotPasswordModalOpen}
        onOk={() => handleForgotPassword(forgotPasswordEmail)}
        onCancel={() => setIsForgotPasswordModalOpen(false)}
        okButtonProps={{ loading: saving, className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ disabled: saving, className: "rounded-md" }}
        width={400}
        className="p-4"
      >
        <p>Email: {forgotPasswordEmail}</p>
        <p className="mt-2">Một mật khẩu mới sẽ được gửi đến email này. Vui lòng kiểm tra email của bạn.</p>
      </Modal>
    </div>
  )
}

export default UserPage