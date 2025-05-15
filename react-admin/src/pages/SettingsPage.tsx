"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, Space, Input, Button, Modal, Form, message, Select, Tag, Switch, InputNumber, Typography } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import type { ColumnType } from "antd/es/table"
import type { Key } from "antd/es/table/interface"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { TextArea } = Input
const { Option } = Select

interface Setting {
  _id: string
  key: string
  value: string | number | boolean | object | any[]
  type: "string" | "number" | "boolean" | "object" | "array"
  group: string
  isPublic: boolean
  description?: string
  createdAt: string
  updatedAt: string
}



const SettingsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null)
  const [saving, setSaving] = useState(false)

  const isAdmin = user?.roles === "admin"

  useEffect(() => {
    fetchSettings()
  }, [pagination.current, pagination.pageSize, tokens?.accessToken])

  const fetchSettings = async (search = "") => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/settings", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          ...(search ? { key: search } : {}),
        },
      })

      setSettings(response.data.data.settings || [])
      setPagination({
        ...pagination,
        total: response.data.data.pagination?.total || 0,
      })
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách cài đặt")
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
    fetchSettings(searchTerm)
  }

  const handleAddSetting = () => {
    setSelectedSetting(null)
    form.resetFields()
    form.setFieldsValue({
      type: "string",
      isPublic: false,
    })
    setIsModalOpen(true)
  }

  const handleEditSetting = (setting: Setting) => {
    setSelectedSetting(setting)
    let value = setting.value
    if (setting.type === "object" || setting.type === "array") {
      value = JSON.stringify(value, null, 2)
    }

    form.setFieldsValue({
      key: setting.key,
      value,
      type: setting.type,
      group: setting.group,
      isPublic: setting.isPublic,
      description: setting.description,
    })
    setIsModalOpen(true)
  }

  const handleDeleteSetting = (settingId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa cài đặt này?",
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
          await axios.delete(`http://localhost:8889/api/v1/settings/${settingId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa cài đặt thành công")
          fetchSettings(searchTerm)
        } catch (error: any) {
          handleError(error, "Lỗi khi xóa cài đặt")
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

      // Process value based on type
      let processedValue = values.value
      try {
        if (values.type === "number") {
          processedValue = Number(values.value)
        } else if (values.type === "boolean") {
          processedValue = values.value === "true" || values.value === true
        } else if (values.type === "object") {
          processedValue = JSON.parse(values.value)
        } else if (values.type === "array") {
          processedValue = JSON.parse(values.value)
          if (!Array.isArray(processedValue)) {
            throw new Error("Value must be a valid array")
          }
        }
      } catch (error) {
        message.error(`Invalid format for type ${values.type}`)
        setSaving(false)
        return
      }

      const payload = {
        ...values,
        value: processedValue,
      }

      if (selectedSetting) {
        await axios.put(`http://localhost:8889/api/v1/settings/${selectedSetting._id}`, payload, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Cập nhật cài đặt thành công")
      } else {
        await axios.post("http://localhost:8889/api/v1/settings", payload, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })
        message.success("Tạo mới cài đặt thành công")
      }

      setIsModalOpen(false)
      fetchSettings(searchTerm)
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý cài đặt")
    } finally {
      setSaving(false)
    }
  }

  const handleTableChange = (newPagination: any) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    })
  }

  const renderValue = (value: any, type: string) => {
    switch (type) {
      case "string":
        return value
      case "number":
        return typeof value === "number" ? value : Number(value)
      case "boolean":
        return value ? "Yes" : "No"
      case "object":
        return typeof value === "object" ? JSON.stringify(value) : value
      case "array":
        return Array.isArray(value) ? value.join(", ") : value
      default:
        return value
    }
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

  const columns: Array<ColumnType<Setting>> = [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      width: 150,
      sorter: (a: Setting, b: Setting) => a.key.localeCompare(b.key),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: 250,
      render: (value: any, record: Setting) => renderValue(value, record.type),
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 120,
      render: (type: string) => (
        <Tag color={type === "boolean" ? "blue" : type === "object" || type === "array" ? "purple" : "green"}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Group",
      dataIndex: "group",
      key: "group",
      width: 150,
      sorter: (a: Setting, b: Setting) => a.group.localeCompare(b.group),
    },
    {
      title: "Public",
      dataIndex: "isPublic",
      key: "isPublic",
      width: 100,
      render: (isPublic: boolean) => (
        <Tag color={isPublic ? "green" : "red"} className="text-center w-16">
          {isPublic ? "Public" : "Private"}
        </Tag>
      ),
      filters: [
        { text: "Public", value: true },
        { text: "Private", value: false },
      ],
      onFilter: (value: boolean | Key, record: Setting) => record.isPublic === value,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_: any, record: Setting) =>
        isAdmin ? (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditSetting(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              Edit
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteSetting(record._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </Button>
          </Space>
        ) : null,
    },
  ]

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
        <Title level={3} className="m-0">
          Settings Management
        </Title>
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddSetting}
              className="rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Add Setting
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
            placeholder="Search by key"
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
        </Space>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={settings}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} settings</span>,
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
        title={selectedSetting ? "Edit Setting" : "Add Setting"}
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
            name="key"
            label="Key"
            rules={[
              { required: true, message: "Please enter key!" },
              { max: 100, message: "Maximum 100 characters!" },
            ]}
          >
            <Input disabled={!!selectedSetting} className="rounded-md" />
          </Form.Item>

          <Form.Item name="type" label="Type" rules={[{ required: true, message: "Please select type!" }]}>
            <Select
              className="rounded-md"
              onChange={(value) => {
                // Reset value when type changes
                form.setFieldsValue({ value: "" })
              }}
            >
              <Option value="string">String</Option>
              <Option value="number">Number</Option>
              <Option value="boolean">Boolean</Option>
              <Option value="object">Object</Option>
              <Option value="array">Array</Option>
            </Select>
          </Form.Item>

          <Form.Item name="value" label="Value" rules={[{ required: true, message: "Please enter value!" }]}>
            {form.getFieldValue("type") === "boolean" ? (
              <Select className="rounded-md">
                <Option value={true}>True</Option>
                <Option value={false}>False</Option>
              </Select>
            ) : form.getFieldValue("type") === "number" ? (
              <InputNumber className="w-full rounded-md" />
            ) : (
              <TextArea
                rows={4}
                className="rounded-md"
                placeholder={
                  form.getFieldValue("type") === "object"
                    ? '{"key": "value"}'
                    : form.getFieldValue("type") === "array"
                      ? '["item1", "item2"]'
                      : ""
                }
              />
            )}
          </Form.Item>

          <Form.Item
            name="group"
            label="Group"
            rules={[
              { required: true, message: "Please enter group!" },
              { max: 50, message: "Maximum 50 characters!" },
            ]}
          >
            <Input className="rounded-md" />
          </Form.Item>

          <Form.Item name="isPublic" label="Is Public" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="description" label="Description" rules={[{ max: 255, message: "Maximum 255 characters!" }]}>
            <TextArea rows={3} className="rounded-md" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SettingsPage
