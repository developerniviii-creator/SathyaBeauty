import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaSpinner, FaChevronDown, FaCheckSquare, FaRegSquare, FaClock, FaCalendarAlt, FaImage } from 'react-icons/fa';

const availableServicesList = [
  "Bridal Mehandi",
  "Hair Extension",
  "Hair Styling",
  "Makeup",
  "Facial"
];

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [isLoading, setIsLoading] = useState(false);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const defaultOffer = {
    id: '',
    name: '',
    services: [],
    originalPrice: '',
    offerPrice: '',
    duration: '',
    validUntil: '',
    image: null
  };

  const [currentOffer, setCurrentOffer] = useState(defaultOffer);

  const fetchOffers = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/offers/');
      if (res.ok) {
        const data = await res.json();
        
        // Map backend fields back to frontend structure
        const mappedOffers = data.map(o => ({
          id: o.id,
          name: o.name,
          originalPrice: o.original_price,
          offerPrice: o.offer_price,
          duration: o.duration,
          validUntil: o.valid_until,
          services: o.services_included ? o.services_included.split(', ') : [],
          image: o.image
        }));
        
        setOffers(mappedOffers);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setCurrentOffer({ ...defaultOffer });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer) => {
    setModalMode('edit');
    setCurrentOffer({ 
      ...offer, 
      services: offer.services || [],
      image: null // clear image input when opening edit
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setCurrentOffer(defaultOffer);
      setIsDropdownOpen(false);
    }, 300); // wait for animation
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentOffer(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentOffer(prev => ({ ...prev, image: e.target.files[0] }));
    }
  };

  const toggleService = (service) => {
    setCurrentOffer(prev => {
      const currentServices = prev.services || [];
      const hasService = currentServices.includes(service);
      if (hasService) {
        return { ...prev, services: currentServices.filter(s => s !== service) };
      } else {
        return { ...prev, services: [...currentServices, service] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem('admin_access_token');
    
    const submitData = new FormData();
    submitData.append('name', currentOffer.name);
    submitData.append('original_price', currentOffer.originalPrice);
    submitData.append('offer_price', currentOffer.offerPrice);
    submitData.append('duration', currentOffer.duration);
    submitData.append('valid_until', currentOffer.validUntil);
    submitData.append('services_included', (currentOffer.services || []).join(', '));
    if (currentOffer.image) {
      submitData.append('image', currentOffer.image);
    }
    
    try {
      if (modalMode === 'add') {
        const res = await fetch('http://127.0.0.1:8000/api/offers/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitData
        });
        if (res.ok) {
          await fetchOffers();
        } else {
          alert('Error saving offer');
        }
      } else {
        const res = await fetch(`http://127.0.0.1:8000/api/offers/${currentOffer.id}/`, {
          method: 'PUT', // or PATCH if you only want to update partial
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitData
        });
        if (res.ok) {
          await fetchOffers();
        } else {
          alert('Error updating offer');
        }
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving offer');
    }

    setIsLoading(false);
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      const token = localStorage.getItem('admin_access_token');
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/offers/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          await fetchOffers();
        } else {
          alert('Error deleting offer');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="relative font-sans min-h-[80vh] pb-10">
      {/* Abstract Backgrounds */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl -z-10"></div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Combo Offer Management</h1>
          <p className="text-gray-500 mt-2 font-medium">Create and manage your premium beauty combos.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md hover:shadow-lg text-white px-6 py-3 rounded-xl flex items-center transition-all duration-300 transform hover:-translate-y-1 font-bold"
        >
          <FaPlus className="mr-2" /> Add Offer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        <AnimatePresence>
          {offers.map((offer) => (
            <motion.div 
              key={offer.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl shadow-pink-100/40 border border-pink-50 overflow-hidden relative group flex flex-col hover:shadow-2xl hover:shadow-pink-200/50 transition-all"
            >
              {offer.validUntil && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-4 py-2 rounded-bl-xl shadow-sm z-10">
                  Valid Till: {offer.validUntil}
                </div>
              )}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

              {/* Offer Image */}
              {offer.image && (
                <div className="w-full h-48 bg-gray-100 relative">
                  <img src={offer.image} alt={offer.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              )}

              <div className="p-8 relative z-10 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">{offer.name}</h3>
                
                {offer.duration && (
                  <p className="text-sm text-gray-500 flex items-center mb-3 font-medium">
                    <FaClock className="mr-2 text-pink-500" /> {offer.duration}
                  </p>
                )}
                
                <div className="mb-6 flex flex-wrap gap-2 flex-1">
                  {offer.services && offer.services.length > 0 ? offer.services.map((srv, idx) => (
                    <span key={idx} className="bg-pink-50 text-pink-600 text-xs font-bold px-3 py-1 rounded-full border border-pink-100">
                      {srv}
                    </span>
                  )) : (
                    <p className="text-sm text-gray-500 italic">No services specified</p>
                  )}
                </div>
                
                <div className="flex items-end space-x-3 mb-8 bg-pink-50/50 p-4 rounded-2xl mt-auto border border-pink-50">
                  <span className="text-3xl font-extrabold text-primary">₹{offer.offerPrice}</span>
                  <span className="text-sm text-gray-500 line-through mb-1 font-medium">₹{offer.originalPrice}</span>
                  <span className="text-xs font-bold text-green-500 mb-1.5 ml-auto bg-green-50 px-2 py-1 rounded-md">
                    Save ₹{(offer.originalPrice - offer.offerPrice).toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-auto">
                  <button 
                    onClick={() => handleOpenEdit(offer)}
                    className="text-gray-500 hover:text-pink-600 hover:bg-pink-50 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-bold flex items-center"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(offer.id)}
                    className="text-gray-500 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-bold flex items-center"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Glassmorphism Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
              onClick={handleCloseModal}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl shadow-pink-200/50 relative z-10 border border-pink-100 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-extrabold text-primary">
                  {modalMode === 'add' ? 'Create Combo Offer' : 'Edit Combo Offer'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-primary bg-gray-50 hover:bg-pink-50 p-2 rounded-full transition-colors"
                >
                  <FaTimes size={18} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <FaImage className="mr-2 text-pink-500" /> Offer Image
                  </label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all shadow-sm text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                  />
                  {currentOffer.image && typeof currentOffer.image === 'string' && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Current Image:</p>
                      <img src={currentOffer.image} alt="Current" className="h-24 rounded-lg object-cover border border-gray-200" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Combo Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={currentOffer?.name || ''} 
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all shadow-sm text-gray-800"
                    placeholder="Enter combo offer name"
                  />
                </div>
                
                <div className="relative" ref={dropdownRef}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Add Services</label>
                  <div 
                    className="w-full px-5 py-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-2xl cursor-pointer flex justify-between items-center shadow-sm transition-colors"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className={`truncate ${currentOffer.services?.length ? 'text-gray-800 font-bold' : 'text-gray-500'}`}>
                      {currentOffer.services?.length > 0 
                        ? currentOffer.services.join(', ') 
                        : 'Select services'}
                    </span>
                    <FaChevronDown className={`text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full mt-2 bg-white rounded-2xl shadow-xl border border-pink-100 overflow-hidden"
                      >
                        <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
                          {availableServicesList.map(service => {
                            const isSelected = (currentOffer.services || []).includes(service);
                            return (
                              <div 
                                key={service}
                                onClick={() => toggleService(service)}
                                className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-colors ${isSelected ? 'bg-pink-50' : 'hover:bg-gray-50'}`}
                              >
                                {isSelected ? (
                                  <FaCheckSquare className="text-pink-500 mr-3 text-lg" />
                                ) : (
                                  <FaRegSquare className="text-gray-300 mr-3 text-lg" />
                                )}
                                <span className={`font-bold ${isSelected ? 'text-pink-700' : 'text-gray-600'}`}>{service}</span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      <FaClock className="mr-2 text-pink-500" /> Duration
                    </label>
                    <input 
                      type="text" 
                      name="duration"
                      value={currentOffer?.duration || ''} 
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all shadow-sm text-gray-800"
                      placeholder="e.g. 2-3 hours"
                    />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      <FaCalendarAlt className="mr-2 text-purple-500" /> Valid Until
                    </label>
                    <input 
                      type="text" 
                      name="validUntil"
                      value={currentOffer?.validUntil || ''} 
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all shadow-sm text-gray-800"
                      placeholder="e.g. 31 Dec, 2026"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Original Price (₹)</label>
                    <input 
                      type="number" 
                      name="originalPrice"
                      value={currentOffer?.originalPrice || ''} 
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all shadow-sm text-gray-800"
                      placeholder="Enter original price"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Offer Price (₹)</label>
                    <input 
                      type="number" 
                      name="offerPrice"
                      value={currentOffer?.offerPrice || ''} 
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all shadow-sm font-bold text-purple-700"
                      placeholder="Enter discounted price"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl hover:shadow-[0_10px_20px_rgba(236,72,153,0.4)] hover:-translate-y-1 focus:outline-none overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                    <span className="relative flex items-center text-lg tracking-wide">
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-3" size={20} />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="mr-3 group-hover:scale-110 transition-transform" size={20} /> 
                          {modalMode === 'add' ? 'Save Combo Offer' : 'Update Combo Offer'}
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOffers;
