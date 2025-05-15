"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, Button, Space, Modal, Form, Input, Select, Rate, message, Tag, Typography } from "antd"
import type { TableColumnType } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

interface Review {
  _id: string
  rating: number
  title?: string
  comment: string
  images?: string[]
  isVerified: boolean
  product: string | { _id: string; name: string; product_name: string }
  user: string | { _id: string; userName: string }
  createdAt: string
  updatedAt: string
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const ReviewPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [reviews, setReviews] = useState<Review[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState<Array<{ _id: string; product_name: string }>>([])
  const [users, setUsers] = useState<Array<{ _id: string; userName: string; fullName: string; email: string }>>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [tokens?.accessToken, pagination.page, pagination.limit])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!tokens?.accessToken) return

        setLoadingProducts(true)
        const productsRes = await axios.get("http://localhost:8889/api/v1/products", {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
          params: { limit: 1000 },
        })
        setProducts(productsRes.data.data.products || [])

        setLoadingUsers(true)
        const usersRes = await axios.get("http://localhost:8889/api/v1/users", {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
          params: { limit: 1000 },
        })
        setUsers(usersRes.data.data.users || [])
      } catch (error) {
        console.error("Error fetching data:", error)
        message.error("Không thể tải dữ liệu")
      } finally {
        setLoadingProducts(false)
        setLoadingUsers(false)
      }
    }

    fetchData()
  }, [tokens?.accessToken])

  const fetchReviews = async (search = "") => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/reviews", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          ...(search ? { comment: search } : {}),
        },
      })

      setReviews(response.data.data.reviews || response.data.data || [])
      setPagination(response.data.data.pagination || pagination)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách đánh giá")
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

  const handleSearch = () => {
    setPagination({ ...pagination, page: 1 })
    fetchReviews(searchTerm)
  }

  const handleAddReview = () => {
    setSelectedReview(null)
    form.resetFields()
    form.setFieldsValue({ rating: 5, isVerified: false })
    setIsModalOpen(true)
  }

  const handleEditReview = (review: Review) => {
    setSelectedReview(review)
    const productId = typeof review.product === "string" ? review.product : review.product?._id
    const userId = typeof review.user === "string" ? review.user : review.user?._id

    console.log("Product data:", review.product) // Añade este log para depuración

    form.setFieldsValue({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      images: Array.isArray(review.images) ? review.images.join(", ") : "",
      isVerified: review.isVerified,
      product: productId,
      user: userId,
    })
    setIsModalOpen(true)
  }

  const handleDeleteReview = (reviewId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa đánh giá này?",
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
          await axios.delete(`http://localhost:8889/api/v1/reviews/${reviewId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })
          message.success("Xóa đánh giá thành công")
          fetchReviews()
        } catch (error: any) {
          handleError(error, "Lỗi khi xóa đánh giá")
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
      const imagesArr = values.images ? values.images.split(",").map((img: string) => img.trim()) : []
      const body = { ...values, images: imagesArr }
      if (selectedReview) {
        await axios.put(`http://localhost:8889/api/v1/reviews/${selectedReview._id}`, body, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Cập nhật đánh giá thành công")
      } else {
        await axios.post("http://localhost:8889/api/v1/reviews", body, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Tạo mới đánh giá thành công")
      }
      setIsModalOpen(false)
      fetchReviews()
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý đánh giá")
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

  const columns: TableColumnType<Review>[] = [
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (value: number) => <Rate disabled value={value} />,
      sorter: (a: Review, b: Review) => a.rating - b.rating,
      sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[],
      width: 150,
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (title: string) => <span className="font-medium">{title || "-"}</span>,
      width: 150,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
      width: 250,
    },
    {
      title: "Images",
      dataIndex: "images",
      key: "images",
      render: (imgs: string[]) =>
        imgs && imgs.length ? (
          <div className="flex gap-2">
            {imgs.map((img, idx) => (
              <img
                key={idx}
                src={img || "/placeholder.svg"}
                alt="img"
                className="w-12 h-12 object-cover rounded-md border border-gray-200"
              />
            ))}
          </div>
        ) : (
          "-"
        ),
      width: 150,
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (v: boolean) =>
        v ? (
          <Tag color="green" className="text-center w-28 py-1 text-sm">
            Đã xác thực
          </Tag>
        ) : (
          <Tag color="red" className="text-center w-28 py-1 text-sm">
            Chưa xác thực
          </Tag>
        ),
      filters: [
        { text: "Đã xác thực", value: true },
        { text: "Chưa xác thực", value: false },
      ],
      onFilter: (value: string | number | boolean | React.Key, record: Review) => {
        return record.isVerified === (typeof value === "boolean" ? value : value === "true")
      },
      width: 150,
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
      render: (p: any) => <span className="text-blue-500">{typeof p === "object" ? p.product_name || p.name : p}</span>,
      width: 150,
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (u: any) => <span>{typeof u === "object" ? u.userName : u}</span>,
      width: 150,
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v: string) => new Date(v).toLocaleString(),
      sorter: (a: Review, b: Review) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      sortDirections: ["ascend", "descend"] as ("ascend" | "descend")[],
      width: 180,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Review) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditReview(record)}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteReview(record._id)}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </Button>
        </Space>
      ),
      width: 180,
    },
  ]

  return (
    <div className="p-6 max-w-full mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <Title level={3} className="m-0">
          Review Management
        </Title>
        <Space size="large">
          <Input
            placeholder="Search by comment"
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
            onClick={handleAddReview}
            className="rounded-md bg-blue-500 hover:bg-blue-600"
          >
            Add Review
          </Button>
        </Space>
      </div>

      <div className="overflow-x-auto">
        <Table
          dataSource={reviews}
          columns={columns}
          loading={loading}
          rowKey="_id"
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalRecord,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} reviews</span>,
            className: "ant-table-pagination",
          }}
          onChange={handleTableChange}
          bordered
          className="bg-white rounded-md shadow-sm"
          rowClassName="hover:bg-gray-50 transition-colors"
          scroll={{ x: 1500 }}
          size="large"
        />
      </div>

      <Modal
        title={selectedReview ? "Edit Review" : "Add Review"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        okButtonProps={{
          loading: saving,
          className: "rounded-md bg-blue-500 hover:bg-blue-600",
        }}
        cancelButtonProps={{
          disabled: saving,
          className: "rounded-md",
        }}
        width={700}
        className="p-4"
      >
        <Form form={form} layout="vertical" initialValues={{ rating: 5, isVerified: false }} className="mt-4">
          <Form.Item name="rating" label="Rating" rules={[{ required: true, message: "Please chọn số sao!" }]}>
            <Rate count={5} />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ max: 100, message: "Tối đa 100 ký tự!" }]}>
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="comment"
            label="Comment"
            rules={[
              { required: true, message: "Vui lòng nhập nhận xét!" },
              { max: 1000, message: "Tối đa 1000 ký tự!" },
            ]}
          >
            <TextArea rows={4} className="rounded-md" />
          </Form.Item>
          <Form.Item name="images" label="Images (nhập nhiều link, ngăn cách dấu phẩy)">
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item name="isVerified" label="Verified">
            <Select className="rounded-md">
              <Option value={true}>Đã xác thực</Option>
              <Option value={false}>Chưa xác thực</Option>
            </Select>
          </Form.Item>
          <Form.Item name="product" label="Sản phẩm" rules={[{ required: true, message: "Vui lòng chọn sản phẩm!" }]}>
            <Select
              showSearch
              placeholder="Chọn sản phẩm"
              optionFilterProp="children"
              loading={loadingProducts}
              className="rounded-md"
              filterOption={(input, option) => {
                const children = option?.children as React.ReactNode
                const label = Array.isArray(children) ? children.join("") : String(children || "")
                return label.toLowerCase().includes(input.toLowerCase())
              }}
            >
              {products.map((product) => (
                <Option key={product._id} value={product._id}>
                  {product.product_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="user" label="Người dùng" rules={[{ required: true, message: "Vui lòng chọn người dùng!" }]}>
            <Select
              showSearch
              placeholder="Chọn người dùng"
              optionFilterProp="children"
              loading={loadingUsers}
              className="rounded-md"
              filterOption={(input, option) => {
                const children = option?.children as React.ReactNode
                const label = Array.isArray(children) ? children.join("") : String(children || "")
                return label.toLowerCase().includes(input.toLowerCase())
              }}
            >
              {users.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.fullName || user.userName} ({user.email})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ReviewPage
