import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserShield, FaEnvelope, FaLock, FaKey, FaArrowLeft, FaEye, FaEyeSlash, FaSpa } from 'react-icons/fa';
import Swal from 'sweetalert2';

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin-send-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
      
      Swal.fire({
        title: 'OTP Sent!',
        text: 'Check your email for the verification code.',
        icon: 'success',
        confirmButtonColor: '#ec4899'
      });
      setStep(2);
    } catch (error) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonColor: '#ec4899' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin-verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid OTP');
      
      setStep(3);
    } catch (error) {
      Swal.fire({ title: 'Invalid OTP', text: error.message, icon: 'error', confirmButtonColor: '#ec4899' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      Swal.fire({ title: 'Password too short', text: 'Password must be at least 8 characters long.', icon: 'error', confirmButtonColor: '#ec4899' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({ title: 'Passwords mismatch', text: 'Ensure both passwords match.', icon: 'error', confirmButtonColor: '#ec4899' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/admin-reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to reset password');
      
      Swal.fire({
        title: 'Password Reset!',
        text: 'Your admin password has been updated successfully.',
        icon: 'success',
        confirmButtonColor: '#ec4899'
      }).then(() => navigate('/admin-login'));
    } catch (error) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', confirmButtonColor: '#ec4899' });
    } finally {
      setLoading(false);
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
        {/* Left Side - Image/Branding */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-pink-400 to-primary p-12 flex-col justify-between overflow-hidden">
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
                Regain Access<br/>Securely.
              </h2>
              <p className="text-pink-50 text-lg font-medium max-w-sm">
                Follow the verification process to securely reset your admin password.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-10 sm:p-14 lg:p-16 flex flex-col justify-center bg-white relative">
          
          <Link to="/admin-login" className="absolute top-8 left-8 text-gray-500 hover:text-primary transition-colors flex items-center gap-2 font-semibold">
            <FaArrowLeft /> Back to Login
          </Link>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center md:text-left mb-10 mt-6">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-primary mb-6 mx-auto md:mx-0 shadow-inner"
                  >
                    <FaUserShield className="text-3xl" />
                  </motion.div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Forgot Password</h2>
                  <p className="text-gray-500 font-medium text-lg">Send an OTP to your admin email.</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Admin Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <FaEnvelope />
                      </div>
                      <input
                        type="email"
                        required
                        readOnly
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-100 border border-gray-200 rounded-2xl focus:outline-none transition-all text-gray-500 font-semibold shadow-sm cursor-not-allowed"
                        placeholder="admin@sathyabeauty.com"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-pink-500 to-primary rounded-2xl hover:shadow-[0_10px_25px_rgba(236,72,153,0.4)] hover:-translate-y-1 focus:outline-none overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                    <span className="relative text-lg tracking-wide">{loading ? 'Sending...' : 'Send OTP'}</span>
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center md:text-left mb-10 mt-6">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-primary mb-6 mx-auto md:mx-0 shadow-inner"
                  >
                    <FaKey className="text-3xl" />
                  </motion.div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Verify OTP</h2>
                  <p className="text-gray-500 font-medium text-lg">Enter the 4-digit code sent to your email.</p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">4-Digit OTP</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <FaKey />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength="4"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pink-500/20 focus:border-primary outline-none transition-all text-gray-800 font-semibold shadow-sm text-center tracking-widest text-xl"
                        placeholder="••••"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 4}
                    className="w-full relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-pink-500 to-primary rounded-2xl hover:shadow-[0_10px_25px_rgba(236,72,153,0.4)] hover:-translate-y-1 focus:outline-none overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                    <span className="relative text-lg tracking-wide">{loading ? 'Verifying...' : 'Verify OTP'}</span>
                  </button>
                  <button type="button" onClick={() => navigate('/admin-login')} className="w-full mt-4 text-gray-500 font-semibold hover:text-primary transition-colors">Cancel</button>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center md:text-left mb-10 mt-6">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-primary mb-6 mx-auto md:mx-0 shadow-inner"
                  >
                    <FaLock className="text-3xl" />
                  </motion.div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Set New Password</h2>
                  <p className="text-gray-500 font-medium text-lg">Create a strong, secure password.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <FaLock />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength="8"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pink-500/20 focus:border-primary outline-none transition-all text-gray-800 font-semibold shadow-sm"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-primary transition-colors focus:outline-none">
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 font-medium">Enter a minimum of 8 characters.</p>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <FaLock />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-pink-500/20 focus:border-primary outline-none transition-all text-gray-800 font-semibold shadow-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-pink-500 to-primary rounded-2xl hover:shadow-[0_10px_25px_rgba(236,72,153,0.4)] hover:-translate-y-1 focus:outline-none overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                    <span className="relative text-lg tracking-wide">{loading ? 'Updating...' : 'Update Password'}</span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminForgotPassword;
