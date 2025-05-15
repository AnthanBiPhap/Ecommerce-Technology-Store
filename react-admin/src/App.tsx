import '@ant-design/v5-patch-for-react-19';
import './App.css'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from "react-router";
import DefaultLayout from './layouts/DefaultLayout';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import NoPage from './pages/NoPage';
import EmptyLayout from './layouts/EmptyLayout';
import UserPage from './pages/UserPage';
import ActivityLogPage from './pages/ActivityLogPage';
import AddressPage from './pages/AddressPage';
import BrandPage from './pages/BrandPage';
import CartPage from './pages/CartPage';
import CategoryPage from './pages/CategoryPage';
import CouponPage from './pages/CouponPage';
import LocationPage from './pages/LocationPage';
import NotificationsPage from './pages/NotificationsPage';
import OrdersPage from './pages/OrdersPage';
import PaymentMethodsPage from './pages/PaymentMethodsPage';
import PaymentsPage from './pages/PaymentsPage';
import ProductAttributesPage from './pages/ProductAttributesPage';
import ProductsPage from './pages/ProductsPage';
import ProductVariantsPage from './pages/ProductVariantsPage';
import ProductInventoriesPage from './pages/ProductInventoriesPage';
import ReviewPage from './pages/ReviewPage';
import SEOPage from './pages/SEOPage';
import SettingsPage from './pages/SettingsPage';
import ShippingPage from './pages/ShippingPage';
import TechNewPage from './pages/TechNewPage';
import VendorPage from './pages/VendorPage';
import WishlistPage from './pages/WishlistPage';


// Create a client
const queryClient = new QueryClient()

function App() {

  return (
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
         {/* Login thi su dung Emptylayout */}
        <Route path='/login' element={<EmptyLayout />}>
            <Route index element={<LoginPage />} />
        </Route>
          
         {/* Mac dinh cac trang khac su dung DefaultLayout */}
        <Route path='/' element={<DefaultLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />  
            <Route path="users" element={<UserPage />} />
            <Route path="activitylogs" element={<ActivityLogPage />} />
            <Route path="addresses" element={<AddressPage />} />
            <Route path="brands" element={<BrandPage />} />
            <Route path="carts" element={<CartPage />} />
            <Route path="categories" element={<CategoryPage />} />
            <Route path="coupons" element={<CouponPage />} />
            <Route path="locations" element={<LocationPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="payment-methods" element={<PaymentMethodsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="product-attributes" element={<ProductAttributesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="product-variants" element={<ProductVariantsPage />} />
            <Route path="product-inventories" element={<ProductInventoriesPage />} />
            <Route path="reviews" element={<ReviewPage />} />
            <Route path="seo" element={<SEOPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="shippings" element={<ShippingPage />} />
            <Route path="tech-news" element={<TechNewPage />} />
            <Route path="vendors" element={<VendorPage />} />
            <Route path="wishlists" element={<WishlistPage />} />
        </Route>
         {/* Login thi su dung Emptylayout */}
        <Route  path='/login' element={<EmptyLayout />}>
            <Route index element={<LoginPage />} />
        </Route>
        {/* 404 Not Found */}
        <Route path='*' element={<NoPage />} />
      </Routes>
    </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App