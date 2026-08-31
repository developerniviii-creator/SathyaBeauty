import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaCut, FaRulerVertical, FaRupeeSign, FaStar, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const AdminHairExtensions = () => {
  const [formData, setFormData] = useState({
    inches: '',
    mediumPrice: '',
    maximumPrice: '',
    fullCoverPrice: '',
    image: null,
  });

  const [savedItems, setSavedItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchHairExtensions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/services/`);
      if (res.ok) {
        const data = await res.json();
        const extensions = data.filter(s => s.category === 'Hair Extensions');
        
        // Group individual backend services by inches
        const grouped = {};
        
        extensions.forEach(service => {
          const match = service.name.match(/^(\d+) Inches/);
          if (match) {
            const inches = match[1];
            if (!grouped[inches]) {
              grouped[inches] = {
                id: inches, // use inches as the unique ID for the grouped item
                inches: inches,
                mediumPrice: '',
                maximumPrice: '',
                fullCoverPrice: '',
                image: service.image, // pick image from the first service found
                services: [] // keep track of raw services for deletion
              };
            }
            
            grouped[inches].services.push(service);
            
            if (service.duration === 'Medium Package') {
              grouped[inches].mediumPrice = service.price;
            } else if (service.duration === 'Max Package') {
              grouped[inches].maximumPrice = service.price;
            } else if (service.duration === 'Full Cover Package') {
              grouped[inches].fullCoverPrice = service.price;
            }
          }
        });
        
        setSavedItems(Object.values(grouped));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHairExtensions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.inches || !formData.mediumPrice || !formData.maximumPrice || !formData.fullCoverPrice) return;
    
    const token = localStorage.getItem('admin_access_token');
    
    const packages = [
      { type: 'Medium Package', price: formData.mediumPrice },
      { type: 'Max Package', price: formData.maximumPrice },
      { type: 'Full Cover Package', price: formData.fullCoverPrice }
    ];
    
    try {
      // If editing, first delete the existing 3 services
      if (editingId) {
        const itemToEdit = savedItems.find(item => item.id === editingId);
        if (itemToEdit && itemToEdit.services) {
          await Promise.all(itemToEdit.services.map(s => 
            fetch(`${import.meta.env.VITE_API_URL}/services/${s.id}/`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            })
          ));
        }
      }
      
      // POST the 3 new package services
      const responses = await Promise.all(packages.map(async (pkg) => {
        const submitData = new FormData();
        submitData.append('name', `${formData.inches} Inches Hair Extension`);
        submitData.append('category', 'Hair Extensions');
        submitData.append('price', pkg.price);
        submitData.append('duration', pkg.type);
        submitData.append('status', 'Active');
        submitData.append('description', `Premium quality hair extension - ${pkg.type}`);
        
        // Only append image if it's a File object (not a string URL from an existing service)
        if (formData.image && formData.image instanceof File) {
          submitData.append('image', formData.image);
        }
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/services/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: submitData
        });
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          console.error("Failed to store service:", errData);
          throw new Error("Failed to store service: " + JSON.stringify(errData));
        }
        return res;
      }));

      await fetchHairExtensions();
      setEditingId(null);
      setFormData({
        inches: '',
        mediumPrice: '',
        maximumPrice: '',
        fullCoverPrice: '',
        image: null,
      });
      
    } catch (err) {
      console.error(err);
      alert('Network error while saving');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      inches: item.inches,
      mediumPrice: item.mediumPrice,
      maximumPrice: item.maximumPrice,
      fullCoverPrice: item.fullCoverPrice,
      image: null,
    });
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete all packages for this hair extension length?')) {
      const token = localStorage.getItem('admin_access_token');
      try {
        const itemToDelete = savedItems.find(item => item.id === id);
        if (itemToDelete && itemToDelete.services) {
          await Promise.all(itemToDelete.services.map(s => 
            fetch(`${import.meta.env.VITE_API_URL}/services/${s.id}/`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            })
          ));
        }
        
        await fetchHairExtensions();
        if (editingId === id) {
          handleCancelEdit();
        }
      } catch (err) {
        console.error(err);
        alert('Network error while deleting');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      inches: '',
      mediumPrice: '',
      maximumPrice: '',
      fullCoverPrice: '',
      image: null,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-10 relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center md:text-left"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight mb-3">
          Add Hair Extension Services
        </h1>
        <p className="text-gray-500 font-medium text-lg">Manage lengths and pricing for premium hair extensions.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/40 border border-amber-100 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
            
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaCut className="text-primary mr-3" /> 
                {editingId ? 'Edit Entry' : 'New Extension Entry'}
              </h2>
              {editingId && (
                <button 
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 p-2 rounded-full transition-colors text-xs flex items-center"
                >
                  <FaTimes className="mr-1" /> Cancel
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Inches */}
              <div className="relative group">
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  <FaRulerVertical className="mr-2 text-primary" /> Length (Inches)
                </label>
                <input 
                  type="number" 
                  name="inches"
                  value={formData.inches}
                  onChange={handleChange}
                  placeholder="Enter hair extension length in inches"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm text-gray-800"
                  required
                />
              </div>

              {/* Medium Price */}
              <div className="relative group">
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  <FaRupeeSign className="mr-2 text-secondary" /> Medium Package Price
                </label>
                <input 
                  type="number" 
                  name="mediumPrice"
                  value={formData.mediumPrice}
                  onChange={handleChange}
                  placeholder="Enter medium package price"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all shadow-sm text-gray-800"
                  required
                />
              </div>

              {/* Maximum Price */}
              <div className="relative group">
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  <FaRupeeSign className="mr-2 text-secondary" /> Maximum Package Price
                </label>
                <input 
                  type="number" 
                  name="maximumPrice"
                  value={formData.maximumPrice}
                  onChange={handleChange}
                  placeholder="Enter maximum package price"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all shadow-sm text-gray-800"
                  required
                />
              </div>

              {/* Full Cover Price */}
              <div className="relative group">
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  <FaStar className="mr-2 text-yellow-500" /> Full Cover Price
                </label>
                <input 
                  type="number" 
                  name="fullCoverPrice"
                  value={formData.fullCoverPrice}
                  onChange={handleChange}
                  placeholder="Enter full cover package price"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none transition-all shadow-sm text-gray-800"
                  required
                />
              </div>

              {/* Upload Image */}
              <div className="relative group">
                <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                  Upload Image
                </label>
                <input 
                  type="file" 
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm text-gray-800"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-primary to-secondary rounded-2xl hover:shadow-[0_10px_20px_rgba(214,151,0,0.4)] hover:-translate-y-1 focus:outline-none overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                  <span className="relative flex items-center text-lg tracking-wide">
                    <FaSave className="mr-3 group-hover:scale-110 transition-transform" size={20} /> 
                    {editingId ? 'Update Entry' : 'Save Entry'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Display Section */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-7"
        >
          <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/40 border border-amber-100 p-8 h-full min-h-[500px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
              Active Offerings
            </h2>
            
            {savedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center border-2 border-dashed border-amber-200 rounded-3xl bg-amber-50/50">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm text-primary">
                  <FaCut size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">No Services Yet</h3>
                <p className="text-gray-500 max-w-sm mt-3 font-medium">Add hair extension lengths and their corresponding package prices on the left.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                  {savedItems.map((item) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      key={item.id}
                      className="p-6 rounded-3xl bg-white border border-gray-100 hover:border-amber-200 shadow-sm hover:shadow-xl hover:shadow-amber-100/50 transition-all duration-300 group relative overflow-hidden flex flex-col md:flex-row gap-4"
                    >
                      {/* Decorative element */}
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-amber-100 to-secondary/30 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

                      <div className="relative z-10 flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4 min-w-[240px]">
                          {item.image ? (
                            <div className="min-w-[56px] h-14 rounded-2xl overflow-hidden shadow-lg shrink-0 border border-amber-100">
                              <img src={item.image} alt={`${item.inches} Inches`} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="min-w-[56px] h-14 px-3 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shrink-0">
                              <span className="font-black text-lg sm:text-xl">{item.inches}"</span>
                            </div>
                          )}
                          <div>
                            <h3 className="font-bold text-lg xl:text-xl text-gray-800 group-hover:text-primary transition-colors">
                              {item.inches} Inches Extension
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">Premium Quality Hair</p>
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-3 bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-100 w-full">
                          <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                            <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center">
                              <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span> Medium
                            </span>
                            <span className="font-extrabold text-gray-800 text-base sm:text-lg">₹{item.mediumPrice}</span>
                          </div>
                          
                          <div className="flex justify-between items-center border-b border-gray-200/60 pb-3">
                            <span className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center">
                              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span> Max
                            </span>
                            <span className="font-extrabold text-gray-800 text-base sm:text-lg">₹{item.maximumPrice}</span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-xs sm:text-sm font-bold text-secondary uppercase tracking-wider flex items-center">
                              <span className="w-2 h-2 rounded-full bg-secondary mr-2"></span> Full Cover
                            </span>
                            <span className="font-black text-primary text-base sm:text-lg">₹{item.fullCoverPrice}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative z-10 flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-4 mt-2 md:mt-0">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="flex-1 md:flex-none flex items-center justify-center p-3 rounded-xl text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors bg-gray-50 md:bg-transparent"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 md:flex-none flex items-center justify-center p-3 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors bg-gray-50 md:bg-transparent"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminHairExtensions;
