import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

import PublicHome from './pages/public/Home.jsx';
import Navbar from './components/Navbar.jsx';
import About from './components/aboutus/About.jsx';
import ProductEnquiry from './components/productenquiry/ProductEnquiry.jsx';
import AllProducts from './components/allproducts/AllProducts.jsx';
import ProductDetails from './components/productdetails/ProductDetails.jsx';
import Footer from './components/Footer.jsx';
import Contact from './components/contactus/Contact.jsx';
import PrivacyPolicy from './components/privacypolicy/PrivacyPolicy.js';
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
import PWAInstallBanner from './components/PWAInstallBanner.jsx';

const App = () => {
  const location = useLocation();
  const hideHeaderFooter = location.pathname === '/admin/login';
  const hideFooter = location.pathname.startsWith('/admin');

  return (
    <>
      {/* ✅ GLOBAL SCROLL FIX */}
      <ScrollToTop />

      {!hideHeaderFooter && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/product-enquiry" element={<ProductEnquiry />} />
        <Route path="/contact-us" element={<Contact />} />
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
      </Routes>

      {!hideFooter && <Footer />}
      <PWAInstallBanner />
    </>
  );
};

export default App;