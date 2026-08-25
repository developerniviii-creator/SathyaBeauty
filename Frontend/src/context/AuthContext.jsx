import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Admin State
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Customer State
  const [customerUser, setCustomerUser] = useState(() => {
    const saved = localStorage.getItem('customer_user');
    return saved ? JSON.parse(saved) : null;
  });

  const adminLogin = (userData) => {
    setAdminUser(userData);
    localStorage.setItem('admin_user', JSON.stringify(userData));
    localStorage.setItem('admin_role', 'admin');
  };

  const customerLogin = (userData) => {
    setCustomerUser(userData);
    localStorage.setItem('customer_user', JSON.stringify(userData));
    localStorage.setItem('customer_role', 'customer');
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_role');
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
  };

  const customerLogout = () => {
    setCustomerUser(null);
    localStorage.removeItem('customer_user');
    localStorage.removeItem('customer_role');
    localStorage.removeItem('customer_access_token');
    localStorage.removeItem('customer_refresh_token');
  };

  return (
    <AuthContext.Provider value={{ 
      adminUser, customerUser, 
      adminLogin, customerLogin, 
      adminLogout, customerLogout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
