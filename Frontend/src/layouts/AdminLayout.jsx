import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaCut, FaBoxOpen, FaHandSparkles, FaTags, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaCog, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/SathyaBeauty.png';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout, adminUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  React.useEffect(() => {
    const token = localStorage.getItem('admin_access_token');
    if (!token) {
      navigate('/admin-login');
    }
  }, [navigate, location.pathname]);

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/admin' },
    { name: 'Services', icon: <FaCut />, path: '/admin/services' },
    { name: 'Packages', icon: <FaBoxOpen />, path: '/admin/packages' },
    { name: 'Mehandi', icon: <FaHandSparkles />, path: '/admin/mehandi' },
    { name: 'Hair Extensions', icon: <FaCut />, path: '/admin/hair-extensions' },
    { name: 'Offers', icon: <FaTags />, path: '/admin/offers' },
    { name: 'Bookings', icon: <FaCalendarAlt />, path: '/admin/bookings' },
    { name: 'Customers', icon: <FaUsers />, path: '/admin/customers' },
    { name: 'Payments', icon: <FaMoneyBillWave />, path: '/admin/payments' },
    { name: 'Settings', icon: <FaCog />, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      adminLogout();
      navigate('/admin-login');
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-16 bg-white shadow-md border-b border-amber-100 flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Sathya Beauty" className="w-8 h-8 object-contain" />
          <h2 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-serif tracking-tight">SathyaBeauty</h2>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-primary p-2 focus:outline-none"
        >
          <FaBars size={24} />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="md:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:relative top-0 left-0 h-full w-64 bg-white shadow-xl border-r border-secondary/30 flex flex-col z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex justify-between items-center">
          <div className="hidden md:flex items-center gap-3">
            <img src={logo} alt="Sathya Beauty" className="w-10 h-10 object-contain" />
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-serif tracking-tight">SathyaBeauty</h2>
          </div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary md:hidden">Menu</h2>
          <button 
            onClick={closeMobileMenu}
            className="md:hidden text-gray-500 hover:text-primary transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto mt-2 custom-scrollbar">
          <ul className="space-y-2 px-4 pb-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    location.pathname === item.path ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30 font-semibold' : 'text-gray-600 hover:bg-amber-50 hover:text-primary font-medium'
                  }`}
                >
                  <span className={`mr-3 text-lg ${location.pathname === item.path ? 'text-white' : 'text-secondary'}`}>{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-5 border-t border-secondary/20 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-6 py-3 text-primary bg-amber-50 hover:bg-amber-100 font-bold transition-all rounded-xl border border-amber-100 hover:shadow-sm"
          >
            <FaSignOutAlt className="mr-3 text-primary" /> Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 bg-amber-50/30 w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
