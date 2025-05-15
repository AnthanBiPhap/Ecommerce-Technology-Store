"use client"

import React, { useState } from "react"
import { Breadcrumb, Layout, Menu, theme, Input, Space, Badge, Tooltip } from "antd"
import {
  FileOutlined,
  PieChartOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  FolderOutlined,
  TagOutlined,
  EnvironmentOutlined,
  BellOutlined,
  BankOutlined,
  DollarOutlined,
  SwapOutlined,
  BankOutlined as WarehouseOutlined,
  StarOutlined,
  SettingOutlined,
  CarOutlined,
  FileTextOutlined,
  HeartOutlined,
  SearchOutlined,
  QuestionCircleOutlined,
  NotificationOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons"
import { Outlet, useNavigate, useLocation } from "react-router"
import UserInfo from "../components/UserInfo"

const { Header, Content, Footer, Sider } = Layout

// Define custom menu item type
interface CustomMenuItem {
  key: React.Key
  label: React.ReactNode
  icon?: React.ReactNode
  children?: CustomMenuItem[]
}

// Define getItem to return CustomMenuItem
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: CustomMenuItem[],
): CustomMenuItem {
  return {
    key,
    icon,
    children,
    label,
  }
}

// Menu items
const items: CustomMenuItem[] = [
  getItem("Dashboard", "", <PieChartOutlined />),
  getItem("User", "users", <UserOutlined />),
  getItem("Brand", "brands", <StarOutlined />),
  getItem("Cart", "carts", <ShoppingCartOutlined />),
  getItem("Category", "categories", <FolderOutlined />),
  getItem("Products", "products", <ShoppingCartOutlined />),
  getItem("Orders", "orders", <ShoppingCartOutlined />),
  getItem("Payment Methods", "payment-methods", <BankOutlined />),
  getItem("Payments", "payments", <DollarOutlined />),
  // getItem("Activity Log", "activitylogs", <FileOutlined />),
  getItem("Address", "addresses", <EnvironmentOutlined />),
  getItem("Coupon", "coupons", <TagOutlined />),
  getItem("Location", "locations", <EnvironmentOutlined />),
  getItem("Notifications", "notifications", <BellOutlined />),
  // getItem("Product Attributes", "product-attributes", <TagOutlined />),
  // getItem("SEO", "seo", <StarOutlined />),
  getItem("Shipping", "shippings", <CarOutlined />),
  getItem("Tech News", "tech-news", <FileTextOutlined />),
  getItem("Vendors", "vendors", <UserOutlined />),
  // getItem("Wishlists", "wishlists", <HeartOutlined />),
  getItem("Product Inventories", "product-inventories", <WarehouseOutlined />),
  getItem("Product Variants", "product-variants", <SwapOutlined />),
  getItem("Review", "reviews", <StarOutlined />),
  getItem("Settings", "settings", <SettingOutlined />),
]

// Helper function to get breadcrumb items based on current path
const getBreadcrumbItems = (pathname: string) => {
  if (pathname === "/") return [{ title: "Dashboard" }]

  const paths = pathname.split("/").filter(Boolean)
  return [
    { title: "Dashboard", href: "/" },
    ...paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join("/")}`
      const title = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")
      return { title, href: url }
    }),
  ]
}

const DefaultLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  // Get the current selected key based on the URL path
  const selectedKey = location.pathname.split("/")[1] || ""

  return (
    <Layout className="min-h-screen">
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        className="min-h-screen"
        theme="dark"
      >
        <div className="h-16 flex items-center justify-center">
          <h1 className="text-white text-xl font-bold m-0 p-4 truncate">{collapsed ? "Admin" : "Admin Dashboard"}</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          items={items}
          onClick={({ key }) => navigate(`/${key}`)}
        />
      </Sider>
      <Layout>
      <Header style={{ background: 'linear-gradient(to right,rgb(44, 113, 233),rgb(68, 116, 220))' }} className="flex items-center justify-between p-0 px-6 text-white shadow-lg">
          <div className="flex items-center">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: "text-lg cursor-pointer mr-4",
              onClick: () => setCollapsed(!collapsed),
            })}
            <Input 
              prefix={<SearchOutlined className="text-indigo-600" />} 
              placeholder="Search..." 
              className="w-64 rounded-md border-none shadow-sm bg-white/90 hover:bg-white transition-colors" 
            />
          </div>
          <Space>
            {/* <Tooltip title="Help">
              <QuestionCircleOutlined className="text-yellow-400 hover:text-yellow-300 text-lg cursor-pointer transition-colors" />
            </Tooltip>
            <Tooltip title="Notifications">
              <Badge count={5} size="small" className="[&>.ant-badge-count]:bg-yellow-400 [&>.ant-badge-count]:text-gray-800">
                <NotificationOutlined className="text-yellow-400 hover:text-yellow-300 text-lg cursor-pointer transition-colors" />
              </Badge>
            </Tooltip> */}
            <UserInfo />
          </Space>
        </Header>
        <Content className="p-0">
          <div className="container mx-auto px-4 mt-6">
            <Breadcrumb items={getBreadcrumbItems(location.pathname)} className="mb-6" />
            <div
              className="bg-white rounded-lg shadow-sm p-6 mt-6"
              style={{
                background: colorBgContainer,
              }}
            >
              <Outlet />
            </div>
          </div>
        </Content>
        <Footer className="text-center bg-white border-t border-gray-200 p-3">
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  )
}

export default DefaultLayout
