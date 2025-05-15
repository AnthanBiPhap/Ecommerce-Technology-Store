"use client"

import type { ColumnsType } from "antd/es/table"
import type React from "react"
import { useState, useEffect } from "react"
import { Table, Button, Space, Modal, Form, Input, message, Select, Tag, Typography, InputNumber } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title } = Typography

interface ProductInventory {
  _id: string
  quantity: number
  reservedQuantity: number
  lowStockThreshold: number
  lastRestocked: string
  createdAt: string
  updatedAt: string
  product: {
    _id: string
    product_name: string
  }
  location: {
    _id: string
    name: string
  } | null
  status: "normal" | "low" | "out_of_stock"
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const ProductInventoriesPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [inventories, setInventories] = useState<ProductInventory[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedInventory, setSelectedInventory] = useState<ProductInventory | null>(null)
  const [searchText, setSearchText] = useState("")
  const [products, setProducts] = useState<{ _id: string; product_name: string }[]>([])
  const [locations, setLocations] = useState<{ _id: string; name: string }[]>([])

  useEffect(() => {
    fetchProducts()
    fetchLocations()
    fetchInventories()
  }, [tokens?.accessToken, pagination.page, pagination.limit, searchText])

  const fetchProducts = async () => {
    try {
      if (!tokens?.accessToken) return

      const response = await axios.get("http://localhost:8889/api/v1/products", {
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



  const fetchLocations = async () => {
    try {
      if (!tokens?.accessToken) return

      const response = await axios.get("http://localhost:8889/api/v1/locations", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: { limit: 100 },
      })

      setLocations(
        response.data.data.locations.map((l: any) => ({
          _id: l._id,
          name: l.name,
        })),
      )
    } catch (error) {
      console.error("Error fetching locations:", error)
    }
  }

  const fetchInventories = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/productiventories", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchText,
        },
      })

      // Transform the data to match our interface
      const transformedInventories = response.data.data.productIventories.map((inventory: any) => ({
        ...inventory,
        product: inventory.product || { _id: "", product_name: "" },
        location: inventory.location || { _id: "", name: "" },
        status: getStatus(inventory),
      }))

