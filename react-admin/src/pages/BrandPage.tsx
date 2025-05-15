"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, Button, Space, Modal, Form, Input, message, Typography, Input as AntInput } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { Search } = AntInput

interface Brand {
  _id: string
  brand_name: string
  description: string
  slug: string
  createdAt: string
  updatedAt: string
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const BrandPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [brands, setBrands] = useState<Brand[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const isAdmin = user?.roles === "admin"

  useEffect(() => {
    fetchBrands()
  }, [tokens?.accessToken, pagination.page, pagination.limit])

  const fetchBrands = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/brands", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm,
        },
      })

      setBrands(response.data.data.brands || [])
      setPagination({
        ...pagination,
        totalRecord: response.data.data.pagination?.totalRecord || 0,
      })
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách thương hiệu")
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

  const handleAddBrand = () => {
    setSelectedBrand(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEditBrand = (brand: Brand) => {
    setSelectedBrand(brand)
    form.setFieldsValue({
      brand_name: brand.brand_name,
      description: brand.description,
      slug: brand.slug,
    })
    setIsModalOpen(true)
  }

  const handleDeleteBrand = (brandId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thương hiệu này?",
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
          await axios.delete(`http://localhost:8889/api/v1/brands/${brandId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa thương hiệu thành công")
          fetchBrands()
        } catch (error: any) {
          handleError(error, "Lỗi khi xóa thương hiệu")
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

      let response
      if (selectedBrand) {
        response = await axios.put(`http://localhost:8889/api/v1/brands/${selectedBrand._id}`, values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Cập nhật thương hiệu thành công")
      } else {
        response = await axios.post("http://localhost:8889/api/v1/brands", values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Tạo mới thương hiệu thành công")
      }

      fetchBrands()
      setIsModalOpen(false)
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý thương hiệu")
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
    fetchBrands()
  }

  const columns = [
    {
      title: "Tên Thương Hiệu",
      dataIndex: "brand_name",
      key: "brand_name",
      width: 200,
      sorter: (a: Brand, b: Brand) => a.brand_name.localeCompare(b.brand_name),
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      width: 300,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      width: 200,
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_: any, record: Brand) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditBrand(record)}
            className="text-blue-500 hover:text-blue-700"
          >
            Sửa
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteBrand(record._id)}
            className="text-red-500 hover:text-red-700"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <Title level={3} className="m-0">
          Brand Management
        </Title>
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddBrand}
              className="rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Thêm Thương Hiệu
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
            placeholder="Tìm kiếm theo tên thương hiệu"
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
          dataSource={brands}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalRecord,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} brands</span>,
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
        title={selectedBrand ? "Chỉnh sửa thương hiệu" : "Thêm mới thương hiệu"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ loading: saving, className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ disabled: saving, className: "rounded-md" }}
        width={600}
        className="p-4"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="brand_name"
            label="Tên Thương Hiệu"
            rules={[
              { required: true, message: "Vui lòng nhập tên thương hiệu" },
              { min: 2, message: "Tên thương hiệu phải có ít nhất 2 ký tự" },
              { max: 50, message: "Tên thương hiệu không được vượt quá 50 ký tự" },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô Tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả" },
              { max: 500, message: "Mô tả không được vượt quá 500 ký tự" },
            ]}
          >
            <Input.TextArea rows={4} className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[
              { required: true, message: "Vui lòng nhập slug" },
              { min: 2, message: "Slug phải có ít nhất 2 ký tự" },
              { max: 50, message: "Slug không được vượt quá 50 ký tự" },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BrandPage
