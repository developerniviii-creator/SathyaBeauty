import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { AuthProvider } from './context/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import CustomerLayout from './layouts/CustomerLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/Services';
import AdminBookings from './pages/admin/Bookings';
import AdminPackages from './pages/admin/Packages';
import AdminOffers from './pages/admin/Offers';
import AdminCustomers from './pages/admin/Customers';
import AdminMehandi from './pages/admin/Mehandi';
import AdminHairExtensions from './pages/admin/HairExtensions';
import AdminPayments from './pages/admin/Payments';
import AdminSettings from './pages/admin/Settings';
import CustomerHome from './pages/customer/Home';
import CustomerServices from './pages/customer/Services';
import CustomerPackages from './pages/customer/Packages';
import CustomerOffers from './pages/customer/Offers';
import CustomerMyBookings from './pages/customer/MyBookings';
import CustomerProfile from './pages/customer/Profile';
import BookingForm from './pages/customer/BookingForm';
import Login from './pages/customer/Login';
import Signup from './pages/customer/Signup';
import AdminLogin from './pages/admin/AdminLogin';

const Placeholder = ({ title }) => <div className="p-8"><h1 className="text-2xl font-bold">{title} Page</h1></div>;

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Standalone Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Customer Routes */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<CustomerHome />} />
              <Route path="services" element={<CustomerServices />} />
              <Route path="packages" element={<CustomerPackages />} />
              <Route path="offers" element={<CustomerOffers />} />
              <Route path="book" element={<BookingForm />} />
              <Route path="my-bookings" element={<CustomerMyBookings />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="packages" element={<AdminPackages />} />
              <Route path="mehandi" element={<AdminMehandi />} />
              <Route path="hair-extensions" element={<AdminHairExtensions />} />
              <Route path="offers" element={<AdminOffers />} />
              <Route path="bookings" element={<AdminBookings />} />

              <Route path="customers" element={<AdminCustomers />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
