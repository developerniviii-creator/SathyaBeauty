import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaHome, FaStore, FaPhone, FaShieldAlt, FaCheckCircle, FaStar } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract selected service from navigation state (if any)
  const selectedService = location.state?.service || 'Premium Bridal Makeup';
  const selectedPrice = location.state?.price || 5000;

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    category: 'parlour',
    date: '',
    time: '',
    paymentMode: 'full',
    address: {
      doorNo: '',
      streetName: '',
      districtName: '',
      pincode: ''
    }
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('customer_access_token');
      if (token) {
        try {
          const res = await fetch('http://127.0.0.1:8000/api/users/profile/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            const fullName = `${data.first_name} ${data.last_name}`.trim() || data.username;
            setFormData(prev => ({
              ...prev,
              name: fullName,
              mobile: data.phone_number || ''
            }));
          }
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
        }
      }
    };
    fetchUserProfile();
  }, []);

  const advanceAmount = Math.round(selectedPrice * 0.2);
  const amountToPay = formData.paymentMode === 'full' ? selectedPrice : advanceAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (['doorNo', 'streetName', 'districtName', 'pincode'].includes(name)) {
      setFormData({ ...formData, address: { ...formData.address, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('customer_access_token');
    
    if (!token) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to make a booking.',
        icon: 'warning',
        confirmButtonColor: '#E91E63'
      }).then(() => navigate('/login'));
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    Swal.fire({
      title: 'Initializing Payment',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const orderResponse = await fetch('http://127.0.0.1:8000/api/payments/create-order/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: amountToPay,
          total_amount: selectedPrice,
          service: selectedService,
          date: formData.date,
          time: formData.time
        })
      });

      const orderData = await orderResponse.json().catch(() => ({}));

      if (!orderResponse.ok) {
        throw new Error(orderData.error || orderData.detail || 'Failed to create order');
      }

      Swal.close();

      const options = {
        key: orderData.key_id,
        amount: orderData.amount * 100,
        currency: orderData.currency,
        name: 'Beatician',
        description: `Booking for ${selectedService}`,
        order_id: orderData.order_id,
        handler: async function (response) {
          Swal.fire({
            title: 'Verifying Payment',
            text: 'Please wait...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
          });

          try {
            const verifyResponse = await fetch('http://127.0.0.1:8000/api/payments/verify-payment/', {
              method: 'POST',
              headers,
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                booking_id: orderData.booking_id
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok) {
              Swal.fire({
                title: 'Booking Confirmed!',
                text: 'We have received your payment and secured your appointment.',
                icon: 'success',
                confirmButtonColor: '#E91E63'
              }).then(() => navigate('/my-bookings'));
            } else {
              throw new Error(verifyData.error || 'Payment verification failed');
            }
          } catch (error) {
            Swal.fire('Error', error.message, 'error');
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.mobile,
        },
        theme: {
          color: '#E91E63'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        Swal.fire('Payment Failed', response.error.description, 'error');
      });
      rzp.open();
      
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  // Step Header Component
  const StepHeader = ({ number, title }) => (
    <div className="flex items-center mb-6">
      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-3 shadow-lg shadow-primary/30">
        {number}
      </div>
      <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFF5F8] py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-pink-100/50 to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Complete Your Booking</h1>
          <p className="text-gray-500 text-lg">Just a few details to secure your premium beauty experience.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Column - Forms */}
          <div className="lg:w-2/3 space-y-8">
            <form id="booking-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* Step 1: Personal Details */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-pink-900/5 border border-pink-50">
                <StepHeader number="1" title="Personal Details" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors"><FaUser /></div>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="John Doe" className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors"><FaPhone /></div>
                      <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} required placeholder="+91 98765 43210" className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Step 2: Service Location */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-pink-900/5 border border-pink-50">
                <StepHeader number="2" title="Service Location" />
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div 
                    onClick={() => setFormData({ ...formData, category: 'parlour' })}
                    className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col items-center justify-center text-center group ${formData.category === 'parlour' ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${formData.category === 'parlour' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white text-gray-400 group-hover:text-primary shadow-sm'}`}>
                      <FaStore size={24} />
                    </div>
                    <span className={`font-bold text-lg ${formData.category === 'parlour' ? 'text-primary' : 'text-gray-600'}`}>Visit Studio</span>
                    <span className="text-xs text-gray-400 mt-2">Experience our luxury salon ambiance</span>
                  </div>
                  
                  <div 
                    onClick={() => setFormData({ ...formData, category: 'home' })}
                    className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 flex flex-col items-center justify-center text-center group ${formData.category === 'home' ? 'border-secondary bg-secondary/5 shadow-md' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${formData.category === 'home' ? 'bg-secondary text-white shadow-lg shadow-secondary/30' : 'bg-white text-gray-400 group-hover:text-secondary shadow-sm'}`}>
                      <FaHome size={24} />
                    </div>
                    <span className={`font-bold text-lg ${formData.category === 'home' ? 'text-secondary' : 'text-gray-600'}`}>Home Service</span>
                    <span className="text-xs text-gray-400 mt-2">Get pampered in your own comfort</span>
                  </div>
                </div>

                <AnimatePresence>
                  {formData.category === 'home' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                          <FaMapMarkerAlt className="text-secondary mr-2" /> Enter your address details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" name="doorNo" placeholder="Door No / Flat" value={formData.address.doorNo} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
                          <input type="text" name="streetName" placeholder="Street Name" value={formData.address.streetName} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
                          <input type="text" name="districtName" placeholder="District Name / City" value={formData.address.districtName} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
                          <input type="text" name="pincode" placeholder="Pincode" value={formData.address.pincode} onChange={handleInputChange} required className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Step 3: Schedule */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-pink-900/5 border border-pink-50">
                <StepHeader number="3" title="Date & Time" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Date</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors"><FaCalendarAlt /></div>
                      <input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Preferred Time</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors"><FaClock /></div>
                      <input type="time" name="time" value={formData.time} onChange={handleInputChange} required className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </form>
          </div>

          {/* Right Column - Summary & Payment */}
          <div className="lg:w-1/3">
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3 }}
              className="bg-gray-900 rounded-[2rem] shadow-2xl p-8 sticky top-28 text-white relative overflow-hidden"
            >
              {/* Card decorations */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <h3 className="text-2xl font-extrabold mb-8 flex items-center relative z-10">
                Booking Summary
              </h3>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 mb-8 border border-white/10 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1 block">Service</span>
                    <h4 className="font-bold text-lg leading-tight">{selectedService}</h4>
                  </div>
                  <div className="bg-primary/20 p-2 rounded-lg text-primary"><FaStar /></div>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Subtotal</span>
                  <span className="text-xl font-extrabold">₹{selectedPrice}</span>
                </div>
              </div>

              <h4 className="font-bold text-lg mb-4 relative z-10">Payment Plan</h4>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div 
                  onClick={() => setFormData({ ...formData, paymentMode: 'full' })}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex items-center ${formData.paymentMode === 'full' ? 'bg-primary border-primary shadow-[0_0_20px_rgba(233,30,99,0.4)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${formData.paymentMode === 'full' ? 'border-white' : 'border-gray-500'}`}>
                    {formData.paymentMode === 'full' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold">Pay in Full</span>
                      <span className="font-bold">₹{selectedPrice}</span>
                    </div>
                    <span className={`text-xs ${formData.paymentMode === 'full' ? 'text-pink-100' : 'text-gray-400'}`}>Settle everything now</span>
                  </div>
                </div>

                <div 
                  onClick={() => setFormData({ ...formData, paymentMode: 'advance' })}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 flex items-center ${formData.paymentMode === 'advance' ? 'bg-secondary border-secondary shadow-[0_0_20px_rgba(255,128,171,0.4)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${formData.paymentMode === 'advance' ? 'border-white' : 'border-gray-500'}`}>
                    {formData.paymentMode === 'advance' && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold">Pay Advance</span>
                      <span className="font-bold">₹{advanceAmount}</span>
                    </div>
                    <span className={`text-xs ${formData.paymentMode === 'advance' ? 'text-pink-100' : 'text-gray-400'}`}>Pay 20% now, rest later</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                form="booking-form"
                className="w-full bg-white text-gray-900 hover:bg-gray-100 font-extrabold py-5 rounded-xl text-lg transition-all transform hover:-translate-y-1 relative z-10 flex justify-center items-center group"
              >
                Pay ₹{amountToPay} 
                <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
              
              <div className="flex items-center justify-center mt-6 text-xs text-gray-400 relative z-10">
                <FaShieldAlt className="mr-2 text-green-400" />
                <span>End-to-end encrypted secure checkout</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
