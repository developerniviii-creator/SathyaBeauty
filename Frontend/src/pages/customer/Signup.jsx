import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { customerLogin } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 8) {
      Swal.fire({
        title: 'Password too short',
        text: 'Password must be at least 8 characters long.',
        icon: 'error',
        confirmButtonColor: '#E91E63'
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: 'Passwords do not match',
        text: 'Please make sure your passwords match.',
        icon: 'error',
        confirmButtonColor: '#E91E63'
      });
      return;
    }
    
    try {
      const nameParts = formData.name.split(' ');
      const payload = {
        username: formData.email,
        email: formData.email,
        password: formData.password,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        phone_number: formData.phone
      };
      
      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(Object.values(errorData).flat().join(', ') || 'Registration failed');
      }
      
      const responseData = await response.json();
      customerLogin(responseData.user);
      localStorage.setItem('customer_access_token', responseData.access);
      localStorage.setItem('customer_refresh_token', responseData.refresh);
      
      Swal.fire({
        title: 'Account Created!',
        text: 'Welcome to Sathya Beauty.',
        icon: 'success',
        confirmButtonColor: '#E91E63'
      }).then(() => navigate('/'));
    } catch (error) {
      Swal.fire({
        title: 'Signup Failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#E91E63'
      });
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-2xl border border-pink-50"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Join us to start your beauty journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaUser />
                </div>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-800"
                  placeholder="John Doe" 
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-800"
                  placeholder="name@example.com" 
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaPhone />
                </div>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-800"
                  placeholder="+91 98765 43210" 
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  minLength="8"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-800"
                  placeholder="Create a strong password" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 font-medium">Enter a minimum of 8 characters.</p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-800"
                  placeholder="Confirm your password" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(233,30,99,0.2)] hover:shadow-[0_15px_30px_rgba(233,30,99,0.4)] transition-all transform hover:-translate-y-1 mt-4"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-secondary transition-colors">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516975080661-4680fb2b7f3b?auto=format&fit=crop&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-pink-900/30"></div>
        <div className="relative z-10 flex flex-col justify-end px-16 pb-24 text-white w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              "Beauty is about enhancing what you have. Let yourself shine through."
            </h1>
            <p className="text-lg text-pink-100/80 font-light max-w-md">
              Join thousands of satisfied customers who trust us with their beauty and wellness needs.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
