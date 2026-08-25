import React, { useState, useEffect } from 'react';
import { FaEye, FaEnvelope, FaBan } from 'react-icons/fa';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('admin_access_token');
        const res = await fetch('http://127.0.0.1:8000/api/users/customers/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const formatted = data
            .filter(user => user.is_customer) // Only show customers
            .map(user => ({
              id: user.id,
              name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username,
              email: user.email,
              phone: user.phone_number || 'N/A'
            }));
          setCustomers(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="pb-10 font-sans relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <h1 className="text-3xl font-extrabold text-primary mb-6 tracking-tight">Customer Directory</h1>
      
      <div className="bg-white rounded-3xl shadow-xl shadow-pink-100/40 border border-pink-50 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-bold">Loading customers...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-pink-50/50 border-b border-pink-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-5">Customer</th>
                <th className="p-5">Contact</th>
                <th className="p-5">User ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {customers.length > 0 ? (
                customers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-pink-50/30 transition-colors">
                    <td className="p-5">
                      <p className="font-extrabold text-gray-800 text-lg">{cust.name}</p>
                    </td>
                    <td className="p-5">
                      <p className="text-gray-600 font-medium">{cust.email}</p>
                      <p className="text-gray-500 font-bold text-sm mt-1">{cust.phone}</p>
                    </td>
                    <td className="p-5">
                      <p className="text-xs font-bold text-gray-400 uppercase">{cust.id}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500 font-medium">No customers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
