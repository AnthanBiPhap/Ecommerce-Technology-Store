"use client"

import type React from "react"
import type { ColumnType } from "antd/es/table"
import type { Key } from "antd/es/table/interface"

import { Table, Space, Input, Button, Modal, Form, message, Select, Tag, InputNumber, Row, Col, Typography } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/useAuthStore"

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

interface Vendor {
  _id: string
  companyName: string
  description?: string
  logoUrl?: string
  coverImageUrl?: string
  address: {
    street: string
    ward: string
    district: string
    city: string
    country: string
    postalCode: string
  }
  contactPhone: string
  contactEmail: string
  website?: string
  socialLinks: Record<string, string>
  rating: number
  status: "pending" | "active" | "suspended"
  user: string
  createdAt: string
  updatedAt: string
}

interface VendorFormValues {
  companyName: string
  description?: string
  logoUrl?: string
  coverImageUrl?: string
  address: {
    street: string
    ward: string
    district: string
    city: string
    country: string
    postalCode: string
  }
  contactPhone: string
  contactEmail: string
  website?: string
  socialLinks: Record<string, string>
  rating: number
  status: "pending" | "active" | "suspended"
  user: string
}

const VendorPage: React.FC = () => {
  const navigate = useNavigate()
  const { tokens } = useAuthStore()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [form] = Form.useForm()
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    fetchVendors()
    fetchUsers()
  }, [pagination.current, pagination.pageSize])

  const fetchVendors = async (search = "") => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/vendors", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          ...(search ? { companyName: search } : {}),
        },
      })

      if (response.data.statusCode === 200) {
        setVendors(response.data.data.vendors || [])
        setPagination({
          ...pagination,
          total: response.data.data.pagination?.total || 0,
        })
      } else {
        message.error(response.data.message || "Lỗi khi lấy danh sách nhà cung cấp")
      }
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách nhà cung cấp")
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

  const fetchUsers = async () => {
    try {
      if (!tokens?.accessToken) return

      const response = await axios.get("http://localhost:8889/api/v1/users", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })

      if (response.data.statusCode === 200) {
        setUsers(response.data.data.users || [])
      } else {
        message.error(response.data.message || "Lỗi khi lấy danh sách người dùng")
      }
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách người dùng")
    }
  }

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 })
    fetchVendors(searchTerm)
  }

  const handleAddVendor = () => {
    setSelectedVendor(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEditVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor)

    // Set form values with explicit address fields
    form.setFieldsValue({
      companyName: vendor.companyName,
      description: vendor.description,
      logoUrl: vendor.logoUrl,
      coverImageUrl: vendor.coverImageUrl,
      "address.street": vendor.address.street,
      "address.ward": vendor.address.ward,
      "address.district": vendor.address.district,
      "address.city": vendor.address.city,
      "address.country": vendor.address.country,
      "address.postalCode": vendor.address.postalCode,
      contactPhone: vendor.contactPhone,
      contactEmail: vendor.contactEmail,
      website: vendor.website,
      socialLinks: vendor.socialLinks,
      rating: vendor.rating,
      status: vendor.status,
      user: vendor.user,
    })

    setIsModalOpen(true)
  }

  const handleDeleteVendor = async (vendorId: string) => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      await Modal.confirm({
        title: "Xác nhận xóa",
        content: "Bạn có chắc chắn muốn xóa nhà cung cấp này?",
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
      })

      setLoading(true)
      const response = await axios.delete(`http://localhost:8889/api/v1/vendors/${vendorId}`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })

      if (response.data.statusCode === 200) {
        message.success("Xóa nhà cung cấp thành công")
        fetchVendors(searchTerm)
      } else {
        message.error(response.data.message || "Lỗi khi xóa nhà cung cấp")
      }
    } catch (error: any) {
      handleError(error, "Lỗi khi xóa nhà cung cấp")
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

      // Ensure address object is properly structured
      const formattedValues = {
        ...values,
        address: {
          street: values.address?.street || "",
          ward: values.address?.ward || "",
          district: values.address?.district || "",
          city: values.address?.city || "",
          country: values.address?.country || "Việt Nam",
          postalCode: values.address?.postalCode || "550000",
        },
      }

      setLoading(true)

      let response
      if (selectedVendor) {
        // Update existing vendor
        response = await axios.put(`http://localhost:8889/api/v1/vendors/${selectedVendor._id}`, formattedValues, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        if (response.data.statusCode === 200) {
          message.success("Cập nhật nhà cung cấp thành công")
        } else {
          message.error(response.data.message || "Lỗi khi cập nhật nhà cung cấp")
        }
      } else {
        // Create new vendor
        response = await axios.post("http://localhost:8889/api/v1/vendors", formattedValues, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        if (response.data.statusCode === 200) {
          message.success("Tạo mới nhà cung cấp thành công")
        } else {
          message.error(response.data.message || "Lỗi khi tạo mới nhà cung cấp")
        }
      }

      setIsModalOpen(false)
      fetchVendors(searchTerm)
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý nhà cung cấp")
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
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const columns: Array<ColumnType<Vendor>> = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      render: (text: string) => <div className="font-semibold text-blue-600">{text}</div>,
      sorter: (a: Vendor, b: Vendor) => a.companyName.localeCompare(b.companyName),
    },
    {
      title: "Logo",
      dataIndex: "logoUrl",
      key: "logoUrl",
      render: (logo: string) =>
        logo ? (
          <img
            src={logo || "/placeholder.svg"}
            alt="Logo"
            className="w-12 h-12 object-cover rounded-md border border-gray-200"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.src = "/placeholder.svg?height=50&width=50"
            }}
          />
        ) : (
          <Tag color="warning" className="px-2 py-1">
            No Logo
          </Tag>
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : status === "pending" ? "blue" : "red"} className="text-center w-20">
          {status}
        </Tag>
      ),
      filters: [
        { text: "Active", value: "active" },
        { text: "Pending", value: "pending" },
        { text: "Suspended", value: "suspended" },
      ],
      onFilter: (value: boolean | Key, record: Vendor) => record.status === value,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating: number) => <div className="font-medium">{rating}/5</div>,
      sorter: (a: Vendor, b: Vendor) => a.rating - b.rating,
    },
    {
      title: "Contact",
      dataIndex: "contactEmail",
      key: "contactEmail",
      render: (email: string, record: Vendor) => (
        <div>
          <div className="font-medium">{record.contactPhone}</div>
          <div className="text-gray-500">{email}</div>
        </div>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address: any) => (
        <div>
          <div className="font-medium">{address.street}</div>
          <div className="text-gray-500">
            {address.ward}, {address.district}, {address.city}
          </div>
        </div>
      ),
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
      render: (_: any, record: Vendor) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditVendor(record)}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteVendor(record._id)}
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
          Vendor Management
        </Title>
        <Space>
          <Input
            placeholder="Search by company name"
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
            onClick={handleAddVendor}
            className="rounded-md bg-blue-500 hover:bg-blue-600"
          >
            Add Vendor
          </Button>
        </Space>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={vendors}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} vendors</span>,
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
        title={selectedVendor ? "Edit Vendor" : "Add Vendor"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ className: "rounded-md" }}
        width={1000}
        className="p-4"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="companyName"
                label="Company Name"
                rules={[
                  { required: true, message: "Please enter company name!" },
                  { max: 100, message: "Maximum 100 characters!" },
                ]}
              >
                <Input className="rounded-md" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
                label="Contact Phone"
                rules={[
                  { required: true, message: "Please enter contact phone!" },
                  { max: 20, message: "Maximum 20 characters!" },
                ]}
              >
                <Input className="rounded-md" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="Contact Email"
                rules={[
                  { required: true, message: "Please enter contact email!" },
                  { type: "email", message: "Please enter a valid email!" },
                  { max: 100, message: "Maximum 100 characters!" },
                ]}
              >
                <Input className="rounded-md" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="website" label="Website" rules={[{ max: 255, message: "Maximum 255 characters!" }]}>
                <Input className="rounded-md" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ max: 1000, message: "Maximum 1000 characters!" }]}
          >
            <TextArea rows={3} className="rounded-md" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="logoUrl" label="Logo URL" rules={[{ max: 255, message: "Maximum 255 characters!" }]}>
                <Input className="rounded-md" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="coverImageUrl"
                label="Cover Image URL"
                rules={[{ max: 255, message: "Maximum 255 characters!" }]}
              >
                <Input className="rounded-md" />
              </Form.Item>
            </Col>
          </Row>
          <div className="mb-4">
            <div className="mb-2 font-medium">Address</div>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  name={["address", "street"]}
                  label="Street"
                  rules={[{ required: true, message: "Please enter street!" }]}
                >
                  <Input className="rounded-md" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={["address", "ward"]}
                  label="Ward"
                  rules={[{ required: true, message: "Please enter ward!" }]}
                >
                  <Input className="rounded-md" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={["address", "district"]}
                  label="District"
                  rules={[{ required: true, message: "Please enter district!" }]}
                >
                  <Input className="rounded-md" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  name={["address", "city"]}
                  label="City"
                  rules={[{ required: true, message: "Please enter city!" }]}
                >
                  <Input className="rounded-md" />
                </Form.Item>
              </Col>
            </Row>
          </div>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rating"
                label="Rating"
                rules={[
                  { required: true, message: "Please enter rating!" },
                  { type: "number", min: 0, max: 5, message: "Rating must be between 0 and 5!" },
                ]}
              >
                <InputNumber min={0} max={5} className="w-full rounded-md" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Status" rules={[{ required: true, message: "Please select status!" }]}>
                <Select className="rounded-md">
                  <Option value="pending">Pending</Option>
                  <Option value="active">Active</Option>
                  <Option value="suspended">Suspended</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="user" label="User" rules={[{ required: true, message: "Please select user!" }]}>
            <Select showSearch optionFilterProp="children" className="rounded-md">
              {users.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.fullName || user.email}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default VendorPage
