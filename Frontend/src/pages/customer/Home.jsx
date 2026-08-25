import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { mockServices, mockReviews } from '../../utils/dummyData';
import { FaCut, FaHandSparkles, FaHeart, FaStar, FaShieldAlt, FaGem, FaSmileBeam } from 'react-icons/fa';

const Home = () => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const allFeatures = [
    { icon: <FaCut size={32} />, title: 'Expert Stylists', desc: 'Crafting the perfect look for you with modern styling techniques.', bg: 'bg-pink-50', text: 'text-pink-500', border: 'border-pink-200' },
    { icon: <FaHandSparkles size={32} />, title: 'Premium Products', desc: 'Skin-friendly luxury brands that nourish your natural beauty.', bg: 'bg-purple-50', text: 'text-purple-500', border: 'border-purple-200' },
    { icon: <FaHeart size={32} />, title: 'Home Service', desc: 'Pampering professional salon treatments at your doorstep.', bg: 'bg-rose-50', text: 'text-rose-500', border: 'border-rose-200' },
    { icon: <FaShieldAlt size={32} />, title: 'Hygiene First', desc: 'Strict sterilization protocols to ensure your complete safety.', bg: 'bg-blue-50', text: 'text-blue-500', border: 'border-blue-200' },
    { icon: <FaGem size={32} />, title: 'Affordable Luxury', desc: 'Experience premium quality services at pocket-friendly prices.', bg: 'bg-amber-50', text: 'text-amber-500', border: 'border-amber-200' },
    { icon: <FaSmileBeam size={32} />, title: '100% Satisfaction', desc: 'We are dedicated to making sure you leave completely happy.', bg: 'bg-green-50', text: 'text-green-500', border: 'border-green-200' }
  ];

  const displayedFeatures = showAllFeatures ? allFeatures : allFeatures.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1920')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 to-black/60 backdrop-blur-[2px]"></div>
        
        {/* Floating elements for visual flair */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute top-20 left-20 w-32 h-32 bg-primary/30 rounded-full blur-3xl"></motion.div>
        <motion.div animate={{ y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 5 }} className="absolute bottom-20 right-20 w-48 h-48 bg-secondary/30 rounded-full blur-3xl"></motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 text-center text-white px-6 w-full max-w-4xl"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-semibold tracking-widest uppercase mb-6 shadow-lg">
            Luxury Beauty Studio
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
            Unveil Your True <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Radiance</span>
          </h1>
          <p className="text-lg md:text-2xl mb-10 text-gray-200 drop-shadow-md font-light max-w-2xl mx-auto">
            Experience premium salon and home beautician services tailored specifically for you.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
            <Link to="/book" className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-primary to-secondary rounded-xl focus:outline-none shadow-[0_10px_20px_rgba(233,30,99,0.3)] hover:shadow-[0_15px_30px_rgba(233,30,99,0.5)] hover:-translate-y-1">
              Book Appointment Now
              <svg className="w-5 h-5 ml-2 -mr-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
            <div className="relative w-full sm:w-80 group">
              <input 
                type="text" 
                placeholder="Search services..." 
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:bg-white/20 focus:border-white/50 focus:ring-2 focus:ring-white/20 transition-all shadow-lg"
              />
              <svg className="absolute right-4 top-4 w-6 h-6 text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
        </motion.div>
        
        <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
            <svg className="relative block w-full h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,119.3,197.8,109.81c64.12-9.1,128.27-33.15,193.36-41.52" className="fill-background"></path>
            </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Abstract animated background shapes */}
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} className="absolute -left-32 -top-32 w-96 h-96 border-[40px] border-primary/5 rounded-full"></motion.div>
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 50, ease: "linear" }} className="absolute -right-32 -bottom-32 w-96 h-96 border-[40px] border-secondary/5 rounded-full"></motion.div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-primary/10 pb-4">
            <div className="mb-4 md:mb-0">
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">
                The Sathya Beauty Difference
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                Why Choose Us?
              </h2>
            </div>
            <button 
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="text-primary font-bold hover:text-secondary border-b-2 border-primary pb-1 transition-all"
            >
              {showAllFeatures ? 'Show Less' : 'View All Features'}
            </button>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <AnimatePresence>
              {displayedFeatures.map((feature, i) => (
                <motion.div 
                  key={feature.title}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`relative ${feature.bg} p-8 rounded-[2rem] text-left group border-2 ${feature.border} shadow-sm hover:shadow-xl transition-all duration-300`}
                >
                  <div className={`w-16 h-16 bg-white ${feature.text} rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${feature.border} group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 font-medium leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Popular Services Section */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Our Top Picks</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Popular Services</h2>
            </div>
            <Link to="/services" className="hidden md:inline-block text-primary font-bold hover:text-secondary border-b-2 border-primary pb-1">
              View All Services
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockServices.map((service, index) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 hover:border-transparent hover:bg-primary transition-all duration-500 group"
              >
                <div className="relative overflow-hidden h-56">
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-500"></div>
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm z-20 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                    {service.category}
                  </div>
                </div>
                <div className="p-6 relative transition-colors duration-500">
                  <div className="absolute -top-6 right-6 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-white group-hover:text-primary transition-colors duration-500 z-20">
                    <FaStar />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-500">{service.name}</h3>
                  <p className="text-gray-500 mb-6 line-clamp-2 text-sm group-hover:text-pink-100 transition-colors duration-500">{service.description}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100 group-hover:border-white/20 transition-colors duration-500">
                    <div>
                      <span className="text-xs text-gray-400 block group-hover:text-pink-200 transition-colors duration-500">Starting from</span>
                      <span className="text-2xl font-extrabold text-primary group-hover:text-white transition-colors duration-500">₹{service.price}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 text-center md:hidden">
             <Link to="/services" className="inline-block bg-gray-100 text-gray-800 font-bold py-3 px-8 rounded-full">
              View All Services
            </Link>
          </div>
        </div>
      </section>
      
      {/* Reviews Section */}
      <section className="py-24 bg-gradient-to-br from-pink-50 to-white relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">What Our Clients Say</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {mockReviews.map((review, i) => (
              <motion.div 
                key={review.id} 
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-[2rem] shadow-xl border border-white relative"
              >
                {/* Quote Icon watermark */}
                <div className="absolute top-6 right-8 text-7xl text-primary/10 font-serif leading-none">"</div>
                
                <div className="flex text-yellow-400 mb-6 space-x-1 relative z-10">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <p className="text-lg text-gray-700 italic mb-8 relative z-10 leading-relaxed font-light">"{review.comment}"</p>
                
                <div className="flex items-center mt-auto border-t border-gray-100 pt-6">
                  <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md mr-4">
                    {review.customer.charAt(0)}
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900">{review.customer}</span>
                    <span className="block text-primary/60 text-sm font-medium">{review.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
