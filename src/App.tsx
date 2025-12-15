import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '@/auth/AuthProvider'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import HomePage from '@/pages/HomePage'
import './App.css'
import { SignUpPage } from '@/pages/SignUpPage'
import { OauthCallbackPage } from '@/pages/OauthCallbackPage'
import ApiTestPage from '@/pages/ApiTestPage'
import ProductListPage from '@/pages/ProductListPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CartPage from '@/pages/CartPage'
import SearchPage from '@/pages/SearchPage'
import OrderListPage from '@/pages/OrderListPage'
import CheckoutPage from '@/pages/CheckoutPage'
import Layout from '@/components/Layout'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/oauth/callback/:provider" element={<OauthCallbackPage />} />

            {/* Product Routes */}
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />

            {/* Search */}
            <Route path="/search" element={<SearchPage />} />

            {/* Cart */}
            <Route path="/cart" element={<CartPage />} />

            {/* Protected Routes - Require Authentication */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrderListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/api-test"
              element={
                <ProtectedRoute>
                  <ApiTestPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
