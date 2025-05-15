"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Table, Button, Space, Modal, Form, Input, message, Switch, Select, Typography, Tag, Divider } from "antd"
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CreditCardOutlined,
  BankOutlined,
} from "@ant-design/icons"
import axios from "axios"
import { useAuthStore } from "../stores/useAuthStore"
import { useNavigate } from "react-router-dom"

const { Title } = Typography
const { Search } = Input
const { TextArea } = Input
const { Option } = Select

interface PaymentMethod {
  _id: string
  type: "credit_card" | "paypal" | "bank_account"
  provider: string
  accountNumber: string
  expiryDate: string
  cardholderName: string
  billingAddress: {
    fullName: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  isDefault: boolean
  metadata: any
  user: {
    _id: string
    userName: string
  }
  createdAt: string
  updatedAt: string
}

interface Pagination {
  totalRecord: number
  limit: number
  page: number
}

const PaymentMethodsPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, tokens } = useAuthStore()
  const [form] = Form.useForm()

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [pagination, setPagination] = useState<Pagination>({ totalRecord: 0, limit: 10, page: 1 })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [users, setUsers] = useState<{ _id: string; userName: string }[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const isAdmin = user?.roles === "admin"

  useEffect(() => {
    fetchPaymentMethods()
  }, [tokens?.accessToken, pagination.page, pagination.limit])

  const fetchPaymentMethods = async (search = "") => {
    try {
      if (!tokens?.accessToken) {
        message.error("Vui lòng đăng nhập để tiếp tục")
        navigate("/login")
        return
      }

      setLoading(true)
      const response = await axios.get("http://localhost:8889/api/v1/paymentmethods", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: {
          page: pagination.page,
          limit: pagination.limit,
          ...(search ? { provider: search } : {}),
        },
      })

      setPaymentMethods(response.data.data.paymentMethods)
      setPagination(response.data.data.pagination)
    } catch (error: any) {
      handleError(error, "Lỗi khi lấy danh sách phương thức thanh toán")
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

  const handleAddPaymentMethod = () => {
    setSelectedPaymentMethod(null)
    form.resetFields()
    fetchUsers()
    setIsModalOpen(true)
  }

  const handleEditPaymentMethod = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod)
    form.setFieldsValue({
      type: paymentMethod.type,
      provider: paymentMethod.provider,
      accountNumber: paymentMethod.accountNumber,
      expiryDate: paymentMethod.expiryDate,
      cardholderName: paymentMethod.cardholderName,
      ["billingAddress.fullName"]: paymentMethod.billingAddress?.fullName || "",
      ["billingAddress.addressLine1"]: paymentMethod.billingAddress?.addressLine1 || "",
      ["billingAddress.addressLine2"]: paymentMethod.billingAddress?.addressLine2 || "",
      ["billingAddress.city"]: paymentMethod.billingAddress?.city || "",
      ["billingAddress.state"]: paymentMethod.billingAddress?.state || "",
      ["billingAddress.postalCode"]: paymentMethod.billingAddress?.postalCode || "",
      ["billingAddress.country"]: paymentMethod.billingAddress?.country || "",
      isDefault: paymentMethod.isDefault,
      metadata: JSON.stringify(paymentMethod.metadata || {}),
      user: paymentMethod.user?._id || "",
    })
    fetchUsers()
    setIsModalOpen(true)
  }

  const handleDeletePaymentMethod = (paymentMethodId: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa phương thức thanh toán này?",
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
          await axios.delete(`http://localhost:8889/api/v1/paymentmethods/${paymentMethodId}`, {
            headers: { Authorization: `Bearer ${tokens.accessToken}` },
          })

          message.success("Xóa phương thức thanh toán thành công")
          fetchPaymentMethods(searchTerm)
        } catch (error: any) {
          handleError(error, "Lỗi khi xóa phương thức thanh toán")
        } finally {
          setLoading(false)
        }
      },
    })
  }

  const fetchUsers = async () => {
    try {
      if (!tokens?.accessToken) return
      const res = await axios.get("http://localhost:8889/api/v1/users", {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
        params: { page: 1, limit: 100 },
      })
      setUsers(res.data.data.users)
    } catch {}
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
      let metadata = values.metadata
      if (typeof metadata === "string") {
        try {
          metadata = metadata ? JSON.parse(metadata) : {}
        } catch {
          metadata = {}
        }
      }

      const billingAddress = {
        fullName: values["billingAddress.fullName"],
        addressLine1: values["billingAddress.addressLine1"],
        addressLine2: values["billingAddress.addressLine2"],
        city: values["billingAddress.city"],
        state: values["billingAddress.state"],
        postalCode: values["billingAddress.postalCode"],
        country: values["billingAddress.country"],
      }

      const payload = {
        type: values.type,
        provider: values.provider,
        accountNumber: values.accountNumber,
        expiryDate: values.expiryDate,
        cardholderName: values.cardholderName,
        billingAddress,
        isDefault: values.isDefault,
        metadata,
        user: values.user,
      }

      if (selectedPaymentMethod) {
        await axios.put(`http://localhost:8889/api/v1/paymentmethods/${selectedPaymentMethod._id}`, payload, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success("Cập nhật phương thức thanh toán thành công")
      } else {
        await axios.post("http://localhost:8889/api/v1/paymentmethods", payload, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        })

        message.success("Tạo mới phương thức thanh toán thành công")
      }

      setIsModalOpen(false)
      fetchPaymentMethods(searchTerm)
    } catch (error: any) {
      handleError(error, "Lỗi khi xử lý phương thức thanh toán")
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
    fetchPaymentMethods(value)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date)
  }

  const getPaymentTypeInfo = (type: string) => {
    const typeMap: { [key: string]: { color: string; label: string; icon: React.ReactNode } } = {
      credit_card: { color: "blue", label: "Thẻ Tín Dụng", icon: <CreditCardOutlined /> },
      paypal: { color: "cyan", label: "PayPal", icon: <PaypalIcon /> },
      bank_account: { color: "green", label: "Tài Khoản Ngân Hàng", icon: <BankOutlined /> },
    }
    return typeMap[type] || { color: "default", label: type, icon: null }
  }

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return ""
    if (accountNumber.length <= 4) return accountNumber
    return "•••• •••• •••• " + accountNumber.slice(-4)
  }

  const columns = [
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (type: string) => {
        const typeInfo = getPaymentTypeInfo(type)
        return (
          <Tag color={typeInfo.color} className="flex items-center gap-1 px-2 py-1">
            {typeInfo.icon}
            <span>{typeInfo.label}</span>
          </Tag>
        )
      },
    },
    {
      title: "Nhà Cung Cấp",
      dataIndex: "provider",
      key: "provider",
      width: 150,
      render: (provider: string) => <span className="font-medium">{provider}</span>,
    },
    {
      title: "Số Tài Khoản",
      dataIndex: "accountNumber",
      key: "accountNumber",
      width: 180,
      render: (accountNumber: string) => <span className="font-mono">{maskAccountNumber(accountNumber)}</span>,
    },
    {
      title: "Tên Chủ Thẻ",
      dataIndex: "cardholderName",
      key: "cardholderName",
      width: 180,
    },
    {
      title: "Ngày Hết Hạn",
      dataIndex: "expiryDate",
      key: "expiryDate",
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Địa Chỉ Nợ",
      dataIndex: "billingAddress",
      key: "billingAddress",
      width: 250,
      render: (addr: any) =>
        addr ? (
          <div className="text-sm">
            <div>{addr.city || ""}</div>
            <div>
              {addr.state || ""} {addr.postalCode || ""}
            </div>
            <div>{addr.country || ""}</div>
          </div>
        ) : (
          ""
        ),
    },
    {
      title: "Mặc Định",
      dataIndex: "isDefault",
      key: "isDefault",
      width: 100,
      render: (isDefault: boolean) => (
        <Switch checked={isDefault} disabled className={isDefault ? "bg-blue-500" : ""} />
      ),
    },
    {
      title: "Người Sử Dụng",
      dataIndex: ["user", "userName"],
      key: "user",
      width: 150,
      render: (userName: string) => <span className="text-blue-600">{userName}</span>,
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_: any, record: PaymentMethod) =>
        isAdmin ? (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditPaymentMethod(record)}
              className="text-blue-500 hover:text-blue-700"
            >
              Sửa
            </Button>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => handleDeletePaymentMethod(record._id)}
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
          <CreditCardOutlined className="mr-2" /> Quản Lý Phương Thức Thanh Toán
        </Title>
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddPaymentMethod}
              className="rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Thêm Mới Phương Thức Thanh Toán
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
            placeholder="Tìm kiếm theo nhà cung cấp"
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
          dataSource={paymentMethods}
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalRecord,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
            showTotal: (total) => <span className="ml-0">Total {total} payment methods</span>,
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Thông tin chi tiết:</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Loại:</span>
                        <span>{getPaymentTypeInfo(record.type).label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nhà cung cấp:</span>
                        <span>{record.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Số tài khoản:</span>
                        <span className="font-mono">{maskAccountNumber(record.accountNumber)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tên chủ thẻ:</span>
                        <span>{record.cardholderName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ngày hết hạn:</span>
                        <span>{formatDate(record.expiryDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mặc định:</span>
                        <span>{record.isDefault ? "Có" : "Không"}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Địa chỉ thanh toán:</h4>
                    <div className="space-y-1">
                      <div className="font-medium">{record.billingAddress?.fullName}</div>
                      <div>{record.billingAddress?.addressLine1}</div>
                      {record.billingAddress?.addressLine2 && <div>{record.billingAddress.addressLine2}</div>}
                      <div>
                        {record.billingAddress?.city}, {record.billingAddress?.state}{" "}
                        {record.billingAddress?.postalCode}
                      </div>
                      <div>{record.billingAddress?.country}</div>
                    </div>
                  </div>
                </div>
                {record.metadata && Object.keys(record.metadata).length > 0 && (
                  <div className="mt-4">
                    {/* <h4 className="font-medium mb-2">Thông tin bổ sung:</h4> */}
                    {/* <pre className="bg-gray-100 p-2 rounded-md text-sm overflow-auto">
                      {JSON.stringify(record.metadata, null, 2)}
                    </pre> */}
                  </div>
                )}
              </div>
            ),
            rowExpandable: (record) => true,
          }}
        />
      </div>

      <Modal
        title={selectedPaymentMethod ? "Chỉnh sửa phương thức thanh toán" : "Thêm mới phương thức thanh toán"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okButtonProps={{ loading: saving, className: "rounded-md bg-blue-500 hover:bg-blue-600" }}
        cancelButtonProps={{ disabled: saving, className: "rounded-md" }}
        width={800}
        className="p-4"
      >
        <Form form={form} layout="vertical" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="type"
              label="Loại"
              rules={[{ required: true, message: "Vui lòng chọn loại phương thức thanh toán" }]}
            >
              <Select className="rounded-md">
                <Option value="credit_card">Thẻ Tín Dụng</Option>
                <Option value="paypal">PayPal</Option>
                <Option value="bank_account">Tài Khoản Ngân Hàng</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="provider"
              label="Nhà Cung Cấp"
              rules={[{ required: true, message: "Vui lòng nhập nhà cung cấp" }]}
            >
              <Input className="rounded-md" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="accountNumber"
              label="Số Tài Khoản"
              rules={[{ required: true, message: "Vui lòng nhập số tài khoản" }]}
            >
              <Input className="rounded-md" />
            </Form.Item>

            <Form.Item name="expiryDate" label="Ngày Hết Hạn">
              <Input type="date" className="rounded-md" />
            </Form.Item>
          </div>

          <Form.Item name="cardholderName" label="Tên Chủ Thẻ">
            <Input className="rounded-md" />
          </Form.Item>

          <Divider orientation="left">Địa Chỉ Thanh Toán</Divider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="billingAddress.fullName"
              label="Họ Tên"
              rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
            >
              <Input className="rounded-md" />
            </Form.Item>

            <Form.Item
              name="billingAddress.country"
              label="Quốc Gia"
              rules={[{ required: true, message: "Vui lòng nhập quốc gia" }]}
            >
              <Input className="rounded-md" />
            </Form.Item>
          </div>

          <Form.Item
            name="billingAddress.addressLine1"
            label="Địa Chỉ 1"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ 1" }]}
          >
            <TextArea rows={2} className="rounded-md" />
          </Form.Item>

          <Form.Item name="billingAddress.addressLine2" label="Địa Chỉ 2">
            <TextArea rows={2} className="rounded-md" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name="billingAddress.city" label="Thành phố">
              <Input className="rounded-md" />
            </Form.Item>

            <Form.Item name="billingAddress.state" label="Tỉnh/Bang">
              <Input className="rounded-md" />
            </Form.Item>

            <Form.Item name="billingAddress.postalCode" label="Mã Bưu Chính">
              <Input className="rounded-md" />
            </Form.Item>
          </div>

          <Divider orientation="left">Cài Đặt Khác</Divider>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="user"
              label="Người Sử Dụng"
              rules={[{ required: true, message: "Vui lòng chọn người dùng" }]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                placeholder="Chọn người dùng"
                filterOption={(input, option) =>
                  String(option?.children || "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                className="rounded-md"
              >
                {users.map((u) => (
                  <Option key={u._id} value={u._id}>
                    {u.userName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="metadata" label="Điều Kiện Khác">
              <Select className="rounded-md">
                <Option value={JSON.stringify({})}>Không có</Option>
                <Option value={JSON.stringify({ onlyDomestic: true })}>Chỉ dùng nội địa</Option>
                <Option value={JSON.stringify({ priority: "international" })}>Ưu tiên thẻ quốc tế</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="isDefault" label="Mặc Định" valuePropName="checked">
            <Switch className="bg-gray-300" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

// Custom PayPal icon
const PaypalIcon = () => (
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
    <path d="M6.5 7h10c1.7 0 3 1.3 3 3s-1.3 3-3 3h-10c-1.7 0-3-1.3-3-3s1.3-3 3-3z"></path>
    <path d="M9.5 3v18"></path>
    <path d="M14.5 3v18"></path>
  </svg>
)

export default PaymentMethodsPage
