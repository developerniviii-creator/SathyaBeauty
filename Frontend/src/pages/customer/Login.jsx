import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { customerLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.email, password: formData.password })
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const tokenData = await response.json();
      localStorage.setItem('customer_access_token', tokenData.access);
      localStorage.setItem('customer_refresh_token', tokenData.refresh);

      // Fetch user profile
      const profileResponse = await fetch('http://127.0.0.1:8000/api/users/profile/', {
        headers: { 'Authorization': `Bearer ${tokenData.access}` }
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData = await profileResponse.json();
      customerLogin(userData);

      Swal.fire({
        title: 'Welcome Back!',
        text: 'Successfully logged in.',
        icon: 'success',
        confirmButtonColor: '#E91E63'
      }).then(() => navigate('/'));
    } catch (error) {
      Swal.fire({
        title: 'Login Failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#E91E63'
      });
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/90 to-black/40"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Link to="/" className="text-4xl font-extrabold tracking-tight mb-8 inline-block">
              Sathya <span className="text-primary">Beauty</span>
            </Link>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Your Journey to <br />Radiance Starts Here.
            </h1>
            <p className="text-lg text-pink-100/80 font-light max-w-md">
              Access your personalized beauty dashboard, track your bookings, and unlock exclusive premium offers.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-2xl border border-pink-50"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-800"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-bold">Password</label>
                <Link to="/forgot-password" state={{ email: formData.email }} className="text-sm font-semibold text-primary hover:text-secondary transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-800"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(233,30,99,0.2)] hover:shadow-[0_15px_30px_rgba(233,30,99,0.4)] transition-all transform hover:-translate-y-1"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button className="flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <FaGoogle className="text-red-500 mr-2" />
                <span className="font-semibold text-gray-700">Google</span>
              </button>
              <button className="flex justify-center items-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <FaFacebookF className="text-blue-600 mr-2" />
                <span className="font-semibold text-gray-700">Facebook</span>
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-primary hover:text-secondary transition-colors">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
