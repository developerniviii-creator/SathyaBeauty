import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserShield, FaLock, FaEnvelope, FaSpa, FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/admin-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('admin_access_token', data.access);
        localStorage.setItem('admin_refresh_token', data.refresh);
        adminLogin({ name: 'Admin', email: formData.email });
        
        Swal.fire({
          title: 'Welcome Back!',
          text: 'Securely logged into Admin Dashboard.',
          icon: 'success',
          confirmButtonColor: '#ec4899', // pink-500
          background: '#fff',
          color: '#1f2937' // gray-800
        }).then(() => navigate('/admin'));
      } else {
        Swal.fire({
          title: 'Login Failed',
          text: data.detail || 'Invalid email or password.',
          icon: 'error',
          confirmButtonColor: '#ec4899'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'Could not connect to the server.',
        icon: 'error',
        confirmButtonColor: '#ec4899'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pink-200/40 rounded-full blur-3xl -z-0 transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-3xl -z-0 transform -translate-x-1/3 translate-y-1/3"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl bg-white rounded-[40px] shadow-2xl shadow-pink-200/60 z-10 flex flex-col md:flex-row overflow-hidden border border-pink-100 min-h-[600px]"
      >
        {/* Left Side - Image/Branding (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-pink-400 to-primary p-12 flex-col justify-between overflow-hidden">
          {/* Overlay Image */}
          <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
            <img 
              src="https://images.unsplash.com/photo-1560944527-a4a429848866?auto=format&fit=crop&q=80&w=1000" 
              alt="Spa Background" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white">
                <FaSpa size={24} />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">Sathya Beauty</h1>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <h2 className="text-5xl font-bold text-white leading-tight mb-6">
                Premium<br/>Salon & Spa<br/>Management
              </h2>
              <p className="text-pink-50 text-lg font-medium max-w-sm">
                Streamline your bookings, manage customers, and grow your beauty business efficiently.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10">
            <div className="flex -space-x-4">
              <img src="https://i.pravatar.cc/100?img=1" className="w-12 h-12 rounded-full border-2 border-white/50 shadow-lg" alt="User" />
              <img src="https://i.pravatar.cc/100?img=2" className="w-12 h-12 rounded-full border-2 border-white/50 shadow-lg" alt="User" />
              <img src="https://i.pravatar.cc/100?img=3" className="w-12 h-12 rounded-full border-2 border-white/50 shadow-lg" alt="User" />
              <div className="w-12 h-12 rounded-full border-2 border-white/50 shadow-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xs">
                +2k
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mt-3">Trusted by professionals worldwide</p>
          </div>
        </div>
        
        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-10 sm:p-14 lg:p-16 flex flex-col justify-center bg-white relative">
          
          <div className="text-center md:text-left mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-primary mb-6 mx-auto md:mx-0 shadow-inner"
            >
              <FaUserShield className="text-3xl" />
            </motion.div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Admin Portal</h2>
            <p className="text-gray-500 font-medium text-lg">Sign in to manage Sathya Beauty.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-gray-700 text-sm font-bold mb-2">Admin Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <FaEnvelope />
                </div>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pink-500/20 focus:border-primary outline-none transition-all text-gray-800 font-semibold shadow-sm"
                  placeholder="admin@sathyabeauty.com" 
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-bold">Password</label>
                <Link to="/admin-forgot-password" state={{ email: formData.email }} className="text-xs font-bold text-primary hover:text-pink-700 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <FaLock />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pink-500/20 focus:border-primary outline-none transition-all text-gray-800 font-semibold shadow-sm"
                  placeholder="••••••••" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="pt-4"
            >
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-pink-500 to-primary rounded-2xl hover:shadow-[0_10px_25px_rgba(236,72,153,0.4)] hover:-translate-y-1 focus:outline-none overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                <span className="relative text-lg tracking-wide flex items-center">
                  {isLoading ? 'Authenticating...' : 'Sign In Securely'}
                </span>
              </button>
            </motion.div>
          </form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-400 font-medium">
              Secure 256-bit connection established. <br/> Unauthorized access is strictly prohibited.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
