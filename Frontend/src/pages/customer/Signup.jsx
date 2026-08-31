import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/SathyaBeauty.png';
import signupImage from '../../assets/Signupimage.png';

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
        confirmButtonColor: '#D69700'
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        title: 'Passwords do not match',
        text: 'Please make sure your passwords match.',
        icon: 'error',
        confirmButtonColor: '#D69700'
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
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register/`, {
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
        confirmButtonColor: '#D69700'
      }).then(() => navigate('/'));
    } catch (error) {
      Swal.fire({
        title: 'Signup Failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#D69700'
      });
    }
  };

  return (
    <div className="h-screen overflow-hidden flex font-sans">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6 py-8 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[600px] bg-white/95 backdrop-blur-md p-10 lg:p-12 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-primary/20 my-auto"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={logo} alt="Sathya Beauty" className="w-14 h-14 object-contain" />
              <span className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-serif">SathyaBeauty</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Create Account</h2>
            <p className="text-base text-gray-500 font-medium">Join us to start your beauty journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-gray-700 text-sm font-semibold tracking-wide">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <FaUser size={14} />
                </div>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 font-medium placeholder:font-normal placeholder-gray-400"
                  placeholder="John Doe" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-700 text-sm font-semibold tracking-wide">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <FaEnvelope size={14} />
                </div>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 font-medium placeholder:font-normal placeholder-gray-400"
                  placeholder="name@example.com" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-700 text-sm font-semibold tracking-wide">Phone Number</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <FaPhone size={14} />
                </div>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 font-medium placeholder:font-normal placeholder-gray-400"
                  placeholder="+91 9876543210" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-700 text-sm font-semibold tracking-wide">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <FaLock size={14} />
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
                  className="w-full pl-10 pr-10 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 font-medium placeholder:font-normal placeholder-gray-400"
                  placeholder="Create a strong password" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-gray-700 text-sm font-semibold tracking-wide">Confirm Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <FaLock size={14} />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full pl-10 pr-10 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 font-medium placeholder:font-normal placeholder-gray-400"
                  placeholder="Confirm your password" 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-primary transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-[#c28900] hover:to-primary text-white font-bold tracking-wide py-3.5 rounded-xl shadow-[0_8px_20px_rgba(214,151,0,0.3)] hover:shadow-[0_12px_25px_rgba(214,151,0,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 mt-6"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-primary hover:text-[#c28900] transition-colors ml-1">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image/Branding */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: `url(${signupImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-amber-900/30"></div>
        <div className="relative z-10 flex flex-col justify-end px-16 pb-24 text-white w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl font-bold leading-tight mb-4">
              "Beauty is about enhancing what you have. Let yourself shine through."
            </h1>
            <p className="text-lg text-amber-100/80 font-light max-w-md">
              Join thousands of satisfied customers who trust us with their beauty and wellness needs.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
