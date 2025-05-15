"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, Button, Space, Modal, Form, Input, message, Switch, Typography } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EnvironmentOutlined } from "@ant-design/icons"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { Search } = Input
const { TextArea } = Input

interface Location {
  _id: string
  name: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const LocationPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [locations, setLocations] = useState<Location[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const isAdmin = user?.roles === "admin"

  useEffect(() => {
    fetchLocations()
  }, [tokens?.accessToken, pagination.page, pagination.limit])

  const fetchLocations = async (search = "") => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/locations", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          ...(search ? { name: search } : {}),
        },
      })

      setLocations(response.data.data.locations)
      setPagination(response.data.data.pagination)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách địa điểm")
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

  const handleAddLocation = () => {
    setSelectedLocation(null)
    form.resetFields()
    form.setFieldsValue({
      isActive: true,
      country: "Việt Nam",
    })
    setIsModalOpen(true)
  }

  const handleEditLocation = (location: Location) => {
    setSelectedLocation(location)
    form.setFieldsValue({
      name: location.name,
      addressLine1: location.addressLine1,
      addressLine2: location.addressLine2,
      city: location.city,
      state: location.state,
      postalCode: location.postalCode,
      country: location.country,
      isActive: location.isActive,
    })
    setIsModalOpen(true)
  }

  const handleDeleteLocation = (locationId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa địa điểm này?",
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
          await axios.delete(`http://localhost:8889/api/v1/locations/${locationId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa địa điểm thành công")
          fetchLocations(searchTerm)
        } catch (error: any) {
          handleError(error, "Lỗi khi xóa địa điểm")
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

      if (selectedLocation) {
        await axios.put(`http://localhost:8889/api/v1/locations/${selectedLocation._id}`, values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success("Cập nhật địa điểm thành công")
      } else {
        await axios.post("http://localhost:8889/api/v1/locations", values, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success("Tạo mới địa điểm thành công")
      }

      setIsModalOpen(false)
      fetchLocations(searchTerm)
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý địa điểm")
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
    fetchLocations(value)
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

  const getFullAddress = (record: Location) => {
    const parts = [
      record.addressLine1,
      record.addressLine2,
      record.city,
      record.state,
      record.postalCode,
      record.country,
    ].filter(Boolean)
    return parts.join(", ")
  }

  const columns = [
    {
      title: "Tên Địa Điểm",
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: (a: Location, b: Location) => a.name.localeCompare(b.name),
      render: (name: string) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Địa Chỉ",
      dataIndex: "addressLine1",
      key: "addressLine1",
      width: 300,
      render: (_: string, record: Location) => (
        <div className="text-sm">
          <div>{record.addressLine1}</div>
          {record.addressLine2 && <div>{record.addressLine2}</div>}
        </div>
      ),
    },
    {
      title: "Thành Phố",
      dataIndex: "city",
      key: "city",
      width: 150,
    },
    {
      title: "Tỉnh/Thành",
      dataIndex: "state",
      key: "state",
      width: 150,
    },
    {
      title: "Mã Bưu Chính",
      dataIndex: "postalCode",
      key: "postalCode",
      width: 120,
    },
    {
      title: "Quốc Gia",
      dataIndex: "country",
      key: "country",
      width: 120,
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
      render: (_: any, record: Location) =>
        isAdmin ? (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditLocation(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              Sửa
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteLocation(record._id)}
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
          <EnvironmentOutlined className="mr-2" /> Quản Lý Địa Điểm
        </Title>
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddLocation}
              className="rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Thêm Mới Địa Điểm
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
            placeholder="Tìm kiếm theo tên địa điểm"
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
          dataSource={locations}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalRecord,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} locations</span>,
            className: "ant-table-pagination",
          }}
          onChange={handleTableChange}
          rowKey="_id"
          bordered
          className="bg-white rounded-md shadow-sm"
          rowClassName="hover:bg-gray-50 transition-colors"
          scroll={{ x: "max-content" }}
          expandable={{
            expandedRowRender: (record) => (
              <div className="p-4 bg-gray-50">
                <p className="font-medium mb-2">Địa chỉ đầy đủ:</p>
                <p>{getFullAddress(record)}</p>
              </div>
            ),
            rowExpandable: (record) => true,
          }}
        />
      </div>

      <Modal
        title={selectedLocation ? "Chỉnh sửa địa điểm" : "Thêm mới địa điểm"}
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
            name="name"
            label="Tên Địa Điểm"
            rules={[
              { required: true, message: "Vui lòng nhập tên địa điểm" },
              { min: 1, message: "Tên địa điểm phải có ít nhất 1 ký tự" },
              { max: 100, message: "Tên địa điểm không được vượt quá 100 ký tự" },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="addressLine1"
            label="Địa Chỉ 1"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ 1" },
              { max: 255, message: "Địa chỉ không được vượt quá 255 ký tự" },
            ]}
          >
            <TextArea rows={2} className="rounded-md" />
          </Form.Item>

          <Form.Item name="addressLine2" label="Địa Chỉ 2">
            <TextArea rows={2} className="rounded-md" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="city"
              label="Thành Phố"
              rules={[
                { required: true, message: "Vui lòng nhập thành phố" },
                { max: 100, message: "Tên thành phố không được vượt quá 100 ký tự" },
              ]}
            >
              <Input className="rounded-md" />
            </Form.Item>

            <Form.Item name="state" label="Tỉnh/Thành">
              <Input className="rounded-md" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="postalCode"
              label="Mã Bưu Chính"
              rules={[
                { required: true, message: "Vui lòng nhập mã bưu chính" },
                { max: 20, message: "Mã bưu chính không được vượt quá 20 ký tự" },
              ]}
            >
              <Input className="rounded-md" />
            </Form.Item>

            <Form.Item
              name="country"
              label="Quốc Gia"
              rules={[
                { required: true, message: "Vui lòng nhập quốc gia" },
                { max: 100, message: "Tên quốc gia không được vượt quá 100 ký tự" },
              ]}
            >
              <Input className="rounded-md" />
            </Form.Item>
          </div>

          <Form.Item name="isActive" label="Trạng Thái" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" className="bg-gray-300" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default LocationPage

