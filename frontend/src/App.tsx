import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { ProductComparisonProvider } from './context/ProductComparisonContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import WishlistPage from './pages/WishlistPage';
import ProductComparisonPage from './pages/ProductComparisonPage';
import WholesaleInquiryPage from './pages/WholesaleInquiryPage';
import OrderLookupPage from './pages/OrderLookupPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import Login from './components/Login';
import Register from './components/Register';
import ChatBot from './components/ChatBot';
import WhatsAppWidget from './components/WhatsAppWidget';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <ProductComparisonProvider>
              <ThemeProvider>
                <Router>
                  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:id" element={<OrderDetailsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/compare" element={<ProductComparisonPage />} />
                <Route path="/wholesale" element={<WholesaleInquiryPage />} />
                <Route path="/order-lookup" element={<OrderLookupPage />} />
                <Route path="/order-success/:id" element={<OrderSuccessPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                  </Routes>
                </main>
                <ChatBot />
                <WhatsAppWidget />
              </div>
            </Router>
          </ThemeProvider>
        </ProductComparisonProvider>
      </RecentlyViewedProvider>
    </WishlistProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
