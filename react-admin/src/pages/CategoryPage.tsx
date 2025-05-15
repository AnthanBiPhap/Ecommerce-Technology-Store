"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, Button, Space, Modal, Form, Input, message, Image, Switch, Typography, InputNumber } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, AppstoreOutlined } from "@ant-design/icons"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { Search } = Input
const { TextArea } = Input

interface Category {
  _id: string
  category_name: string
  description: string
  slug: string
  level: number
  imageUrl: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const CategoryPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const isAdmin = user?.roles === "admin"

  useEffect(() => {
    fetchCategories()
  }, [tokens?.accessToken, pagination.page, pagination.limit])

  const fetchCategories = async (search = searchTerm) => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/categories/root", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          ...(search ? { category_name: search } : {}),
        },
      })

      setCategories(response.data.data.categories)
      setPagination(response.data.data.pagination)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách danh mục")
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

  const handleAddCategory = () => {
    setSelectedCategory(null)
    form.resetFields()
    form.setFieldsValue({
      level: 0,
      isActive: true,
    })
    setIsModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    form.setFieldsValue({
      category_name: category.category_name,
      description: category.description,
      slug: category.slug,
      level: category.level,
      imageUrl: category.imageUrl,
      isActive: category.isActive ? true : false,
    })
    setIsModalOpen(true)
  }

  const handleDeleteCategory = (categoryId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa danh mục này?",
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
          await axios.delete(`http://localhost:8889/api/v1/categories/${categoryId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa danh mục thành công")
          fetchCategories(searchTerm)
        } catch (error: any) {
          handleError(error, "Lỗi khi xóa danh mục")
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

      if (selectedCategory) {
        await axios.put(`http://localhost:8889/api/v1/categories/${selectedCategory._id}`, values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success("Cập nhật danh mục thành công")
      } else {
        await axios.post("http://localhost:8889/api/v1/categories", values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success("Tạo mới danh mục thành công")
      }

      setIsModalOpen(false)
      fetchCategories(searchTerm)
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý danh mục")
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
    fetchCategories(value)
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

  const columns = [
    {
      title: "Tên Danh Mục",
      dataIndex: "category_name",
      key: "category_name",
      width: 200,
      sorter: (a: Category, b: Category) => a.category_name.localeCompare(b.category_name),
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      width: 300,
      ellipsis: true,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      width: 150,
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width: 100,
      render: (level: number) => <span className="font-medium">{level}</span>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (isActive: boolean) => (
        <span className={isActive ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: 120,
      render: (imageUrl: string) => (
        <div className="flex justify-center">
          <Image
            src={imageUrl || "/placeholder.svg?height=50&width=50"}
            alt="Category"
            width={50}
            height={50}
            className="object-cover rounded-md border border-gray-200"
            fallback="/placeholder.svg?height=50&width=50"
            preview={{ mask: <SearchOutlined /> }}
          />
        </div>
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
      width: 200,
      render: (_: any, record: Category) =>
        isAdmin ? (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditCategory(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              Sửa
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteCategory(record._id)}
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
          <AppstoreOutlined className="mr-2" /> Quản Lý Danh Mục
        </Title>
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddCategory}
              className="rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Thêm Mới Danh Mục
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
            placeholder="Tìm kiếm theo tên danh mục"
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
          dataSource={categories}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalRecord,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} categories</span>,
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
        title={selectedCategory ? "Chỉnh sửa danh mục" : "Thêm mới danh mục"}
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
            name="category_name"
            label="Tên Danh Mục"
            rules={[
              { required: true, message: "Vui lòng nhập tên danh mục" },
              { min: 2, message: "Tên danh mục phải có ít nhất 2 ký tự" },
              { max: 50, message: "Tên danh mục không được vượt quá 50 ký tự" },
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
            <TextArea rows={4} className="rounded-md" />
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

          <Form.Item name="level" label="Level" rules={[{ required: true, message: "Vui lòng nhập level" }]}>
            <InputNumber min={0} className="w-full rounded-md" />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Ảnh Đại Diện"
            rules={[{ required: true, message: "Vui lòng nhập URL ảnh" }]}
          >
            <Input className="rounded-md" />
          </Form.Item>

          {form.getFieldValue("imageUrl") && (
            <div className="mb-4 flex justify-center">
              <Image
                src={form.getFieldValue("imageUrl") || "/placeholder.svg"}
                alt="Preview"
                width={100}
                height={100}
                className="object-cover rounded-md border border-gray-200"
                fallback="/placeholder.svg?height=100&width=100"
              />
            </div>
          )}

          <Form.Item
            name="isActive"
            label="Trạng Thái"
            valuePropName="checked"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" className="bg-gray-300" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CategoryPage
