"use client"

import type React from "react"
import { Table, Space, Input, Button, Modal, Form, message, Tag, DatePicker, Upload, Typography } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import axios from "axios"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../stores/useAuthStore"

const { Title } = Typography
const { TextArea } = Input
const { Dragger } = Upload

interface TechNew {
  _id: string
  title: string
  keyword: string
  thumbnail?: string
  description: string
  content: string
  date: Date
  createdAt: string
  updatedAt: string
}

interface TechNewFormValues {
  title: string
  keyword: string
  thumbnail?: string
  description: string
  content: string
  date: Date
}

const TechNewPage: React.FC = () => {
  const navigate = useNavigate()
  const { tokens } = useAuthStore()
  const [techNews, setTechNews] = useState<TechNew[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedTechNew, setSelectedTechNew] = useState<TechNew | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchTechNews()
  }, [pagination.current, pagination.pageSize])

  const fetchTechNews = async (search = "") => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...(search ? { title: search } : {}),
      }
      
      console.log('Fetching tech news with params:', params)
      const response = await axios.get("http://localhost:8889/api/v1/technews?limit=50", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params,
      })
      
      console.log('API Response:', response.data)
      
      setTechNews(response.data.data.techNews || [])
      setPagination({
        ...pagination,
        total: response.data.data.pagination?.total || 0,
      })
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách tin tức công nghệ")
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
    setPagination({ ...pagination, current: 1 })
    fetchTechNews(searchTerm)
  }

  const handleAddTechNew = () => {
    setSelectedTechNew(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEditTechNew = (techNew: TechNew) => {
    setSelectedTechNew(techNew)
    form.setFieldsValue({
      title: techNew.title,
      keyword: techNew.keyword,
      thumbnail: techNew.thumbnail,
      description: techNew.description,
      content: techNew.content,
      date: techNew.date ? new Date(techNew.date) : undefined,
    })
    setIsModalOpen(true)
  }

  const handleDeleteTechNew = async (techNewId: string) => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      await Modal.confirm({
        title: "Xác nhận xóa",
        content: "Bạn có chắc chắn muốn xóa tin tức này?",
        okText: "Xóa",
        okType: "danger",
        cancelText: "Hủy",
      })

      setLoading(true)
      await axios.delete(`http://localhost:8889/api/v1/technews/${techNewId}`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      })

      message.success("Xóa tin tức thành công")
      fetchTechNews(searchTerm)
    } catch (error: any) {
      handleError(error, "Lỗi khi xóa tin tức")
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

      setLoading(true)
      if (selectedTechNew) {
        await axios.put(`http://localhost:8889/api/v1/technews/${selectedTechNew._id}`, values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Cập nhật tin tức thành công")
      } else {
        await axios.post("http://localhost:8889/api/v1/technews", values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Tạo mới tin tức thành công")
      }

      setIsModalOpen(false)
      fetchTechNews(searchTerm)
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý tin tức")
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

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: 200,
      render: (text: string) => <div className="font-semibold">{text}</div>,
      sorter: (a: TechNew, b: TechNew) => a.title.localeCompare(b.title),
    },
    {
      title: "Keyword",
      dataIndex: "keyword",
      key: "keyword",
      width: 200,
      render: (keyword: string) => (
        <Tag color="blue" className="px-2 py-1">
          {keyword}
        </Tag>
      ),
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail: string) =>
        thumbnail ? (
          <img
            src={thumbnail || "/placeholder.svg"}
            alt="Thumbnail"
            className="w-12 h-12 object-cover rounded-md border border-gray-200"
            onError={(e) => {
              const img = e.target as HTMLImageElement
              img.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSJncmF5Ii8+PHRleHQgeD0iMjUiIHk9IjI1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjwvdGV4dD48L3N2Zz4="
            }}
          />
        ) : (
          <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-md">
            <span className="text-gray-500 text-xs">No Image</span>
          </div>
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      width: 300,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: Date) => (date ? formatDate(date.toString()) : "-"),
      sorter: (a: TechNew, b: TechNew) => new Date(a.date).getTime() - new Date(b.date).getTime(),
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
      render: (_: any, record: TechNew) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditTechNew(record)}
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTechNew(record._id)}
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
          Tech News Management
        </Title>
        <Space>
          <Input
            placeholder="Search by title"
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
            onClick={handleAddTechNew}
            className="rounded-md bg-blue-500 hover:bg-blue-600"
          >
            Add Tech News
          </Button>
        </Space>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={techNews}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} tech news</span>,
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
        title={selectedTechNew ? "Edit Tech News" : "Add Tech News"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ className: "rounded-md" }}
        width={800}
        className="p-4"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Title"
            rules={[
              { required: true, message: "Please enter title!" },
              { min: 2, message: "Title must be at least 2 characters!" },
              { max: 150, message: "Title cannot exceed 150 characters!" },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="keyword"
            label="Keyword"
            rules={[
              { required: true, message: "Please enter keyword!" },
              { min: 2, message: "Keyword must be at least 2 characters!" },
              { max: 50, message: "Keyword cannot exceed 50 characters!" },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="thumbnail"
            label="Thumbnail URL"
            rules={[{ max: 255, message: "URL cannot exceed 255 characters!" }]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter description!" },
              { max: 255, message: "Description cannot exceed 255 characters!" },
            ]}
          >
            <TextArea rows={3} className="rounded-md" />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true, message: "Please enter content!" }]}>
            <TextArea rows={6} className="rounded-md" />
          </Form.Item>
          <Form.Item name="date" label="Date">
            <DatePicker showTime style={{ width: "100%" }} className="rounded-md" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TechNewPage