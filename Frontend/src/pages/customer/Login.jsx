import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/SathyaBeauty.png';

const Login = () => {
  const navigate = useNavigate();
  const { customerLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login/`, {
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
      const profileResponse = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/`, {
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
        confirmButtonColor: '#D69700'
      }).then(() => navigate('/'));
    } catch (error) {
      Swal.fire({
        title: 'Login Failed',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#D69700'
      });
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    setIsGoogleLoading(true);
    try {
      // Send the access token to our backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google-login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token: tokenResponse.access_token })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('customer_access_token', data.access);
        localStorage.setItem('customer_refresh_token', data.refresh);
        customerLogin(data.user);

        Swal.fire({
          title: 'Welcome!',
          text: 'Successfully signed in with Google.',
          icon: 'success',
          confirmButtonColor: '#D69700'
        }).then(() => navigate('/'));
      } else {
        Swal.fire({
          title: 'Google Login Failed',
          text: data.error || 'Could not sign in with Google.',
          icon: 'error',
          confirmButtonColor: '#D69700'
        });
      }
    } catch (err) {
      Swal.fire({
        title: 'Error',
        text: 'Could not connect to the server.',
        icon: 'error',
        confirmButtonColor: '#D69700'
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      Swal.fire({
        title: 'Google Login Failed',
        text: 'Google sign-in was cancelled or failed.',
        icon: 'error',
        confirmButtonColor: '#D69700'
      });
    },
  });

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Side - Image/Branding */}
      <div className="hidden lg:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 to-black/40"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Link to="/" className="text-4xl font-extrabold tracking-tight mb-8 inline-flex items-center gap-4">
              <img src={logo} alt="Sathya Beauty" className="w-16 h-16 object-contain" />
              <div>Sathya <span className="text-primary">Beauty</span></div>
            </Link>
            <h1 className="text-5xl font-bold leading-tight mb-6">
              Your Journey to <br />Radiance Starts Here.
            </h1>
            <p className="text-lg text-amber-100/80 font-light max-w-md">
              Access your personalized beauty dashboard, track your bookings, and unlock exclusive premium offers.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white/95 backdrop-blur-md p-10 rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-primary/20"
        >
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <img src={logo} alt="Sathya Beauty" className="w-14 h-14 object-contain" />
              <span className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-serif">SathyaBeauty</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-gray-700 text-sm font-semibold tracking-wide">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 font-medium placeholder:font-normal placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-gray-700 text-sm font-semibold tracking-wide">Password</label>
                <Link to="/forgot-password" state={{ email: formData.email }} className="text-sm font-medium text-primary hover:text-[#c28900] transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <FaLock />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all text-gray-800 font-medium placeholder:font-normal placeholder-gray-400"
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
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-[#c28900] hover:to-primary text-white font-bold tracking-wide py-4 rounded-xl shadow-[0_8px_20px_rgba(214,151,0,0.3)] hover:shadow-[0_12px_25px_rgba(214,151,0,0.4)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
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
                <span className="px-4 bg-white/95 text-gray-500 font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => googleLogin()}
                disabled={isGoogleLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-200 group disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <svg className="animate-spin h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <FaGoogle className="text-red-500 mr-2 group-hover:scale-110 transition-transform" />
                )}
                <span className="font-semibold text-gray-700">{isGoogleLoading ? 'Signing in...' : 'Google'}</span>
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-600 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-primary hover:text-[#c28900] transition-colors ml-1">
              Sign up for free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