      setInventories(transformedInventories)
      setPagination(response.data.data.pagination)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách kho")
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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setSearchText(value)
  }

  const handleAddInventory = () => {
    setSelectedInventory(null)
    form.setFieldsValue({
      product: undefined,
      location: null,
      quantity: 0,
      reservedQuantity: 0,
      lowStockThreshold: 10, // Default threshold
      lastRestocked: new Date().toISOString().split('T')[0], // Today's date
    })
    setIsModalOpen(true)
  }

  const handleEditInventory = (inventory: ProductInventory) => {
    setSelectedInventory(inventory)
    form.setFieldsValue({
      product: inventory.product?._id || '',
      location: inventory.location?._id || null,
      quantity: inventory.quantity,
      reservedQuantity: inventory.reservedQuantity,
      lowStockThreshold: inventory.lowStockThreshold,
      lastRestocked: inventory.lastRestocked,
    })
    setIsModalOpen(true)
  }

  const handleDeleteInventory = (inventoryId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa mục này?",
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
          await axios.delete(`http://localhost:8889/api/v1/productiventories/${inventoryId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa mục thành công")
          fetchInventories()
        } catch (error: any) {
          handleError(error, "Lỗi khi xóa mục")
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
      
      // Prepare the data to send
      const { variant, ...inventoryData } = values;
      inventoryData.location = values.location || null; // Handle location if needed

      if (selectedInventory) {
        await axios.put(
          `http://localhost:8889/api/v1/productiventories/${selectedInventory._id}`,
          inventoryData,
          { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
        )
        message.success("Cập nhật mục thành công")
      } else {
        await axios.post(
          "http://localhost:8889/api/v1/productiventories",
          inventoryData,
          { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
        )
        message.success("Tạo mới mục thành công")
      }

      setIsModalOpen(false)
      fetchInventories()
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý mục")
    } finally {
      setSaving(false)
    }
  }

  const getStatus = (inventory: any) => {
    if (!inventory.quantity) return "normal"
    if (inventory.quantity <= 0) return "out_of_stock"
    if (inventory.quantity <= (inventory.lowStockThreshold || 0)) return "low"
    return "normal"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "out_of_stock":
        return "#ff4d4f"
      case "low":
        return "#faad14"
      default:
        return "#52c41a"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "out_of_stock":
        return "Hết Hàng"
      case "low":
        return "Kho Đầy"
      default:
        return "Bình Thường"
    }
  }

  const columns: ColumnsType<ProductInventory> = [
    {
      title: "Sản Phẩm",
      dataIndex: "product",
      key: "product",
      render: (product: any) => <span className="text-blue-500 font-semibold">{product.product_name}</span>,
      sorter: (a: ProductInventory, b: ProductInventory) =>
        a.product.product_name.localeCompare(b.product.product_name),
      sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[],
    },
    {
      title: "Kho",
      dataIndex: "location",
      key: "location",
      render: (location: any) => location?.name || "-",
      sorter: (a: ProductInventory, b: ProductInventory) =>
        (a.location?.name || "").localeCompare(b.location?.name || ""),
      sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[],
    },
    {
      title: "Tồn Kho",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number) => <span className="font-medium">{quantity} sản phẩm</span>,
      sorter: (a: ProductInventory, b: ProductInventory) => a.quantity - b.quantity,
      sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[],
    },
    {
      title: "Đã Đặt",
      dataIndex: "reservedQuantity",
      key: "reservedQuantity",
      render: (reservedQuantity: number) => <span>{reservedQuantity} sản phẩm</span>,
      sorter: (a: ProductInventory, b: ProductInventory) => a.reservedQuantity - b.reservedQuantity,
      sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[],
    },
    {
      title: "Ngưỡng Cảnh Báo",
      dataIndex: "lowStockThreshold",
      key: "lowStockThreshold",
      render: (threshold: number) => <span>{threshold} sản phẩm</span>,
      sorter: (a: ProductInventory, b: ProductInventory) => a.lowStockThreshold - b.lowStockThreshold,
      sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[],
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="text-center w-24 py-1">
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: "Bình Thường", value: "normal" },
        { text: "Kho Đầy", value: "low" },
        { text: "Hết Hàng", value: "out_of_stock" },
      ],
      onFilter: (value, record) => {
        if (typeof value === 'string') {
          return record.status === value
        }
        return false
      },
    },
    {
      title: "Lần Nhập Hàng Cuối",
      dataIndex: "lastRestocked",
      key: "lastRestocked",
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : "-"),
      sorter: (a: ProductInventory, b: ProductInventory) =>
        new Date(a.lastRestocked).getTime() - new Date(b.lastRestocked).getTime(),
      sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[],
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: ProductInventory) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditInventory(record)}
            className="text-blue-500 hover:text-blue-700"
          >
            Sửa
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteInventory(record._id)}
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
          Quản Lý Kho Hàng
        </Title>
        <Space>
          <Input
            placeholder="Tìm kiếm..."
            onChange={handleSearch}
            value={searchText}
            prefix={<SearchOutlined />}
            className="w-80 rounded-md"
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => fetchInventories()}
            className="rounded-md bg-blue-500 hover:bg-blue-600"
          >
            Tìm kiếm
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddInventory}
            className="rounded-md bg-blue-500 hover:bg-blue-600"
          >
            Thêm Mới Mục
          </Button>
        </Space>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={inventories}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalRecord,
            onChange: (page: number, pageSize: number) => {
              setPagination({ ...pagination, page, limit: pageSize })
            },
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} items</span>,
            className: "ant-table-pagination",
          }}
          rowKey="_id"
          bordered
          className="bg-white rounded-md shadow-sm"
          rowClassName="hover:bg-gray-50 transition-colors"
          scroll={{ x: "max-content" }}
        />
      </div>

      <Modal
        title={selectedInventory ? "Chỉnh sửa mục" : "Thêm mới mục"}
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
          <Form.Item name="product" label="Sản Phẩm" rules={[{ required: true, message: "Vui lòng chọn sản phẩm" }]}>
            <Select showSearch placeholder="Chọn sản phẩm" optionFilterProp="children" className="rounded-md">
              {products.map((p) => (
                <Select.Option key={p._id} value={p._id}>
                  {p.product_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="location" label="Kho">
            <Select showSearch placeholder="Chọn kho" optionFilterProp="children" className="rounded-md">
              {locations.map((l) => (
                <Select.Option key={l._id} value={l._id}>
                  {l.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Tồn Kho"
            rules={[{ required: true, message: "Vui lòng nhập số lượng tồn kho" }]}
          >
            <InputNumber min={0} className="w-full rounded-md" />
          </Form.Item>

          <Form.Item
            name="reservedQuantity"
            label="Đã Đặt"
            rules={[{ required: true, message: "Vui lòng nhập số lượng đã đặt" }]}
          >
            <InputNumber min={0} className="w-full rounded-md" />
          </Form.Item>

          <Form.Item
            name="lowStockThreshold"
            label="Ngưỡng Cảnh Báo"
            rules={[{ required: true, message: "Vui lòng nhập ngưỡng cảnh báo" }]}
          >
            <InputNumber min={0} className="w-full rounded-md" />
          </Form.Item>

          <Form.Item
            name="lastRestocked"
            label="Lần Nhập Hàng Cuối"
            rules={[{ required: false, message: "Vui lòng nhập ngày nhập hàng" }]}
          >
            <Input placeholder="Nhập ngày theo định dạng YYYY-MM-DD" className="rounded-md" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProductInventoriesPage
