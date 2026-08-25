import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaFileInvoiceDollar, FaSearch, FaFilter, FaCheckCircle, FaClock, FaTimesCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';


const getStatusIcon = (status) => {
  switch(status) {
    case 'Completed': return <FaCheckCircle className="text-green-500 mr-2" />;
    case 'Advance Paid': return <FaCheckCircle className="text-blue-500 mr-2" />;
    case 'Pending': return <FaClock className="text-amber-500 mr-2" />;
    case 'Failed': return <FaTimesCircle className="text-red-500 mr-2" />;
    default: return null;
  }
};

const getStatusClass = (status) => {
  switch(status) {
    case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'Advance Paid': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Failed': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const PaymentRow = ({ payment }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <tr className="hover:bg-pink-50/30 transition-colors">
        <td className="px-6 py-5 text-sm font-bold text-gray-800 hidden md:table-cell">{payment.id}</td>
        <td className="px-6 py-5 text-sm font-medium text-gray-500 hidden md:table-cell">{payment.date}</td>
        <td className="px-6 py-5">
          <p className="text-sm font-extrabold text-gray-800 mb-1">{payment.customer}</p>
          <p className="text-xs font-bold text-gray-400 uppercase hidden md:block">{payment.service}</p>
        </td>
        <td className="px-6 py-5 text-sm font-black text-gray-800 hidden md:table-cell">{payment.totalAmount}</td>
        <td className="px-6 py-5 text-sm font-black text-primary">{payment.paidAmount}</td>
        <td className="px-6 py-5 text-sm font-black text-red-500 hidden md:table-cell">{payment.balanceAmount}</td>
        <td className="px-6 py-5 text-sm hidden md:table-cell">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${getStatusClass(payment.status)}`}>
            {getStatusIcon(payment.status)}
            {payment.status}
          </span>
        </td>
        <td className="px-6 py-5 md:hidden text-right">
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
          <td colSpan="3" className="px-6 py-5 border-t border-gray-100 shadow-inner">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Date</p>
                <p className="text-sm font-medium text-gray-700">{payment.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Transaction ID</p>
                <p className="text-sm font-bold text-gray-800">{payment.id}</p>
              </div>
              <div className="col-span-2 pt-2 border-t border-gray-100 mt-1">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Service Details</p>
                <p className="text-sm font-bold text-gray-700">{payment.service}</p>
              </div>
              <div className="col-span-2 pt-2 border-t border-gray-100 mt-1 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total</p>
                  <p className="text-sm font-semibold text-gray-800">{payment.totalAmount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Paid</p>
                  <p className="text-sm font-semibold text-primary">{payment.paidAmount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Balance</p>
                  <p className="text-sm font-semibold text-red-500">{payment.balanceAmount}</p>
                </div>
              </div>
              <div className="col-span-2 pt-2 border-t border-gray-100 mt-1 flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Method</p>
                  <p className="text-sm font-semibold text-gray-600">{payment.method}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1 text-right">Status</p>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border shadow-sm ${getStatusClass(payment.status)}`}>
                    {getStatusIcon(payment.status)}
                    {payment.status}
                  </span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  React.useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('admin_access_token');
        const res = await fetch('http://127.0.0.1:8000/api/payments/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const formatted = data.map(p => {
            const booking = p.booking || {};
            const customer = booking.customer || {};
            const service = booking.custom_service_name || (booking.service ? booking.service.name : (booking.package ? booking.package.name : 'Unknown'));
            
            const dateObj = new Date(p.created_at);
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            let totalAmount = parseFloat(booking.total_amount) || 0;
            if (totalAmount === 0) {
              if (booking.service && booking.service.price) totalAmount = parseFloat(booking.service.price);
              else if (booking.package && booking.package.price) totalAmount = parseFloat(booking.package.price);
            }
            
            const paidAmount = parseFloat(p.amount) || 0;
            const balanceAmount = Math.max(0, totalAmount - paidAmount);
            
            let statusStr = p.status.charAt(0).toUpperCase() + p.status.slice(1);
            if (statusStr === 'Completed' && balanceAmount > 0) {
              statusStr = 'Advance Paid';
            }
            
            return {
              id: p.transaction_id || p.razorpay_order_id || p.id,
              customer: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || customer.username || 'Unknown',
              amountRaw: paidAmount,
              balanceRaw: balanceAmount,
              totalRaw: totalAmount,
              totalAmount: `₹${totalAmount.toLocaleString('en-IN')}`,
              paidAmount: `₹${paidAmount.toLocaleString('en-IN')}`,
              balanceAmount: `₹${balanceAmount.toLocaleString('en-IN')}`,
              date: dateStr,
              method: 'Razorpay',
              status: statusStr,
              service: service
            };
          });
          setPayments(formatted.reverse());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const totalRevenue = payments.reduce((acc, p) => acc + (p.totalRaw || 0), 0);
  const totalCollection = payments.reduce((acc, p) => acc + (p.amountRaw || 0), 0);
  const pendingAmount = payments.reduce((acc, p) => acc + (p.balanceRaw || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-10 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Payment History</h1>
          <p className="text-gray-500 mt-1 font-medium">Track and manage all customer transactions.</p>
        </div>
        <div className="flex space-x-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none justify-center bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl flex items-center hover:bg-gray-50 transition-colors shadow-sm shadow-pink-100/50 font-bold">
            <FaFilter className="mr-2 text-gray-500" /> Filter
          </button>
          <button className="flex-1 md:flex-none justify-center bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2.5 rounded-xl flex items-center hover:shadow-lg hover:shadow-green-200 transition-all shadow-md font-bold">
            <FaDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-xl shadow-pink-100/40 border border-pink-50 flex items-center group hover:shadow-2xl hover:shadow-pink-200/50 transition-all">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-2xl mr-4 group-hover:scale-110 transition-transform">
            <FaFileInvoiceDollar />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-2xl font-black text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl shadow-xl shadow-pink-100/40 border border-pink-50 flex items-center group hover:shadow-2xl hover:shadow-pink-200/50 transition-all">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl mr-4 group-hover:scale-110 transition-transform">
            <FaCheckCircle />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Collection</p>
            <p className="text-2xl font-black text-gray-900">₹{totalCollection.toLocaleString('en-IN')}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl shadow-xl shadow-pink-100/40 border border-pink-50 flex items-center group hover:shadow-2xl hover:shadow-pink-200/50 transition-all">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-2xl mr-4 group-hover:scale-110 transition-transform">
            <FaClock />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Pending Payments</p>
            <p className="text-2xl font-black text-gray-900">₹{pendingAmount.toLocaleString('en-IN')}</p>
          </div>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl shadow-xl shadow-pink-100/40 border border-pink-50 overflow-hidden relative z-10">
        <div className="p-6 border-b border-pink-100 flex flex-col sm:flex-row justify-between items-center bg-pink-50/50 gap-4">
          <h2 className="text-xl font-extrabold text-gray-800 self-start sm:self-auto">Recent Transactions</h2>
          <div className="relative w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search by ID or Customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-full sm:w-72 shadow-sm transition-all"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-gray-400" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500 font-bold">Loading payments...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-5 hidden md:table-cell">Transaction ID</th>
                  <th className="px-6 py-5 hidden md:table-cell">Date</th>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5 hidden md:table-cell">Total Amount</th>
                  <th className="px-6 py-5">Paid Amount</th>
                  <th className="px-6 py-5 hidden md:table-cell">Balance Amount</th>
                  <th className="px-6 py-5 hidden md:table-cell">Status</th>
                  <th className="px-6 py-5 md:hidden">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.length > 0 ? (
                  payments
                    .filter(p => p.customer.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((payment) => (
                      <PaymentRow key={payment.id} payment={payment} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500 font-medium">No payments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminPayments;
