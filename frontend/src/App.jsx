import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import RoleSelection from './pages/RoleSelection';
import Home from './pages/Home';
import Menu from './pages/Menu';
import BuildBowl from './pages/BuildBowl';
import Subscription from './pages/Subscription';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import UserProfile from './pages/UserProfile';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminInventory from './pages/AdminInventory';
import AdminSuppliers from './pages/AdminSuppliers';
import AdminUsers from './pages/AdminUsers';
import AuthContext, { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppLayout() {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isGlobalAdmin = user?.role === 'admin';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full overflow-x-hidden text-gray-900">
      {isAdminRoute || isGlobalAdmin ? <AdminNavbar /> : <Navbar />}
      
      <main className="flex-grow w-full flex flex-col">
        <Routes>
          {/* Home/Landing Redirect */}
          <Route path="/" element={<Navigate to="/home" replace />} />
          
          {/* Role Selection is preserved but redirect root to Home as per modern flow */}
          <Route path="/roles" element={<RoleSelection />} />
          
          {/* Main Pages */}
          <Route path="/home" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/build-bowl" element={<BuildBowl />} />
          <Route path="/subscription" element={<Subscription />} />
          
          {/* User Routes */}
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/invoice/:orderId" element={<Invoice />} />
          <Route path="/user/profile" element={<UserProfile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/suppliers" element={<AdminSuppliers />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </main>

      {!(isAdminRoute || isGlobalAdmin) && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
