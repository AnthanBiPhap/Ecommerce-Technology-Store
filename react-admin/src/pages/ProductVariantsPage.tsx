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
  Image,
  InputNumber,
} from "antd"
import type { SortOrder } from "antd/es/table/interface"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"
import { env } from "../constants/getEnvs"
import type { TableColumnType } from "antd"

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

interface ProductVariant {
  _id: string
  sku: string
  variantName: string
  attributes: { [key: string]: string }
  price: number
  salePrice: number
  stock: number
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  product: {
    _id: string
    product_name: string
  }
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const ProductVariantsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [filteredVariants, setFilteredVariants] = useState<ProductVariant[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [searchText, setSearchText] = useState("")
  const [products, setProducts] = useState<{ _id: string; product_name: string }[]>([])

  useEffect(() => {
    fetchProducts()
    fetchVariants()
  }, [tokens?.accessToken, pagination.page, pagination.limit, searchText])

  const fetchProducts = async () => {
    try {
      if (!tokens?.accessToken) return

      const response = await axios.get(`${env.API_URL}/api/v1/products`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: { limit: 100 },
      })

      setProducts(
        response.data.data.products.map((p: any) => ({
          _id: p._id,
          product_name: p.product_name,
        })),
      )
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const fetchVariants = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get(`${env.API_URL}/api/v1/productvariants`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchText,
        },
      })

      setVariants(response.data.data.productVariants)
      setPagination(response.data.data.pagination)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách biến đổi")
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

  const handleSearch = (value: string) => {
    setSearchText(value)
    setPagination({ ...pagination, page: 1 })
    
    // Tìm kiếm trực tiếp trên dữ liệu
    const filtered = variants.filter((variant) => {
      const searchLower = value.toLowerCase()
      const skuLower = variant.sku.toLowerCase()
      const variantNameLower = variant.variantName.toLowerCase()
      const productNameLower = variant.product.product_name.toLowerCase()
      
      // Tìm kiếm trong các thuộc tính
      const attributesMatch = Object.values(variant.attributes).some((value) => 
        value.toLowerCase().includes(searchLower)
      )
      
      return (
        skuLower.includes(searchLower) ||
        variantNameLower.includes(searchLower) ||
        productNameLower.includes(searchLower) ||
        attributesMatch
      )
    })
    setFilteredVariants(filtered)
  }

  const handleAddVariant = () => {
    form.resetFields()
    setSelectedVariant(null)
    setIsModalOpen(true)
    form.setFieldsValue({
      isActive: true, // Set default status to active
      price: 0, // Default price
      stock: 0, // Default stock
      salePrice: undefined // No default sale price
    })
  }

  const handleEditVariant = (variant: ProductVariant) => {
    // Convert attributes object to string for the form
    const attributesString = variant.attributes 
      ? Object.entries(variant.attributes)
          .map(([key, value]) => `${key}:${value}`)
          .join(",")
      : ""
    setSelectedVariant(variant)
    form.setFieldsValue({
      ...variant,
      product: variant.product?._id,
      attributes: attributesString,
      images: variant.images?.join(", ") || ""
    })
    setIsModalOpen(true)
  }

