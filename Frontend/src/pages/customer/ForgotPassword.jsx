import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaKey, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ForgotPassword = () => {
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
      const response = await fetch('http://127.0.0.1:8000/api/auth/send-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
      
      Swal.fire({
        title: 'OTP Sent!',
        text: 'Please check your email for the OTP.',
        icon: 'success',
        confirmButtonColor: '#E91E63'
      });
      setStep(2);
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#E91E63'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/verify-otp/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid OTP');

      setStep(3);
    } catch (error) {
      Swal.fire({
        title: 'Invalid OTP',
        text: error.message || 'Please enter the correct OTP.',
        icon: 'error',
        confirmButtonColor: '#E91E63'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      return Swal.fire({
        title: 'Error',
        text: 'Password must be at least 8 characters long.',
        icon: 'error',
        confirmButtonColor: '#E91E63'
      });
    }
    if (newPassword !== confirmPassword) {
      return Swal.fire({
        title: 'Error',
        text: 'Passwords do not match!',
        icon: 'error',
        confirmButtonColor: '#E91E63'
      });
    }
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to reset password');

      Swal.fire({
        title: 'Password Updated!',
        text: 'Your password has been reset successfully.',
        icon: 'success',
        confirmButtonColor: '#E91E63'
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#E91E63'
      });
    } finally {
      setLoading(false);
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
              Regain Access to <br />Your Account.
            </h1>
            <p className="text-lg text-pink-100/80 font-light max-w-md">
              Securely reset your password and continue your journey to radiance.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-background px-6 py-12 relative">
        <Link to="/login" className="absolute top-8 left-8 text-gray-500 hover:text-primary transition-colors flex items-center gap-2 font-semibold">
          <FaArrowLeft /> Back to Login
        </Link>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-2xl border border-pink-50 overflow-hidden"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Forgot Password?</h2>
                  <p className="text-gray-500">Enter your registered email to receive an OTP.</p>
                </div>
                <form onSubmit={handleSendOtp} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <FaEnvelope />
                      </div>
                      <input
                        type="email"
                        required
                        readOnly
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-200 border border-gray-200 rounded-xl focus:outline-none transition-all text-gray-500 cursor-not-allowed"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(233,30,99,0.2)] hover:shadow-[0_15px_30px_rgba(233,30,99,0.4)] transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Verify OTP</h2>
                  <p className="text-gray-500">Enter the 4-digit code sent to {email}</p>
                </div>
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">One Time Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <FaKey />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 text-center tracking-widest text-xl font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-800"
                        placeholder="----"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || otp.length < 4}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(233,30,99,0.2)] hover:shadow-[0_15px_30px_rgba(233,30,99,0.4)] transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  <p className="text-center text-sm text-gray-500 mt-4">
                    Didn't receive the code? <button type="button" onClick={handleSendOtp} className="text-primary font-semibold hover:underline">Resend</button>
                  </p>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Set New Password</h2>
                  <p className="text-gray-500">Create a strong, new password for your account.</p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <FaLock />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength="8"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-800"
                        placeholder="Enter new password"
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
                        type={showPassword ? "text" : "password"}
                        required
                        minLength="8"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-gray-800"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading || newPassword.length < 6}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold py-4 rounded-xl shadow-[0_10px_20px_rgba(233,30,99,0.2)] hover:shadow-[0_15px_30px_rgba(233,30,99,0.4)] transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
