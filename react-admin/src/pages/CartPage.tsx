"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, Button, Space, Modal, Form, message, Select, InputNumber, Typography, Input } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ShoppingCartOutlined } from "@ant-design/icons"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { Search } = Input

interface Cart {
  _id: string
  items: Array<{
    product: {
      _id: string
      product_name: string
      price: number
      sale_price: number
    }
    quantity: number
    currentPrice: number
    currentSalePrice: number
    totalAmount: number
  }>
  totalAmount: number
  user: {
    _id: string
    userName: string
    fullName: string
  }
  createdAt: string
  updatedAt: string
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [carts, setCarts] = useState<Cart[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [products, setProducts] = useState<any[]>([])
  const [selectedProductKeys, setSelectedProductKeys] = useState<string[]>([])
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])

  const isAdmin = user?.roles === "admin"

  useEffect(() => {
    fetchCarts()
    fetchUsers()
    fetchProducts()
  }, [tokens?.accessToken, pagination.page, pagination.limit])

  useEffect(() => {
    // Tự động cập nhật tổng tiền khi sản phẩm hoặc số lượng thay đổi
    const total = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0)
    form.setFieldsValue({ totalAmount: total })
  }, [selectedProducts, form])

  const fetchCarts = async (search = "") => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/carts", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          ...(search ? { userName: search } : {}),
        },
      })

      setCarts(response.data.data.carts)
      setPagination(response.data.data.pagination)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách giỏ hàng")
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      const response = await axios.get("http://localhost:8889/api/v1/users", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })

      setUsers(response.data.data.users)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách người dùng")
    }
  }

  const fetchProducts = async () => {
    try {
      if (!tokens?.accessToken) return
      const response = await axios.get("http://localhost:8889/api/v1/products", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })
      setProducts(response.data.data.products)
    } catch (error) {
      message.error("Lỗi khi lấy danh sách sản phẩm")
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

  const handleAddCart = () => {
    setSelectedCart(null)
    form.resetFields()
    setSelectedProductKeys([])
    setSelectedProducts([])
    setIsModalOpen(true)
  }

  const handleEditCart = (cart: Cart) => {
  console.log('Editing cart:', cart)
  if (!cart.user || !cart.user._id) {
    message.error('Không thể chỉnh sửa giỏ hàng: Thông tin người dùng không hợp lệ')
    return
  }

  if (!cart.items || cart.items.length === 0) {
    message.error('Không thể chỉnh sửa giỏ hàng: Không có sản phẩm')
    return
  }

  // Check if all required product information exists
  const hasInvalidItems = cart.items.some(item => {
    const hasInvalidProduct = !item.product || !item.product._id || !item.product.product_name || !item.product.price
    if (hasInvalidProduct) {
      message.error('Không thể chỉnh sửa giỏ hàng: Thông tin sản phẩm không hợp lệ')
      return true
    }
    return false
  })

  if (hasInvalidItems) {
    return
  }
    setSelectedCart(cart)
    form.setFieldsValue({
      user: cart.user._id,
      totalAmount: cart.totalAmount,
    })
    setSelectedProductKeys(cart.items.map((item) => item.product._id))
    setSelectedProducts(
      cart.items.map((item) => ({
        key: item.product._id,
        productId: item.product._id,
        product_name: item.product.product_name,
        price: item.product.price,
        sale_price: item.product.sale_price,
        quantity: item.quantity,
      })),
    )
    setIsModalOpen(true)
  }

  const handleDeleteCart = (cartId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa giỏ hàng này?",
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
          await axios.delete(`http://localhost:8889/api/v1/carts/${cartId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa giỏ hàng thành công")
          fetchCarts(searchTerm)
        } catch (error: any) {
          handleError(error, "Lỗi khi xóa giỏ hàng")
        } finally {
          setLoading(false)
        }
      },
    })
  }

  const handleProductSelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]) => {
    const newSelectedProducts = selectedRows.map((row) => ({
      key: row._id,
      productId: row._id,
      product_name: row.product_name,
      price: row.price,
      sale_price: row.sale_price,
      quantity: 1,
    }))
    setSelectedProductKeys(selectedRowKeys as string[])
    setSelectedProducts(newSelectedProducts)
  }

  const handleProductQuantityChange = (productId: string, quantity: number) => {
    setSelectedProducts((prev) => prev.map((p) => (p.productId === productId ? { ...p, quantity } : p)))
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

      if (selectedProducts.length === 0) {
        throw new Error("Vui lòng chọn ít nhất một sản phẩm")
      }
      for (const p of selectedProducts) {
        if (!p.quantity || p.quantity <= 0) {
          throw new Error(`Số lượng sản phẩm "${p.name}" phải lớn hơn 0`)
        }
      }

      const calculatedTotal = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const totalAmount = Number.parseFloat(values.totalAmount)
      if (isNaN(totalAmount) || totalAmount <= 0) {
        throw new Error("Tổng tiền phải là số dương")
      }
      if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
        throw new Error("Tổng tiền không khớp với tổng giá trị các sản phẩm")
      }

      const items = selectedProducts.map((p) => ({
        product: {
          _id: p.productId,
          product_name: p.product_name,
          price: p.price,
          sale_price: p.sale_price,
        },
        quantity: p.quantity,
        currentPrice: p.price,
        currentSalePrice: p.sale_price || p.price,
        totalAmount: p.price * p.quantity,
      }))

      const data = {
        user: values.user,
        items,
        totalAmount,
      }

      if (selectedCart) {
        await axios.put(`http://localhost:8889/api/v1/carts/${selectedCart._id}`, data, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Cập nhật giỏ hàng thành công")
      } else {
        await axios.post("http://localhost:8889/api/v1/carts", data, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Tạo mới giỏ hàng thành công")
      }

      setIsModalOpen(false)
      fetchCarts(searchTerm)
    } catch (error: any) {
      console.error("Error:", error)
      if (error.message) {
        message.error(error.message)
      } else if (error.response?.data?.message) {
        message.error(error.response.data.message)
      } else {
        message.error("Lỗi khi xử lý giỏ hàng")
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

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setPagination({ ...pagination, page: 1 })
    fetchCarts(value)
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

  const columns = [
    {
      title: "Người Dùng",
      dataIndex: ["user", "userName"],
      key: "user",
      width: 150,
      render: (text: string, record: Cart) => {
        if (!record.user) return <span>Không xác định</span>;
        return (
          <span>
            {record.user.fullName || 'Không có tên'} ({text})
          </span>
        );
      },
    },
    {
      title: "Sản Phẩm",
      dataIndex: "items",
      key: "items",
      width: 300,
      render: (items: any) => {
        if (!Array.isArray(items)) return null
        return (
          <div className="space-y-2">
            {items.map((item: any) => {
              const productName = item.product?.product_name || "Unknown"
              const quantity = item.quantity || 0

              return (
                <div key={item.product?._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <span className="font-medium">{productName}</span>
                    <span className="ml-2 text-gray-500">x {quantity}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )
      },
    },
    {
      title: "Giá Sản Phẩm",
      dataIndex: "items",
      key: "prices",
      width: 200,
      render: (items: any) => {
        if (!Array.isArray(items)) return null
        return (
          <div className="space-y-2">
            {items.map((item: any) => {
              const price = item.currentPrice || item.price || 0
              const salePrice = item.currentSalePrice || item.sale_price || price

              return (
                <div key={item.product?._id} className="border-b pb-2">
                  <div className="text-sm">
                    <div>Giá: {formatCurrency(price)}</div>
                    <div className="text-red-500">KM: {formatCurrency(salePrice)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      },
    },
    {
      title: "Tổng Tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (amount: number) => <span className="font-medium text-blue-600">{formatCurrency(amount)}</span>,
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
      render: (_: any, record: Cart) =>
        isAdmin ? (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditCart(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              Sửa
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteCart(record._id)}
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
          <ShoppingCartOutlined className="mr-2" /> Quản Lý Giỏ Hàng
        </Title>
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddCart}
              className="rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Thêm Mới Giỏ Hàng
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
            placeholder="Tìm kiếm theo tên người dùng"
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
          dataSource={carts}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalRecord,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} carts</span>,
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
        title={selectedCart ? "Chỉnh sửa giỏ hàng" : "Thêm mới giỏ hàng"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ loading: saving, className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ disabled: saving, className: "rounded-md" }}
        width={800}
        className="p-4"
      >
        <Form form={form} layout="vertical" className="mt-4" initialValues={{ user: selectedCart?.user?._id }}>
          <Form.Item name="user" label="Người Dùng" rules={[{ required: true, message: "Vui lòng chọn người dùng" }]}>
            <Select
              disabled={!!selectedCart}
              placeholder="Chọn người dùng"
              className="rounded-md"
              options={users.map((user) => ({
                value: user._id,
                label: `${user.fullName} (${user.userName})`,
              }))}
            />
          </Form.Item>

          <div className="mb-6 border rounded-md p-4 bg-gray-50">
            <div className="font-medium text-lg mb-3">Chọn sản phẩm</div>
            <Table
              rowKey="_id"
              dataSource={products}
              columns={[
                {
                  title: "Tên sản phẩm",
                  dataIndex: "product_name",
                  key: "name",
                  width: "40%",
                  ellipsis: true,
                },
                {
                  title: "Giá",
                  dataIndex: "price",
                  key: "price",
                  width: "20%",
                  render: (price) => formatCurrency(price),
                },
                {
                  title: "Giá KM",
                  dataIndex: "sale_price",
                  key: "sale_price",
                  width: "20%",
                  render: (salePrice, record) => formatCurrency(salePrice || record.price),
                },
                {
                  title: "Số lượng",
                  key: "quantity",
                  width: "20%",
                  render: (_, record) => {
                    const selected = selectedProducts.find((p) => p.productId === record._id)
                    return (
                      <InputNumber
                        min={1}
                        value={selected ? selected.quantity : 1}
                        onChange={(val) => handleProductQuantityChange(record._id, val || 1)}
                        className="w-20 rounded-md"
                      />
                    )
                  },
                },
              ]}
              rowSelection={{
                type: "checkbox",
                selectedRowKeys: selectedProductKeys,
                onChange: handleProductSelectChange,
                getCheckboxProps: (record) => ({ disabled: false }),
              }}
              pagination={{ pageSize: 5 }}
              size="small"
              className="border rounded-md"
              scroll={{ y: 240 }}
            />
          </div>

          <Form.Item
            name="totalAmount"
            label="Tổng Tiền"
            rules={[{ required: true, message: "Vui lòng nhập tổng tiền" }]}
            initialValue={selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          >
            <div className="flex items-center w-full rounded-md bg-gray-50 p-2">
              <span className="flex-1 text-right">{formatCurrency(selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0))}</span>
              <span className="ml-2">VND</span>
            </div>
          </Form.Item>

          {selectedProducts.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <div className="font-medium mb-2">Sản phẩm đã chọn:</div>
              <div className="space-y-2">
                {selectedProducts.map((product) => (
                  <div key={product.productId} className="flex justify-between items-center">
                    <div>
                      {product.product_name} x {product.quantity}
                    </div>
                    <div className="text-blue-600 font-medium">{formatCurrency(product.price * product.quantity)}</div>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-medium">
                  <div>Tổng cộng:</div>
                  <div className="text-blue-600">
                    {formatCurrency(selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default CartPage
