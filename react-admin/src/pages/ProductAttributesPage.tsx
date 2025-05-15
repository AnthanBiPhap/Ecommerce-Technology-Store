"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Select,
  Checkbox,
  Tag,
  Typography,
  Tooltip,
} from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  SwapOutlined,
  CheckCircleOutlined,
  SearchOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons"
import type { SortOrder } from "antd/es/table/interface"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { TextArea } = Input

interface ProductAttribute {
  _id: string
  name: string
  displayName: string
  description?: string
  type: "text" | "number" | "boolean" | "select"
  options?: string[]
  isFilterable: boolean
  isVariant: boolean
  isRequired: boolean
  createdAt: string
  updatedAt: string
  productsCount: number // Số lượng sản phẩm sử dụng thuộc tính
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const ProductAttributesPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [productAttributes, setProductAttributes] = useState<ProductAttribute[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAttribute, setSelectedAttribute] = useState<ProductAttribute | null>(null)
  const [searchText, setSearchText] = useState("")

  const isAdmin = user?.roles === "admin"

  useEffect(() => {
    fetchProductAttributes()
  }, [tokens?.accessToken, pagination.page, pagination.limit])

  const fetchProductAttributes = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchText,
      }

      const response = await axios.get("http://localhost:8889/api/v1/productattributes", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params,
      })

      setProductAttributes(response.data.data.productAttributes)
      setPagination(response.data.data.pagination)
    } catch (error: any) {
      console.error("Error details:", {
        error,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      })
      handleError(error, "Lỗi khi lấy danh sách thuộc tính sản phẩm")
    } finally {
      setLoading(false)
    }
  }

  const handleError = (error: any, defaultMessage: string) => {
    console.error("Error details:", {
      error,
      response: error.response,
      status: error.response?.status,
      data: error.response?.data
    })
    
    if (error.response?.status === 401) {
      message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại")
      navigate("/login")
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error(defaultMessage)
    }
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    setPagination({ ...pagination, page: 1 })
    fetchProductAttributes()
  }

  const handleAddAttribute = () => {
    setSelectedAttribute(null)
    form.resetFields()
    form.setFieldsValue({
      isFilterable: false,
      isVariant: false,
      isRequired: false,
    })
    setIsModalOpen(true)
  }

  const handleEditAttribute = (attribute: ProductAttribute) => {
    setSelectedAttribute(attribute)
    form.setFieldsValue({
      name: attribute.name,
      displayName: attribute.displayName,
      description: attribute.description,
      type: attribute.type,
      options: attribute.options ? attribute.options.join(", ") : "",
      isFilterable: attribute.isFilterable,
      isVariant: attribute.isVariant,
      isRequired: attribute.isRequired,
    })
    setIsModalOpen(true)
  }

  const handleDeleteAttribute = (attributeId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thuộc tính này?",
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
          await axios.delete(`http://localhost:8889/api/v1/product-attributes/${attributeId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa thuộc tính thành công")
          fetchProductAttributes()
        } catch (error: any) {
          console.error("Error details:", {
            error,
            response: error.response,
            status: error.response?.status,
            data: error.response?.data
          })
          handleError(error, "Lỗi khi xóa thuộc tính")
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
      console.log("Form values:", values)

      // Process options from comma-separated string to array
      if (values.options && typeof values.options === "string") {
        values.options = values.options.split(",").map((option: string) => option.trim()).filter(Boolean)
      } else if (!values.options) {
        values.options = []
      }
      console.log("Processed values:", values)

      if (selectedAttribute) {
        await axios.put(`http://localhost:8889/api/v1/product-attributes/${selectedAttribute._id}`, values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success("Cập nhật thuộc tính thành công")
      } else {
        await axios.post("http://localhost:8889/api/v1/product-attributes", values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success("Tạo mới thuộc tính thành công")
      }

      setIsModalOpen(false)
      fetchProductAttributes()
    } catch (error: any) {
      console.error("API Error:", error)
      handleError(error, "Lỗi khi xử lý thuộc tính")
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

  const getAttributeTypeInfo = (type: string) => {
    const typeMap: { [key: string]: { color: string; label: string; icon: React.ReactNode } } = {
      text: { color: "blue", label: "Văn Bản", icon: <TextIcon /> },
      number: { color: "cyan", label: "Số", icon: <NumberIcon /> },
      boolean: { color: "green", label: "Đúng/Sai", icon: <BooleanIcon /> },
      select: { color: "orange", label: "Danh Sách", icon: <SelectIcon /> },
    }
    return typeMap[type] || { color: "default", label: type, icon: null }
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
      title: "Tên Kỹ Thuật",
      dataIndex: "name",
      key: "name",
      width: 180,
      render: (text: string) => <span className="text-blue-600 font-medium">{text}</span>,
      sorter: (a: ProductAttribute, b: ProductAttribute) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Tên Hiển Thị",
      dataIndex: "displayName",
      key: "displayName",
      width: 200,
      sorter: (a: ProductAttribute, b: ProductAttribute) => a.displayName.localeCompare(b.displayName),
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      width: 250,
      ellipsis: true,
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type: string) => {
        const typeInfo = getAttributeTypeInfo(type)
        return (
          <Tag color={typeInfo.color} className="flex items-center gap-1 px-2 py-1">
            {typeInfo.icon}
            <span>{typeInfo.label}</span>
          </Tag>
        )
      },
    },
    {
      title: "Tùy Chọn",
      dataIndex: "options",
      key: "options",
      width: 200,
      render: (options: string[]) => {
        if (!options || options.length === 0) return "-"
        return (
          <Tooltip title={options.join(", ")} placement="topLeft">
            <div className="truncate max-w-[200px]">{options.join(", ")}</div>
          </Tooltip>
        )
      },
    },
    {
      title: "Sản Phẩm",
      dataIndex: "productsCount",
      key: "productsCount",
      width: 120,
      render: (count: number) => <span className="text-blue-600 font-medium">{count}</span>,
      sorter: (a: ProductAttribute, b: ProductAttribute) => a.productsCount - b.productsCount,
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Lọc",
      dataIndex: "isFilterable",
      key: "isFilterable",
      width: 100,
      render: (isFilterable: boolean) => (
        <Tag color={isFilterable ? "success" : "default"} className="text-center w-16">
          {isFilterable ? <FilterOutlined /> : "-"}
        </Tag>
      ),
    },
    {
      title: "Biến Đổi",
      dataIndex: "isVariant",
      key: "isVariant",
      width: 100,
      render: (isVariant: boolean) => (
        <Tag color={isVariant ? "success" : "default"} className="text-center w-16">
          {isVariant ? <SwapOutlined /> : "-"}
        </Tag>
      ),
    },
    {
      title: "Bắt Buộc",
      dataIndex: "isRequired",
      key: "isRequired",
      width: 100,
      render: (isRequired: boolean) => (
        <Tag color={isRequired ? "success" : "default"} className="text-center w-16">
          {isRequired ? <CheckCircleOutlined /> : "-"}
        </Tag>
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
      render: (_: any, record: ProductAttribute) =>
        isAdmin ? (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditAttribute(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              Sửa
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteAttribute(record._id)}
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
        <Title level={3} className="m-0">
          Quản Lý Thuộc Tính Sản Phẩm
        </Title>
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddAttribute}
              className="rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Thêm Mới Thuộc Tính
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
            placeholder="Tìm kiếm theo tên thuộc tính"
            allowClear
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={() => handleSearch(searchText)}
            value={searchText}
            className="w-80 rounded-md"
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => handleSearch(searchText)}
            className="rounded-md bg-blue-500 hover:bg-blue-600"
          >
            Tìm kiếm
          </Button>
        </Space>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={productAttributes}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalRecord,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} attributes</span>,
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
        title={selectedAttribute ? "Chỉnh sửa thuộc tính" : "Thêm mới thuộc tính"}
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
              name="name"
              label="Tên Kỹ Thuật"
              rules={[
                { required: true, message: "Vui lòng nhập tên kỹ thuật" },
                { max: 50, message: "Tên kỹ thuật không được vượt quá 50 ký tự" },
                // {
                //   pattern: /^[a-zA-Z0-9_]+$/,
                //   message: "Tên kỹ thuật chỉ được chứa chữ cái, số và dấu gạch dưới",
                // },
              ]}
              tooltip={{
                title: "Tên kỹ thuật là tên duy nhất để tham chiếu thuộc tính trong hệ thống (ví dụ: 'screen_size', 'color', 'weight')",
                icon: <InfoCircleOutlined />,
              }}
            >
              <Input placeholder="Ví dụ: screen_size, color, weight" className="rounded-md" />
            </Form.Item>

            <Form.Item
              name="displayName"
              label="Tên Hiển Thị"
              rules={[
                { required: true, message: "Vui lòng nhập tên hiển thị" },
                { max: 100, message: "Tên hiển thị không được vượt quá 100 ký tự" },
              ]}
            >
              <Input className="rounded-md" />
            </Form.Item>
          </div>

          <Form.Item
            name="description"
            label="Mô Tả"
            rules={[{ max: 255, message: "Mô tả không được vượt quá 255 ký tự" }]}
          >
            <TextArea rows={3} className="rounded-md" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="type" label="Loại" rules={[{ required: true, message: "Vui lòng chọn loại" }]}>
              <Select
                options={[
                  { value: "text", label: "Văn Bản" },
                  { value: "number", label: "Số" },
                  { value: "boolean", label: "Đúng/Sai" },
                  { value: "select", label: "Danh Sách" },
                ]}
                onChange={(value) => {
                  // Reset options when type changes
                  if (value !== "select") {
                    form.setFieldsValue({ options: "" })
                  }
                }}
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="options"
              label="Tùy Chọn"
              rules={[{ required: false }]}
              tooltip={{
                title: "Nhập các tùy chọn, cách nhau bằng dấu phẩy (chỉ bắt buộc cho loại 'select')",
                icon: <InfoCircleOutlined />,
              }}
            >
              <TextArea
                rows={3}
                placeholder="Ví dụ: Đỏ, Xanh, Vàng, Đen"
                className="rounded-md"
                disabled={form.getFieldValue("type") !== "select"}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name="isFilterable" label="Có Thể Lọc" valuePropName="checked">
              <Checkbox>Có thể sử dụng để lọc sản phẩm</Checkbox>
            </Form.Item>

            <Form.Item name="isVariant" label="Là Biến Đổi" valuePropName="checked">
              <Checkbox>Có thể tạo biến đổi sản phẩm</Checkbox>
            </Form.Item>

            <Form.Item name="isRequired" label="Bắt Buộc" valuePropName="checked">
              <Checkbox>Có bắt buộc nhập</Checkbox>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}

// Custom icons for attribute types
const TextIcon = () => (
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
    <line x1="18" y1="10" x2="6" y2="10"></line>
    <line x1="21" y1="6" x2="3" y2="6"></line>
    <line x1="21" y1="14" x2="3" y2="14"></line>
    <line x1="18" y1="18" x2="6" y2="18"></line>
  </svg>
)

const NumberIcon = () => (
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
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
)

const BooleanIcon = () => (
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
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

const SelectIcon = () => (
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
    <path d="M4 6h16"></path>
    <path d="M4 12h16"></path>
    <path d="M4 18h16"></path>
  </svg>
)

export default ProductAttributesPage

