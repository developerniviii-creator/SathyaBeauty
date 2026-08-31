import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import logo from '../assets/SathyaBeauty.png';

const CustomerLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [address, setAddress] = useState("123 Beauty Avenue, Anna Nagar,\nChennai, Tamil Nadu 600040");
  const { customerUser } = useAuth();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/settings/`)
      .then(response => {
        if (response.data && response.data.application_address) {
          setAddress(response.data.application_address);
        }
      })
      .catch(error => console.error("Error fetching settings:", error));
  }, []);


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <header className="bg-gray-900 backdrop-blur-md sticky top-0 z-50 shadow-xl border-b border-gray-800 transition-all duration-300">
        <div className="container mx-auto px-6 py-4 md:py-6 flex justify-between items-center">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center text-2xl md:text-3xl font-extrabold text-[#D69700] hover:text-[#F0E69C] tracking-tight transition-colors">
            <img src={logo} alt="Sathya Beauty" className="h-10 w-10 md:h-12 md:w-12 mr-3 object-contain drop-shadow-md" />
            Sathya Beauty
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6 text-gray-300 font-medium items-center">
              <li><Link to="/" className="hover:text-[#D69700] transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-[#D69700] transition-colors">Services</Link></li>
              <li><Link to="/packages" className="hover:text-[#D69700] transition-colors">Packages</Link></li>
              <li><Link to="/offers" className="hover:text-[#D69700] transition-colors">Offers</Link></li>
              <li><Link to="/my-bookings" className="hover:text-[#D69700] transition-colors">My Bookings</Link></li>
              {customerUser ? (
                <li>
                  <Link to="/profile" className="text-gray-300 hover:text-[#D69700] text-3xl transition-colors flex items-center justify-center" title="Profile">
                    <FaUserCircle />
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-gray-300 hover:text-[#D69700] font-bold transition-colors">
                      Log in
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="bg-[#D69700] hover:bg-[#c28900] text-gray-900 font-bold py-2 px-6 rounded-full transition-colors shadow-md ml-2 border border-[#D69700]">
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-2xl text-gray-300 hover:text-[#D69700] focus:outline-none transition-colors"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <nav className="container mx-auto px-6 py-4 bg-gray-900 shadow-inner">
                <ul className="flex flex-col space-y-4 text-gray-300 font-bold">
                  <li><Link to="/" onClick={closeMobileMenu} className="block hover:text-[#D69700] transition-colors py-2 border-b border-gray-800">Home</Link></li>
                  <li><Link to="/services" onClick={closeMobileMenu} className="block hover:text-[#D69700] transition-colors py-2 border-b border-gray-800">Services</Link></li>
                  <li><Link to="/packages" onClick={closeMobileMenu} className="block hover:text-[#D69700] transition-colors py-2 border-b border-gray-800">Packages</Link></li>
                  <li><Link to="/offers" onClick={closeMobileMenu} className="block hover:text-[#D69700] transition-colors py-2 border-b border-gray-800">Offers</Link></li>
                  <li><Link to="/my-bookings" onClick={closeMobileMenu} className="block hover:text-[#D69700] transition-colors py-2 border-b border-gray-800">My Bookings</Link></li>
                  {customerUser ? (
                    <li className="pt-2">
                      <Link to="/profile" onClick={closeMobileMenu} className="flex items-center text-gray-300 hover:text-[#D69700] transition-colors py-2 text-xl font-bold">
                        <FaUserCircle className="mr-2" /> Profile
                      </Link>
                    </li>
                  ) : (
                    <>
                      <li className="pt-2">
                        <Link to="/login" onClick={closeMobileMenu} className="block text-gray-300 hover:text-[#D69700] transition-colors py-2">
                          Log in
                        </Link>
                      </li>
                      <li>
                        <Link to="/signup" onClick={closeMobileMenu} className="block bg-[#D69700] hover:bg-[#c28900] text-gray-900 text-center font-bold py-3 rounded-xl transition-colors shadow-sm">
                          Sign Up
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Professional Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16 border-t-4 border-[#D69700] text-left">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="flex flex-col items-start">
              <Link to="/" className="flex items-center text-3xl font-extrabold text-white mb-6 tracking-tight hover:text-[#D69700] transition-colors">
                <img src={logo} alt="Sathya Beauty" className="h-10 w-10 mr-3 object-contain drop-shadow-md" />
                Sathya <span className="text-[#D69700] ml-2">Beauty</span>
              </Link>
              <p className="text-gray-400 leading-relaxed mb-6">
                Your premier destination for luxury beauty and wellness. We bring the best parlour and home beautician services directly to you.
              </p>
              <div className="flex justify-start space-x-4">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#D69700] text-white transition-colors"><FaUserCircle /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#D69700] text-white transition-colors"><FaUserCircle /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#D69700] text-white transition-colors"><FaUserCircle /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 uppercase tracking-wider relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#D69700] rounded-full"></span>
              </h4>
              <ul className="space-y-3">
                <li><Link to="/" className="hover:text-[#D69700] transition-colors flex items-center justify-start"><span className="mr-2 text-[#D69700]">›</span> Home</Link></li>
                <li><Link to="/services" className="hover:text-[#D69700] transition-colors flex items-center justify-start"><span className="mr-2 text-[#D69700]">›</span> Services</Link></li>
                <li><Link to="/packages" className="hover:text-[#D69700] transition-colors flex items-center justify-start"><span className="mr-2 text-[#D69700]">›</span> Packages</Link></li>
                <li><Link to="/offers" className="hover:text-[#D69700] transition-colors flex items-center justify-start"><span className="mr-2 text-[#D69700]">›</span> Offers</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-start">
              <h4 className="text-white text-lg font-bold mb-6 uppercase tracking-wider relative inline-block">
                Contact Us
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#D69700] rounded-full"></span>
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start justify-start text-left">
                  <span className="text-[#D69700] mt-1 mr-3">📍</span>
                  <span>{address.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</span>
                </li>
                <li className="flex items-center justify-start">
                  <span className="text-[#D69700] mr-3">📞</span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center justify-start">
                  <span className="text-[#D69700] mr-3">✉️</span>
                  <span>hello@sathyabeauty.com</span>
                </li>
              </ul>
            </div>

            {/* Working Hours */}
            <div className="flex flex-col items-start">
              <h4 className="text-white text-lg font-bold mb-6 uppercase tracking-wider relative inline-block">
                Working Hours
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#D69700] rounded-full"></span>
              </h4>
              <ul className="space-y-3 w-full max-w-[250px]">
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>Mon - Fri</span>
                  <span className="text-white">9:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-gray-800 pb-2">
                  <span>Saturday</span>
                  <span className="text-white">9:00 AM - 9:00 PM</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Sunday</span>
                  <span className="text-[#D69700] font-bold">10:00 AM - 6:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Sathya Beauty Business Management System. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 md:space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerLayout;
