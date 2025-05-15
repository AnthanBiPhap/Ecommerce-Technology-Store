"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Table,
  Space,
  Input,
  Button,
  Modal,
  Form,
  message,
  Upload,
  InputNumber,
  Select,
  Tag,
  Image,
  Typography,
  Switch,
  Tabs,
  Divider,
  Rate,
} from "antd"
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InboxOutlined,
  TagsOutlined,
  StarOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons"
import { UploadFile, UploadProps, UploadFileStatus } from "antd/es/upload/interface"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { TextArea } = Input
const { Dragger } = Upload
const { TabPane } = Tabs

interface ContentBlock {
  type: "text" | "image"
  content?: string
  src?: string
  alt?: string
}

interface Product {
  _id: string
  product_name: string
  description: string
  slug: string
  price: number
  salePrice: number
  stock: number
  images: string[]
  attributes: any[]
  rating: number
  reviewCount: number
  tags: string[]
  isActive: boolean
  bestSale: boolean
  flashSale: boolean
  promotion: string[]
  contentBlock: ContentBlock[]
  category: {
    _id: string
    category_name: string
  }
  brand: {
    _id: string
    brand_name: string
  }
  vendor: {
    _id: string
    companyName: string
  }
  createdAt: string
  updatedAt: string
}

interface Category {
  _id: string
  category_name: string
  description: string
  slug: string
  level: number
  imageUrl: string
  isActive: boolean
}

interface Brand {
  _id: string
  brand_name: string
  description: string
  slug: string
}

interface Vendor {
  _id: string
  companyName: string
  description: string
  logoUrl: string
}

const ProductsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryIndex, setCategoryIndex] = useState('');
  const [brands, setBrands] = useState<Brand[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([])
  const [activeTab, setActiveTab] = useState("1")

  const isAdmin = user?.roles === "admin"

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 })
    fetchProducts()
  };

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setFileList([])
    setContentBlocks([])
    form.resetFields()
    form.setFieldsValue({
      isActive: true,
      bestSale: false,
      flashSale: false,
      rating: 0,
      reviewCount: 0,
      stock: 0,
    })
    setIsModalOpen(true)
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    // Convert image URLs to UploadFile objects
    const uploadFiles = product.images.map((url, index) => ({
      uid: `-${index}`,
      name: `image-${index}.jpg`,
      status: 'done' as const,
      url: url,
      originFileObj: new File([], `image-${index}.jpg`),
    }))
    setContentBlocks(product.contentBlock || [])

    form.setFieldsValue({
      ...product,
      category: product.category?._id,
      brand: product.brand?._id,
      vendor: product.vendor?._id,
      tags: product.tags?.join(", "),
      promotion: product.promotion?.join(", "),
      images: uploadFiles,
    })
    setIsModalOpen(true)
  };

  const handleDeleteProduct = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
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
          await axios.delete(`http://localhost:8889/api/v1/products/${id}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa sản phẩm thành công")
          fetchProducts()
        } catch (error: any) {
          handleError(error, "Lỗi khi xóa sản phẩm")
        } finally {
          setLoading(false)
        }
      },
    })
  };

  const handleError = (error: any, defaultMessage: string) => {
    if (error.response?.status === 401) {
      message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại")
      navigate("/login")
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error(defaultMessage)
    }
  };

  const handleModalOk = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setSaving(true)
      const values = await form.validateFields()

      // Process images: convert fileList to array of URL strings
      const images = fileList.map((file) => file.url || file.response?.url).filter(Boolean)
      if (images.length === 0) {
        message.error("Vui lòng tải lên ít nhất một ảnh sản phẩm")
        setSaving(false)
        return
      };

      // Process tags and promotion from comma-separated strings to arrays
      const tags = values.tags
        ? values.tags
            .split(",")
            .map((tag: string) => tag.trim())
            .filter(Boolean)
        : []

      const promotion = values.promotion
        ? values.promotion
            .split(",")
            .map((promo: string) => promo.trim())
            .filter(Boolean)
        : []

      // Generate slug from product name if not provided
      const slug =
        values.slug ||
        values.product_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "")

      const productData = {
        ...values,
        slug,
        images,
        tags,
        promotion,
        contentBlock: contentBlocks,
      };

      if (selectedProduct) {
        await axios.put(`http://localhost:8889/api/v1/products/${selectedProduct._id}`, productData, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Cập nhật sản phẩm thành công")
      } else {
        await axios.post("http://localhost:8889/api/v1/products", productData, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Tạo mới sản phẩm thành công")
      }

      setIsModalOpen(false)
      fetchProducts()
    } catch (error: any) {
      handleError(error, "Lỗi khi lưu sản phẩm");
      console.error('Post products is failed: ', error);
    } finally {
      setSaving(false)
    }
  }

  const fetchProducts = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/products", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          search: searchTerm,
        },
      })

      setProducts(response.data.data.products)
      setPagination({ ...pagination, total: response.data.data.pagination.totalRecord })
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách sản phẩm")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      if (!tokens?.accessToken) return
      const response = await axios.get("http://localhost:8889/api/v1/categories/root?limit=30", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })
      setCategories(response.data.data.categories)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh mục sản phẩm")
    }
  }

  const fetchBrands = async () => {
    try {
      if (!tokens?.accessToken) return
      const response = await axios.get("http://localhost:8889/api/v1/brands?limit=100", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })
      setBrands(response.data.data.brands)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy thương hiệu")
    }
  }

  const fetchVendors = async () => {
    try {
      if (!tokens?.accessToken) return
      const response = await axios.get("http://localhost:8889/api/v1/vendors", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })
      setVendors(response.data.data.vendors)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy nhà cung cấp")
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
    fetchBrands()
    fetchVendors()
  }, [pagination.current, pagination.pageSize, tokens?.accessToken])

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    })
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

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    listType: "picture-card",
    fileList: fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/")
      if (!isImage) {
        message.error("Chỉ được chọn file ảnh!")
        return Upload.LIST_IGNORE
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        message.error("Kích thước ảnh phải nhỏ hơn 2MB!")
        return Upload.LIST_IGNORE
      }
      return false
    },
    onChange: async ({ fileList: newFileList }) => {
      setFileList(newFileList)
      if (newFileList.length > 0) {
        try {
          const formData = new FormData()
          newFileList.forEach((file) => {
            formData.append('files', file.originFileObj as File)
          })
          /* formData.append('collectionName', 'products') */

          if (!tokens?.accessToken) {
            message.error("Vui lòng đăng nhập để tiếp tục")
            navigate("/login")
            return
          }
          if(categoryIndex !== "") {
            const response = await axios.post(
              `http://localhost:8889/api/v1/uploads/${categoryIndex}`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${tokens.accessToken}`,
                },
              }
            );
            if(response.status === 200) {
              console.log('Bạn đã request uploads thành công: ', response.data);
            }

          // Update the file list with the uploaded URLs
          const urls = response.data?.data?.urls || [];
          const updatedFileList = newFileList.map((file, index) => ({
            ...file,
            url: urls[index] || file.url,
          }))
          setFileList(updatedFileList)
          } else {
            alert('Bạn chưa chọn danh mục cho sản phẩm, hãy chọn danh mục trước khi upload ảnh')
          }
          
        } catch (error: any) {
          message.error(error.response?.data?.message || "Lỗi khi upload ảnh");
          console.error('upload ảnh thất bại:', error);
        }
      }
    },
    
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
  }

  const addContentBlock = (type: "text" | "image") => {
    const newBlock: ContentBlock = {
      type,
      content: type === "text" ? "" : undefined,
      src: type === "image" ? "" : undefined,
      alt: type === "image" ? "" : undefined,
    }
    setContentBlocks([...contentBlocks, newBlock])
  }

  const updateContentBlock = (index: number, field: string, value: string) => {
    const updatedBlocks = [...contentBlocks]
    updatedBlocks[index] = { ...updatedBlocks[index], [field]: value }
    setContentBlocks(updatedBlocks)
  }

  const removeContentBlock = (index: number) => {
    const updatedBlocks = [...contentBlocks]
    updatedBlocks.splice(index, 1)
    setContentBlocks(updatedBlocks)
  }

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "images",
      width: 150,
      render: (images: string[]) => (
        <div className="flex gap-2">
          {images.slice(0, 2).map((image, index) => (
            <Image
              key={index}
              src={image || "/placeholder.svg"}
              alt={`Product ${index + 1}`}
              width={50}
              height={50}
              className="object-cover rounded-md border border-gray-200"
              fallback="/placeholder.svg?height=50&width=50"
              preview={{ mask: <SearchOutlined /> }}
            />
          ))}
          {images.length > 2 && (
            <div className="w-[50px] h-[50px] bg-gray-100 flex items-center justify-center rounded-md border border-gray-200">
              <span className="text-xs text-gray-500">+{images.length - 2}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "product_name",
      key: "product_name",
      width: 200,
      sorter: (a: Product, b: Product) => a.product_name.localeCompare(b.product_name),
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Danh Mục",
      dataIndex: ["category", "category_name"],
      key: "category",
      width: 150,
      render: (text: string) => <span className="text-blue-600">{text || ""}</span>,
    },
    {
      title: "Thương Hiệu",
      dataIndex: ["brand", "brand_name"],
      key: "brand",
      width: 150,
      render: (text: string) => <span>{text || ""}</span>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      sorter: (a: Product, b: Product) => a.price - b.price,
      render: (price: number, record: Product) => (
        <div>
          <span className="font-medium text-blue-600">{formatCurrency(price)}</span>
          {record.salePrice && record.salePrice < price && (
            <div className="text-xs text-red-500 line-through">{formatCurrency(record.salePrice)}</div>
          )}
        </div>
      ),
    },
    {
      title: "Số Lượng",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      sorter: (a: Product, b: Product) => a.stock - b.stock,
    },
    {
      title: "Đánh Giá",
      dataIndex: "rating",
      key: "rating",
      width: 150,
      render: (rating: number, record: Product) => (
        <div>
          <Rate disabled defaultValue={rating} className="text-sm" />
          <div className="text-xs text-gray-500">({record.reviewCount} đánh giá)</div>
        </div>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (isActive: boolean) => (
        <Tag color={isActive ? "success" : "error"} className="px-3 py-1">
          {isActive ? "Hoạt động" : "Ngừng hoạt động"}
        </Tag>
      ),
      filters: [
        { text: "Hoạt động", value: true },
        { text: "Ngừng hoạt động", value: false },
      ],
      onFilter: (value: string | boolean | number | bigint, record: Product) => record.isActive === value,
    },
    {
      title: "Khuyến Mãi",
      key: "promotions",
      width: 150,
      render: (_: any, record: Product) => (
        <Space>
          {record.bestSale && (
            <Tag color="orange" icon={<FireOutlined />}>
              Best Sale
            </Tag>
          )}
          {record.flashSale && (
            <Tag color="red" icon={<ThunderboltOutlined />}>
              Flash Sale
            </Tag>
          )}
        </Space>
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
      render: (_: any, record: Product) =>
        isAdmin ? (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditProduct(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              Sửa
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteProduct(record._id)}
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
          Quản Lý Sản Phẩm
        </Title>
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddProduct}
              className="rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Thêm Mới Sản Phẩm
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
            placeholder="Tìm kiếm theo tên sản phẩm"
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
            Tìm kiếm
          </Button>
        </Space>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={products}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} products</span>,
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
        title={selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm mới sản phẩm"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ loading: saving, className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ disabled: saving, className: "rounded-md" }}
        width={900}
        className="p-4"
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="mt-4">
          <TabPane tab="Thông tin cơ bản" key="1">
            <Form form={form} layout="vertical" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="product_name"
                  label="Tên Sản Phẩm"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên sản phẩm!" },
                    { max: 255, message: "Tên sản phẩm không được vượt quá 255 ký tự!" },
                  ]}
                >
                  <Input className="rounded-md" />
                </Form.Item>

                <Form.Item
                  name="slug"
                  label="Slug"
                  tooltip="Để trống để tự động tạo từ tên sản phẩm"
                  rules={[{ max: 300, message: "Slug không được vượt quá 300 ký tự!" }]}
                >
                  <Input className="rounded-md" />
                </Form.Item>
              </div>

              <Form.Item
                name="description"
                label="Mô Tả"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả!" },
                  { max: 2000, message: "Mô tả không được vượt quá 2000 ký tự!" },
                ]}
              >
                <TextArea rows={4} className="rounded-md" />
              </Form.Item>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name="category"
                  label="Danh Mục"
                  rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
                >
                  <Select
                    placeholder="Chọn danh mục"
                    options={categories.map((cat) => ({
                      value: cat._id,
                      label: cat.category_name,
                    }))}
                    className="rounded-md"
                    onChange={(value) => {
                      const category = categories.find((cat) => cat._id === value);
                      // Kiểm tra nếu category tồn tại
                      if (category) {
                        setCategoryIndex(category.category_name);
                      } else {
                        console.error("Không tìm thấy category với _id:", value);
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="brand"
                  label="Thương Hiệu"
                  rules={[{ required: true, message: "Vui lòng chọn thương hiệu!" }]}
                >
                  <Select
                    placeholder="Chọn thương hiệu"
                    options={brands.map((brand) => ({
                      value: brand._id,
                      label: brand.brand_name,
                    }))}
                    className="rounded-md"
                  />
                </Form.Item>

                <Form.Item
                  name="vendor"
                  label="Nhà Cung Cấp"
                  rules={[{ required: true, message: "Vui lòng chọn nhà cung cấp!" }]}
                >
                  <Select
                    placeholder="Chọn nhà cung cấp"
                    options={vendors.map((vendor) => ({
                      value: vendor._id,
                      label: vendor.companyName,
                    }))}
                    className="rounded-md"
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name="price"
                  label="Giá Gốc"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá!" },
                    { type: "number", min: 0, message: "Giá phải lớn hơn hoặc bằng 0!" },
                  ]}
                >
                  <InputNumber
                    min={0}
                    className="w-full rounded-md"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value: string | undefined) => value ? parseFloat(value.replace(/\$\s?|(,*)/g, "")) : 0}
                    addonAfter="VND"
                  />
                </Form.Item>

                <Form.Item
                  name="salePrice"
                  label="Giá Khuyến Mãi"
                  rules={[
                    { required: true, message: "Vui lòng nhập giá khuyến mãi!" },
                    { type: "number", min: 0, message: "Giá khuyến mãi phải lớn hơn hoặc bằng 0!" },
                  ]}
                >
                  <InputNumber
                    min={0}
                    className="w-full rounded-md"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value: string | undefined) => value ? parseFloat(value.replace(/\$\s?|(,*)/g, "")) : 0}
                    addonAfter="VND"
                  />
                </Form.Item>

                <Form.Item
                  name="stock"
                  label="Số Lượng"
                  rules={[
                    { required: true, message: "Vui lòng nhập số lượng!" },
                    { type: "number", min: 0, max: 100, message: "Số lượng phải từ 0 đến 100!" },
                  ]}
                >
                  <InputNumber min={0} max={100} className="w-full rounded-md" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item name="isActive" label="Trạng Thái" valuePropName="checked">
                  <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng hoạt động" />
                </Form.Item>

                <Form.Item name="bestSale" label="Best Sale" valuePropName="checked">
                  <Switch checkedChildren="Có" unCheckedChildren="Không" />
                </Form.Item>

                <Form.Item name="flashSale" label="Flash Sale" valuePropName="checked">
                  <Switch checkedChildren="Có" unCheckedChildren="Không" />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item name="tags" label="Tags" tooltip="Nhập các tags, cách nhau bằng dấu phẩy">
                  <Input placeholder="Ví dụ: laptop, gaming, msi" className="rounded-md" prefix={<TagsOutlined />} />
                </Form.Item>

                <Form.Item
                  name="promotion"
                  label="Khuyến Mãi"
                  tooltip="Nhập các khuyến mãi, cách nhau bằng dấu phẩy"
                >
                  <Input
                    placeholder="Ví dụ: Tặng chuột, Giảm 10%, Trả góp 0%"
                    className="rounded-md"
                    prefix={<TagsOutlined />}
                  />
                </Form.Item>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="rating"
                  label="Đánh Giá"
                  rules={[
                    { type: "number", min: 0, max: 5, message: "Đánh giá phải từ 0 đến 5!" },
                    { required: true, message: "Vui lòng nhập đánh giá!" },
                  ]}
                >
                  <Rate allowHalf />
                </Form.Item>

                <Form.Item
                  name="reviewCount"
                  label="Số Lượng Đánh Giá"
                  rules={[
                    { type: "number", min: 0, message: "Số lượng đánh giá phải lớn hơn hoặc bằng 0!" },
                    { required: true, message: "Vui lòng nhập số lượng đánh giá!" },
                  ]}
                >
                  <InputNumber min={0} className="w-full rounded-md" />
                </Form.Item>
              </div>
            </Form>
          </TabPane>

          <TabPane tab="Hình ảnh" key="2">
            <div className="mt-4">
              <Form.Item
                name="images"
                label="Ảnh Sản Phẩm"
                rules={[{ required: true, message: "Vui lòng chọn ít nhất một ảnh!" }]}
                className="mb-0"
              >
                <div className="border rounded-md p-4 bg-gray-50">
                  <Dragger {...uploadProps} className="rounded-md">
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined className="text-blue-500" />
                    </p>
                    <p className="ant-upload-text">Kéo thả ảnh vào đây hoặc nhấp để chọn</p>
                    <p className="ant-upload-hint text-xs text-gray-500">
                      Hỗ trợ định dạng: JPG, PNG, GIF. Kích thước tối đa: 2MB.
                    </p>
                  </Dragger>
                </div>
              </Form.Item>

              {fileList.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <div className="font-medium mb-2">Đã chọn {fileList.length} ảnh</div>
                  <div className="flex flex-wrap gap-2">
                    {fileList.map((file, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={file.url || URL.createObjectURL(file.originFileObj as Blob)}
                          alt={`Preview ${index}`}
                          width={80}
                          height={80}
                          className="object-cover rounded-md border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabPane>

          <TabPane tab="Nội dung chi tiết" key="3">
            <div className="mt-4">
              <div className="flex justify-between items-center mb-4">
                <div className="font-medium">Nội dung chi tiết sản phẩm</div>
                <Space>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => addContentBlock("text")}
                    className="rounded-md bg-blue-500 hover:bg-blue-600"
                  >
                    Thêm Văn Bản
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => addContentBlock("image")}
                    className="rounded-md bg-green-500 hover:bg-green-600"
                  >
                    Thêm Hình Ảnh
                  </Button>
                </Space>
              </div>

              {contentBlocks.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-md border border-dashed border-gray-300">
                  <p className="text-gray-500">Chưa có nội dung chi tiết. Vui lòng thêm văn bản hoặc hình ảnh.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contentBlocks.map((block, index) => (
                    <div key={index} className="border rounded-md p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">
                          {block.type === "text" ? "Nội dung văn bản" : "Nội dung hình ảnh"} #{index + 1}
                        </div>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeContentBlock(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Xóa
                        </Button>
                      </div>

                      {block.type === "text" ? (
                        <TextArea
                          rows={4}
                          value={block.content}
                          onChange={(e) => updateContentBlock(index, "content", e.target.value)}
                          placeholder="Nhập nội dung văn bản"
                          className="rounded-md"
                        />
                      ) : (
                        <div className="space-y-2">
                          <Input
                            value={block.src}
                            onChange={(e) => updateContentBlock(index, "src", e.target.value)}
                            placeholder="URL hình ảnh"
                            className="rounded-md"
                          />
                          <Input
                            value={block.alt}
                            onChange={(e) => updateContentBlock(index, "alt", e.target.value)}
                            placeholder="Mô tả hình ảnh (alt)"
                            className="rounded-md"
                          />
                          {block.src && (
                            <div className="mt-2">
                              <Image
                                src={block.src || "/placeholder.svg"}
                                alt={block.alt || "Preview"}
                                width={200}
                                className="object-cover rounded-md border border-gray-200"
                                fallback="/placeholder.svg?height=200&width=200"
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabPane>
        </Tabs>
      </Modal>
    </div>
  )
}

export default ProductsPage