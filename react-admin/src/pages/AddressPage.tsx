"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, Button, Space, message, Input, Select, Modal, Form, Checkbox, Typography } from "antd"
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"

const { Option } = Select
const { Title } = Typography

interface Address {
  _id: string
  type: string
  fullName: string
  phoneNumber: string
  street: string
  ward: string
  district: string
  city: string
  country: string
  isDefault: boolean
  user: {
    _id: string
    userName: string
    fullName: string
  } | null
  createdAt: string
  updatedAt: string
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const AddressPage: React.FC = () => {
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [searchParams, setSearchParams] = useState({
    fullName: "",
    city: "",
    phoneNumber: "",
  })

  const isAdmin = user?.roles === "admin"

  const fetchUsers = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        return
      }
      const response = await axios.get("http://localhost:8889/api/v1/users", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })
      setUsers(response.data.data.users)
    } catch (error: any) {
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại")
      } else {
        message.error("Lỗi khi lấy danh sách người dùng")
      }
    }
  }

  const fetchAddresses = async (params = {}) => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/addresses", {
        params: {
          ...params,
          page: pagination.page,
          limit: pagination.limit,
        },
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      })

      setAddresses(response.data.data.addresses)
      setPagination(response.data.data.pagination)
    } catch (error: any) {
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại")
      } else {
        message.error("Lỗi khi lấy danh sách địa chỉ")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrUpdateAddress = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        return
      }
      if (!isAdmin) {
        message.error("Chỉ admin mới có quyền thực hiện hành động này")
        return
      }

      setSaving(true)
      const values = await form.validateFields()

      const data = {
        ...values,
      }

      if (selectedAddress) {
        await axios.put(`http://localhost:8889/api/v1/addresses/${selectedAddress._id}`, data, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Cập nhật địa chỉ thành công")
      } else {
        await axios.post("http://localhost:8889/api/v1/addresses", data, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Tạo mới địa chỉ thành công")
      }

      setIsModalOpen(false)
      form.resetFields()
      fetchAddresses(searchParams)
    } catch (error: any) {
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại")
      } else if (error.response?.status === 403) {
        message.error("Bạn không có quyền thực hiện hành động này")
      } else {
        console.error("Error:", error.response?.data)
        message.error("Lỗi khi xử lý địa chỉ")
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAddress = (addressId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa địa chỉ này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          if (!tokens?.accessToken) {
            message.error("Vui lòng đăng nhập để tiếp tục")
            return
          }
          if (!isAdmin) {
            message.error("Chỉ admin mới có quyền xóa")
            return
          }

          await axios.delete(`http://localhost:8889/api/v1/addresses/${addressId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa địa chỉ thành công")
          fetchAddresses(searchParams)
        } catch (error: any) {
          if (error.response?.status === 401) {
            message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại")
          } else if (error.response?.status === 403) {
            message.error("Bạn không có quyền xóa")
          } else {
            message.error("Lỗi khi xóa địa chỉ")
          }
        }
      },
    })
  }

  const handleAddAddress = () => {
    setSelectedAddress(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEditAddress = (address: Address) => {
    setSelectedAddress(address)
    form.setFieldsValue({
      ...address,
      user: address.user?._id || undefined,
      isDefault: address.isDefault,
    })
    setIsModalOpen(true)
  }

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 })
    fetchAddresses(searchParams)
  }

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      page: newPagination.current,
      limit: newPagination.pageSize,
    })
  }

  useEffect(() => {
    fetchUsers()
  }, [tokens?.accessToken])

  useEffect(() => {
    fetchAddresses(searchParams)
  }, [pagination.page, pagination.limit, tokens?.accessToken])

  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      sorter: (a: Address, b: Address) => a.type.localeCompare(b.type),
      render: (type: string) => <span className="capitalize">{type}</span>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      width: 150,
      sorter: (a: Address, b: Address) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 120,
    },
    {
      title: "Street",
      dataIndex: "street",
      key: "street",
      width: 200,
    },
    {
      title: "Ward",
      dataIndex: "ward",
      key: "ward",
      width: 120,
    },
    {
      title: "District",
      dataIndex: "district",
      key: "district",
      width: 120,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      width: 120,
      sorter: (a: Address, b: Address) => a.city.localeCompare(b.city),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      width: 100,
    },
    {
      title: "Is Default",
      dataIndex: "isDefault",
      key: "isDefault",
      width: 100,
      render: (isDefault: boolean) => (
        <span className={isDefault ? "text-green-500" : "text-red-500"}>{isDefault ? "Yes" : "No"}</span>
      ),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      width: 150,
      render: (user: any) => <span>{user ? `${user.fullName} (${user.userName})` : "Unknown"}</span>,
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_: any, record: Address) =>
        isAdmin ? (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditAddress(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              Edit
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteAddress(record._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </Button>
          </Space>
        ) : null,
    },
  ]

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <Title level={3} className="m-0">
          Address Management
        </Title>
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddAddress}
              className="rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Add Address
            </Button>
          )}
          <span className={`font-medium ${user?.roles === "admin" ? "text-blue-500" : "text-red-500"}`}>
            Current Role: {user?.roles ? user.roles.charAt(0).toUpperCase() + user.roles.slice(1) : "Unknown"}
          </span>
        </Space>
      </div>

      <div className="mb-6">
        <Space>
          <Input
            placeholder="Search by Full Name"
            value={searchParams.fullName}
            onChange={(e) => setSearchParams({ ...searchParams, fullName: e.target.value })}
            allowClear
            className="rounded-md w-48"
            prefix={<SearchOutlined />}
          />
          <Input
            placeholder="Search by City"
            value={searchParams.city}
            onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
            allowClear
            className="rounded-md w-48"
            prefix={<SearchOutlined />}
          />
          <Input
            placeholder="Search by Phone Number"
            value={searchParams.phoneNumber}
            onChange={(e) => setSearchParams({ ...searchParams, phoneNumber: e.target.value })}
            allowClear
            className="rounded-md w-48"
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
        </Space>
      </div>

      <div className="overflow-x-auto">
        <Table
          dataSource={addresses}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalRecord,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} addresses</span>,
            className: "ant-table-pagination",
          }}
          onChange={handleTableChange}
          bordered
          className="bg-white rounded-md shadow-sm"
          rowClassName="hover:bg-gray-50 transition-colors"
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title={selectedAddress ? "Edit Address" : "Add Address"}
        open={isModalOpen}
        onOk={handleCreateOrUpdateAddress}
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
          initialValues={{ type: "shipping", country: "VN", isDefault: false }}
          className="mt-4"
        >
          <Form.Item name="user" label="User" rules={[{ required: true, message: "Please select a user!" }]}>
            <Select showSearch optionFilterProp="children" placeholder="Select user" className="rounded-md">
              {users.map((u) => (
                <Option key={u._id} value={u._id}>
                  {u.fullName} ({u.userName})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true, message: "Please select address type!" }]}>
            <Select className="rounded-md">
              <Option value="shipping">Shipping</Option>
              <Option value="billing">Billing</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[
              { required: true, message: "Please input full name!" },
              { max: 100, message: "Full name max 100 characters!" },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please input phone number!" },
              { max: 20, message: "Phone number max 20 characters!" },
              { pattern: /^\d+$/, message: "Phone number must contain only digits!" },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item name="street" label="Street" rules={[{ required: true, message: "Please input street!" }]}>
            <Input.TextArea rows={2} className="rounded-md" />
          </Form.Item>
          <Form.Item name="ward" label="Ward" rules={[{ required: true, message: "Please input ward!" }]}>
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item name="district" label="District" rules={[{ required: true, message: "Please input district!" }]}>
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true, message: "Please input city!" }]}>
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[
              { required: true, message: "Please select country!" },
              { max: 2, message: "Country code max 2 characters!" },
            ]}
          >
            <Select className="rounded-md">
              <Option value="VN">Vietnam</Option>
              <Option value="US">United States</Option>
              <Option value="JP">Japan</Option>
            </Select>
          </Form.Item>
          <Form.Item name="isDefault" label="Is Default" valuePropName="checked">
            <Checkbox>Set as default address</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AddressPage
