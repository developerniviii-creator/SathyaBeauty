import React, { useState } from 'react';
import { mockBookings } from '../../utils/dummyData';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const BookingRow = ({ booking }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr className="hover:bg-pink-50/30 transition-colors">
        <td className="p-5 font-mono text-sm font-bold text-gray-500 hidden md:table-cell">{booking.id}</td>
        <td className="p-5">
          <p className="font-extrabold text-gray-800">{booking.customer}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{booking.type} Service</p>
        </td>
        <td className="p-5 font-medium text-gray-600">{booking.service}</td>
        <td className="p-5 hidden md:table-cell">
          <p className="font-bold text-primary">{booking.date}</p>
          <p className="text-sm font-medium text-gray-500">{booking.time}</p>
        </td>
        <td className="p-5 hidden md:table-cell">
          <span className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
            booking.status === 'Completed' ? 'bg-green-100 text-green-700 border border-green-200' :
            booking.status === 'Accepted' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
            'bg-amber-100 text-amber-700 border border-amber-200'
          }`}>
            {booking.status}
          </span>
        </td>
        <td className="p-5 hidden md:table-cell">
          <span className={`px-4 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
            booking.paymentStatus === 'Full Paid' ? 'bg-green-100 text-green-700 border border-green-200' :
            'bg-orange-100 text-orange-700 border border-orange-200'
          }`}>
            {booking.paymentStatus}
          </span>
        </td>
        <td className="p-5 md:hidden text-right">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary p-2 bg-pink-50 hover:bg-pink-100 transition-colors rounded-lg flex items-center justify-center w-full"
          >
            {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
            <span className="ml-2 text-xs font-bold">Details</span>
          </button>
        </td>
      </tr>
      
      {/* Mobile Expanded Details */}
      {isExpanded && (
        <tr className="md:hidden bg-gray-50/50">
          <td colSpan="3" className="p-5 border-t border-gray-100 shadow-inner">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Date & Time</p>
                <p className="font-bold text-primary text-sm">{booking.date}</p>
                <p className="text-sm font-medium text-gray-500">{booking.time}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Booking ID</p>
                <p className="font-mono text-sm font-bold text-gray-700">{booking.id}</p>
              </div>
              <div className="col-span-2 pt-3 border-t border-gray-200 mt-2">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${
                  booking.status === 'Completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                  booking.status === 'Accepted' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                  'bg-amber-100 text-amber-700 border border-amber-200'
                }`}>
                  {booking.status}
                </span>
              </div>
              <div className="col-span-2 pt-3 border-t border-gray-200 mt-2">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Payment Status</p>
                <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold shadow-sm ${
                  booking.paymentStatus === 'Full Paid' ? 'bg-green-100 text-green-700 border border-green-200' :
                  'bg-orange-100 text-orange-700 border border-orange-200'
                }`}>
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('admin_access_token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/bookings/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map(b => ({
            id: b.id,
            customer: b.customer ? (`${b.customer.first_name || ''} ${b.customer.last_name || ''}`.trim() || b.customer.username || 'Unknown') : 'Unknown',
            type: b.package ? 'Package' : 'Service',
            service: b.custom_service_name || (b.service ? b.service.name : (b.package ? b.package.name : 'Unknown')),
            date: b.date || 'N/A',
            time: b.time || 'N/A',
            status: b.status ? (b.status.charAt(0).toUpperCase() + b.status.slice(1)) : 'Pending',
            paymentStatus: (b.status === 'confirmed' || b.status === 'completed') ? 'Full Paid' : 'Pending',
            totalAmount: b.total_amount ? `₹${parseFloat(b.total_amount).toLocaleString()}` : 'N/A'
          }));
          setBookings(formatted.reverse()); // Show newest first
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="pb-10 font-sans relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      
      <h1 className="text-3xl font-extrabold text-primary mb-6 tracking-tight">Booking Management</h1>

      <div className="bg-white rounded-3xl shadow-xl shadow-pink-100/40 border border-pink-50 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500 font-bold">Loading bookings...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-pink-50/50 border-b border-pink-100 text-gray-500 text-xs font-bold uppercase tracking-wider">
                  <th className="p-5 hidden md:table-cell">Booking ID</th>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Service</th>
                  <th className="p-5 hidden md:table-cell">Date & Time</th>
                  <th className="p-5 hidden md:table-cell">Status</th>
                  <th className="p-5 hidden md:table-cell">Payment Status</th>
                  <th className="p-5 md:hidden">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <BookingRow key={booking.id} booking={booking} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500 font-medium">No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
