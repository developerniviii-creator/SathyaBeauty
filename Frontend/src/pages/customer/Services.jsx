import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaStar, FaTimes, FaPlus, FaCheck } from 'react-icons/fa';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [additionalServices, setAdditionalServices] = useState([]);
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/services/`);
        if (res.ok) {
          const data = await res.json();
          // Filter to only show active services
          setServices(data.filter(s => s.status === 'Active'));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchServices();
  }, []);

  // Group services by category
  const categories = services.reduce((acc, service) => {
    const categoryName = service.category || 'General';
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(service);
    return acc;
  }, {});

  const allCategories = ['All', ...Object.keys(categories)];

  const filteredCategories = Object.keys(categories).reduce((acc, category) => {
    if (activeCategory !== 'All' && category !== activeCategory) {
      return acc;
    }
    const filtered = categories[category].filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  const handleBookNowClick = (service) => {
    const token = localStorage.getItem('customer_access_token');
    if (!token) {
      navigate('/signup');
      return;
    }
    setSelectedService(service);
    setAdditionalServices([]);
    setIsModalOpen(true);
  };

  const handleToggleAdditional = (service) => {
    if (additionalServices.find(s => s.id === service.id)) {
      setAdditionalServices(additionalServices.filter(s => s.id !== service.id));
    } else {
      setAdditionalServices([...additionalServices, service]);
    }
  };

  const handleProceedToBooking = () => {
    let finalServiceName = selectedService.name;
    let finalPrice = parseFloat(selectedService.price) || 0;
    
    if (additionalServices.length > 0) {
      const extraNames = additionalServices.map(s => s.name).join(', ');
      finalServiceName = `${selectedService.name} + ${extraNames}`;
      finalPrice += additionalServices.reduce((acc, s) => acc + (parseFloat(s.price) || 0), 0);
    }

    navigate('/book', { state: { service: finalServiceName, price: finalPrice } });
  };

  const suggestedServices = selectedService 
    ? services.filter(s => s.id !== selectedService.id).slice(0, 4)
    : [];

  return (
    <div className="bg-background min-h-screen pb-20 font-sans relative">
      {/* Header Banner */}
      <div className="bg-gray-900 text-white pt-24 pb-16 px-6 relative overflow-hidden border-b border-primary/20 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl z-0"></div>
        
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Our Premium Services</h1>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Explore our wide range of luxury beauty treatments tailored specifically for you. Select a category below to find the perfect service.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-10">
            <input 
              type="text"
              placeholder="Search for a service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 rounded-full bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-primary/50 shadow-lg"
            />
            <FaSearch className="absolute left-6 top-5 text-gray-400 text-lg" />
          </div>

          {/* Category Filter Navbar */}
          <div className="flex flex-wrap justify-center gap-3">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 capitalize tracking-wide shadow-sm
                  ${activeCategory === cat 
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg transform scale-105 border-transparent' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border-gray-700 hover:border-primary/50'
                  } border`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12">
        {Object.keys(filteredCategories).length === 0 ? (
          <div className="text-center py-20 text-gray-500 text-xl">
            No services found matching your search.
          </div>
        ) : (
          Object.entries(filteredCategories).map(([category, services], categoryIndex) => (
            <div key={category} className="mb-20">
              <div className="flex items-center mb-10 border-b border-gray-200 pb-4">
                <h2 className="text-3xl font-extrabold text-gray-800 capitalize mr-4">{category} Services</h2>
                <div className="flex-grow h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {services.map((service, index) => (
                  <motion.div 
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:border-primary/30 transition-all duration-300 group flex flex-col"
                  >
                    <div className="relative overflow-hidden h-60">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-primary/20 transition-colors z-10 duration-300"></div>
                      <img src={service.image || 'https://images.unsplash.com/photo-1560944527-a4a429848866?auto=format&fit=crop&q=80&w=600'} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-gray-800 shadow-md z-20 flex items-center">
                        <FaStar className="text-yellow-400 mr-1" /> Premium
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{service.name}</h3>
                      </div>
                      <p className="text-gray-500 mb-6 text-sm flex-1 leading-relaxed">{service.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span>Duration</span>
                        <span className="font-semibold text-gray-800">{service.duration}</span>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <div>
                          <span className="text-xs text-gray-400 block mb-1">Price</span>
                          <span className="text-2xl font-extrabold text-primary">₹{service.price}</span>
                        </div>
                        <button 
                          onClick={() => handleBookNowClick(service)} 
                          className="bg-gray-900 hover:bg-primary text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Book More Services Modal */}
      <AnimatePresence>
        {isModalOpen && selectedService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10"
            >
              <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">Want to add more services?</h2>
                  <p className="text-gray-500 mt-1">Make the most of your appointment by adding these popular services.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-700 bg-white hover:bg-gray-100 p-2 border border-gray-200 rounded-full transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6">
                <div className="mb-6">
                  <h3 className="font-bold text-gray-700 uppercase tracking-wider text-xs mb-3">Selected Service</h3>
                  <div className="flex justify-between items-center bg-primary/5 border border-primary/20 p-4 rounded-xl">
                    <div className="font-bold text-primary">{selectedService.name}</div>
                    <div className="font-extrabold text-primary">₹{selectedService.price}</div>
                  </div>
                </div>

                <h3 className="font-bold text-gray-700 uppercase tracking-wider text-xs mb-3">Suggested For You</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {suggestedServices.map(service => {
                    const isSelected = additionalServices.find(s => s.id === service.id);
                    return (
                      <div 
                        key={service.id}
                        onClick={() => handleToggleAdditional(service)}
                        className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded flex items-center justify-center mr-3 border transition-colors ${isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300'}`}>
                            {isSelected && <FaCheck size={12} />}
                          </div>
                          <div>
                            <div className={`font-bold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{service.name}</div>
                            <div className="text-xs text-gray-500">{service.duration}</div>
                          </div>
                        </div>
                        <div className="font-bold text-gray-800">
                          + ₹{service.price}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-100 p-6 flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-500">Total Price</span>
                  <div className="text-2xl font-extrabold text-gray-900">
                    ₹{(parseFloat(selectedService.price) || 0) + additionalServices.reduce((acc, s) => acc + (parseFloat(s.price) || 0), 0)}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button 
                    onClick={handleProceedToBooking}
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Skip
                  </button>
                  <button 
                    onClick={handleProceedToBooking}
                    className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    Continue to Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;