  const handleDeleteVariant = (variantId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa biến đổi này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          if (!tokens?.accessToken) {
            message.error("Vui lòng đăng nhập để tiếp tục")
            navigate("/login")
            return
          }

          setLoading(true)
          await axios.delete(`${env.API_URL}/api/v1/productvariants/${variantId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa biến đổi thành công")
          fetchVariants()
        } catch (error: any) {
          handleError(error, "Lỗi khi xóa biến đổi")
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

      // Parse attributes nếu là string -> object
      if (typeof values.attributes === "string") {
        values.attributes = values.attributes
          .split(",")
          .map((pair: string) => pair.split(":").map((s: string) => s.trim()))
          .reduce((obj: Record<string, string>, item: string[]) => {
            const [key, value] = item
            if (key) obj[key] = value || ""
            return obj
          }, {})
      }
      
      // Parse images nếu là string -> array
      if (typeof values.images === "string") {
        values.images = values.images
          .split(",")
          .map((url: string) => url.trim())
          .filter(Boolean)
      }

      if (selectedVariant) {
        await axios.put(`${env.API_URL}/api/v1/productvariants/${selectedVariant._id}`, values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success("Cập nhật biến đổi thành công")
      } else {
        await axios.post(`${env.API_URL}/api/v1/productvariants`, values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success("Tạo mới biến đổi thành công")
      }

      setIsModalOpen(false)
      fetchVariants()
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý biến đổi")
    } finally {
      setSaving(false)
    }
  }

  const columns: TableColumnType<ProductVariant>[] = [
    {
      title: "Hình Ảnh",
      dataIndex: "images",
      key: "images",
      width: 100,
      render: (images: string[]) => {
        const imageUrl = images?.[0]?.startsWith('http') 
          ? images[0] 
          : images?.[0] 
            ? `${env.API_URL}${images[0]}`
            : null;
            
        return imageUrl ? (
          <Image
            src={imageUrl}
            width={50}
            height={50}
            preview={{ mask: false }}
            className="rounded-md object-cover border border-gray-200"
            fallback="/placeholder.svg?height=50&width=50"
          />
        ) : (
          <div className="w-[50px] h-[50px] bg-gray-100 rounded-md flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Image</span>
          </div>
        );
      },
    },
    {
      title: "Sản Phẩm",
      dataIndex: "product",
      key: "product",
      render: (product: any) =>
        product && product.product_name ? (
          <span className="text-blue-500 font-semibold">{product.product_name}</span>
        ) : (
          <span className="text-gray-400">Chưa gán sản phẩm</span>
        ),
      sorter: (a: ProductVariant, b: ProductVariant) => a.product.product_name.localeCompare(b.product.product_name),
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
      render: (text: string) => <span className="text-blue-500">{text}</span>,
      sorter: (a: ProductVariant, b: ProductVariant) => a.sku.localeCompare(b.sku),
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Tên Biến Đổi",
      dataIndex: "variantName",
      key: "variantName",
      render: (text: string) => <span className="font-medium">{text}</span>,
      sorter: (a: ProductVariant, b: ProductVariant) => a.variantName.localeCompare(b.variantName),
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Thuộc Tính",
      dataIndex: "attributes",
      key: "attributes",
      render: (attributes: { [key: string]: string }) => (
        <Space wrap>
          {Object.entries(attributes).map(([key, value]) => (
            <Tag key={key} color="blue" className="px-2 py-1 rounded-md">
              {key}: {value}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span className="font-medium">{price.toLocaleString("vi-VN")} ₫</span>,
      sorter: (a: ProductVariant, b: ProductVariant) => a.price - b.price,
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Giá Khuyến Mãi",
      dataIndex: "salePrice",
      key: "salePrice",
      render: (salePrice: number) =>
        salePrice > 0 ? <span className="text-red-500">{salePrice.toLocaleString("vi-VN")} ₫</span> : "-",
      sorter: (a: ProductVariant, b: ProductVariant) => a.salePrice - b.salePrice,
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Kho",
      dataIndex: "stock",
      key: "stock",
      render: (stock: number) => <span>{stock} sản phẩm</span>,
      sorter: (a: ProductVariant, b: ProductVariant) => a.stock - b.stock,
      sortDirections: ["ascend", "descend"] as SortOrder[],
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="green" className="text-center w-28 py-1 rounded-md">
            Đang Hoạt Động
          </Tag>
        ) : (
          <Tag color="red" className="text-center w-28 py-1 rounded-md">
            Ngừng Hoạt Động
          </Tag>
        ),
      filters: [
        { text: "Đang Hoạt Động", value: true },
        { text: "Ngừng Hoạt Động", value: false },
      ],
      onFilter: (value: string | number | boolean | React.Key, record: ProductVariant) => {
        return record.isActive === (typeof value === 'boolean' ? value : value === 'true')
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: ProductVariant) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditVariant(record)}
            className="text-blue-500 hover:text-blue-700"
          >
            Sửa
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteVariant(record._id)}
            className="text-red-500 hover:text-red-700"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <Title level={3} className="m-0">
          Product Variants Management
        </Title>
        <Space size="large">
          <Input
            placeholder="Search by SKU, variant name, product name or attributes"
            allowClear
            value={searchText}
            onChange={(e) => {
              const value = e.target.value
              setSearchText(value)
              handleSearch(value)
            }}
            className="w-80 rounded-md"
            prefix={<SearchOutlined />}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddVariant}
            className="rounded-md bg-blue-500 hover:bg-blue-600"
          >
            Thêm Biến Thể
          </Button>
        </Space>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={searchText ? filteredVariants : variants}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: searchText ? filteredVariants.length : pagination.totalRecord,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Tổng cộng {total} biến thể</span>,
            className: "ant-table-pagination",
            onChange: (page: number, pageSize: number) => {
              setPagination({ ...pagination, page, limit: pageSize })
            },
          }}
          rowKey="_id"
          bordered
          className="bg-white rounded-md shadow-sm"
          rowClassName="hover:bg-gray-50 transition-colors"
          scroll={{ x: 1500 }}
          size="large"
        />
      </div>

      <Modal
        title={selectedVariant ? "Chỉnh Sửa Biến Thể" : "Thêm Mới Biến Thể"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={saving}
        okButtonProps={{ className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ className: "rounded-md" }}
        width={800}
        className="p-4"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="product" label="Sản Phẩm" rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}>
            <Select showSearch placeholder="Chọn sản phẩm" optionFilterProp="children" className="rounded-md">
              {products.map((p) => (
                <Option key={p._id} value={p._id}>
                  {p.product_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="sku" label="Mã SKU" rules={[{ required: true, message: "Vui lòng nhập mã SKU!" }]}>
            <Input className="rounded-md" placeholder="Nhập mã SKU" />
          </Form.Item>

          <Form.Item
            name="variantName"
            label="Tên Biến Thể"
            rules={[{ required: true, message: "Vui lòng nhập tên biến thể!" }]}
          >
            <Input className="rounded-md" placeholder="Nhập tên biến thể" />
          </Form.Item>

          <Form.Item
            name="attributes"
            label="Thuộc Tính"
            rules={[{ required: true, message: "Vui lòng nhập thuộc tính!" }]}
            help="Nhập thuộc tính theo định dạng: màu:đỏ,kích thước:M"
          >
            <TextArea
              rows={3}
              placeholder="Nhập các thuộc tính cách nhau bằng dấu phẩy (ví dụ: màu:đỏ,kích thước:M)"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item name="price" label="Giá Bán" rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}>
            <InputNumber
              min={0}
              formatter={(value) => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => (Number(value!.replace(/[^0-9]/g, '')) || 0) as 0}
              style={{ width: "100%" }}
              className="rounded-md"
              placeholder="Nhập giá bán"
            />
          </Form.Item>

          <Form.Item name="salePrice" label="Giá Khuyến Mãi">
            <InputNumber
              min={0}
              formatter={(value) => `₫ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => (Number(value!.replace(/[^0-9]/g, '')) || 0) as 0}
              style={{ width: "100%" }}
              className="rounded-md"
              placeholder="Nhập giá khuyến mãi (nếu có)"
            />
          </Form.Item>

          <Form.Item name="stock" label="Số Lượng Tồn Kho" rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho!" }]}>
            <InputNumber 
              min={0} 
              style={{ width: "100%" }} 
              className="rounded-md" 
              placeholder="Nhập số lượng tồn kho"
            />
          </Form.Item>

          <Form.Item
            name="images"
            label="Hình Ảnh"
            rules={[{ required: true, message: "Vui lòng nhập ít nhất một đường dẫn ảnh!" }]}
            help="Nhập các đường dẫn ảnh cách nhau bằng dấu phẩy"
          >
            <TextArea 
              rows={3} 
              placeholder="Nhập các đường dẫn ảnh cách nhau bằng dấu phẩy" 
              className="rounded-md" 
            />
          </Form.Item>

          <Form.Item name="isActive" label="Trạng Thái" valuePropName="checked">
            <Checkbox>Đang hoạt động</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductVariantsPage
