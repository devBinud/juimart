import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';

import PublicHome from './pages/public/Home.jsx';
import Navbar from './components/Navbar.jsx';
import AllProducts from './components/allproducts/AllProducts.jsx';
import ProductDetails from './components/productdetails/ProductDetails.jsx';
import Footer from './components/Footer.jsx';
import ContactUsPage from './pages/public/ContactUs.jsx';
import PrivacyPolicyPage from './pages/public/PrivacyPolicy.jsx';
import TermsConditions from './pages/public/TermsConditions.jsx';
import ReturnPolicy from './pages/public/ReturnPolicy.jsx';
import Checkout from './components/checkout/Checkout.jsx';
import OrderSuccess from './components/orderSuccess/OrderSuccess.jsx';
import Receipt from './components/receipt/Receipt.jsx';
import ScrollToTop from './components/scrollToTop.jsx';

// Admin Pages
import Dashboard from './pages/admin/Dashboard.jsx';
import AddProduct from './pages/admin/AddProduct.jsx';
import AllProduct from './pages/admin/AllProduct.jsx';
import AllOrders from './pages/admin/AllOrders.jsx';
import Login from './pages/admin/Login.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Analytics from './pages/admin/Analytics.jsx';
import PWAInstallBanner from './components/PWAInstallBanner.jsx';
import CartToast from './components/CartToast.jsx';
import { logVisit } from './firebase/analyticsService';

const App = () => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/admin/login';
  const hideFooter = location.pathname.startsWith('/admin');

  // Log every page visit
  useEffect(() => {
    if (!location.pathname.startsWith('/admin')) {
      logVisit(location.pathname);
    }
  }, [location.pathname]);

  return (
    <>
      {/* ✅ GLOBAL SCROLL FIX */}
      <ScrollToTop />

      {!hideHeaderFooter && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/return-policy" element={<ReturnPolicy />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/receipt" element={<Receipt />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/all-orders"
          element={
            <PrivateRoute>
              <AllOrders />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/all-products"
          element={
            <PrivateRoute>
              <AllProduct />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <PrivateRoute>
              <Analytics />
            </PrivateRoute>
          }
        />
      </Routes>

      {!hideFooter && <Footer />}
      <PWAInstallBanner />
      <CartToast />
    </>
  );
};

export default App;