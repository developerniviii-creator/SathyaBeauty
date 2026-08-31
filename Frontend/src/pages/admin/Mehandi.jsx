import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSave, FaMagic, FaClock, FaTag, FaInfoCircle, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const AdminMehandi = () => {
  const [formData, setFormData] = useState({
    mehandiType: '',
    length: '',
    side: '',
    prize: '',
    description: '',
    duration: '',
    image: null,
  });

  const [savedItems, setSavedItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchMehandiServices = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/services/`);
      if (res.ok) {
        const data = await res.json();
        const mehandiServices = data.filter(s => s.category === 'Mehandi');
        
        const mappedServices = mehandiServices.map(s => {
          const parts = s.name.split(' | ');
          return {
            id: s.id,
            mehandiType: parts[0] || s.name,
            length: parts[1] || '',
            side: parts[2] || '',
            prize: s.price,
            description: s.description,
            duration: s.duration,
            image: s.image
          };
        });
        
        setSavedItems(mappedServices);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMehandiServices();
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
    if (!formData.mehandiType || !formData.prize) return;
    
    const token = localStorage.getItem('admin_access_token');
    const combinedName = `${formData.mehandiType} | ${formData.length} | ${formData.side}`;
    
    const submitData = new FormData();
    submitData.append('name', combinedName);
    submitData.append('price', formData.prize);
    submitData.append('description', formData.description);
    submitData.append('duration', formData.duration);
    submitData.append('category', 'Mehandi');
    submitData.append('status', 'Active');
    
    if (formData.image) {
      submitData.append('image', formData.image);
    }
    
    try {
      if (editingId) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/services/${editingId}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitData
        });
        
        if (res.ok) {
          await fetchMehandiServices();
          setEditingId(null);
        } else {
          alert('Error updating mehandi service: ' + res.statusText);
        }
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/services/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitData
        });
        
        if (res.ok) {
          await fetchMehandiServices();
        } else {
          alert('Error saving mehandi service: ' + res.statusText);
        }
      }
      
      handleCancelEdit();
    } catch (err) {
      console.error(err);
      alert('Network error while saving');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      mehandiType: item.mehandiType,
      length: item.length,
      side: item.side,
      prize: item.prize,
      description: item.description,
      duration: item.duration,
      image: null, // Clear file input when editing, though we could show current image
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mehandi entry?')) {
      const token = localStorage.getItem('admin_access_token');
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/services/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          await fetchMehandiServices();
          if (editingId === id) {
            handleCancelEdit();
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      mehandiType: '',
      length: '',
      side: '',
      prize: '',
      description: '',
      duration: '',
      image: null,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans pb-10">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-end mb-8 relative z-10"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight mb-2">
            Mehandi Prize Management
          </h1>
          <p className="text-gray-500 font-medium">Create and manage your premium mehandi service offerings.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/40 border border-amber-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-bl-full -z-0"></div>
            
            <div className="p-8 relative z-10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaMagic className="text-primary mr-2" /> 
                  {editingId ? 'Edit Entry' : 'Add New Entry'}
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
                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <FaTag className="mr-2 text-primary" /> Mehandi Type
                  </label>
                  <select 
                    name="mehandiType"
                    value={formData.mehandiType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm text-gray-800"
                    required
                  >
                    <option value="" disabled>Select mehandi type</option>
                    <option value="Bridal Mehandi">Bridal Mehandi</option>
                    <option value="Arabic Mehandi">Arabic Mehandi</option>
                    <option value="Indo-Arabic Mehandi">Indo-Arabic Mehandi</option>
                    <option value="Minimalist Design">Minimalist Design</option>
                    <option value="Portrait Mehandi">Portrait Mehandi</option>
                    <option value="Custom Design">Custom Design</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      Length Category
                    </label>
                    <select 
                      name="length"
                      value={formData.length}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm text-gray-800"
                      required
                    >
                      <option value="" disabled>Select length</option>
                      <option value="ELBOW LENGTH">ELBOW LENGTH</option>
                      <option value="3/4TH LENGTH">3/4TH LENGTH</option>
                      <option value="HALF LENGTH">HALF LENGTH</option>
                      <option value="BANGLE LENGTH">BANGLE LENGTH</option>
                      <option value="WRIST LENGTH">WRIST LENGTH</option>
                      <option value="PALM LENGTH">PALM LENGTH</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                      Side
                    </label>
                    <select 
                      name="side"
                      value={formData.side}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm text-gray-800"
                      required
                    >
                      <option value="" disabled>Select side</option>
                      <option value="BACK HAND">BACK HAND</option>
                      <option value="FRONT HAND">FRONT HAND</option>
                      <option value="FRONT AND BACKHAND">FRONT AND BACKHAND</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <span className="mr-2 text-primary font-black">₹</span> Prize Amount
                  </label>
                  <input 
                    type="number" 
                    name="prize"
                    value={formData.prize}
                    onChange={handleChange}
                    placeholder="Enter prize amount"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm text-gray-800 font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <FaClock className="mr-2 text-secondary" /> Duration
                  </label>
                  <input 
                    type="text" 
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 2-3 hours"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm text-gray-800"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    <FaInfoCircle className="mr-2 text-secondary" /> Description
                  </label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter detailed description of the design..."
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm resize-none text-gray-800"
                  ></textarea>
                </div>

                <div>
                  <label className="flex items-center text-sm font-bold text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <input 
                    type="file" 
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all shadow-sm text-gray-800"
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-primary to-secondary rounded-xl hover:shadow-[0_10px_20px_rgba(214,151,0,0.3)] hover:-translate-y-1 focus:outline-none overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                    <span className="relative flex items-center">
                      <FaSave className="mr-2 group-hover:scale-110 transition-transform" size={18} /> 
                      {editingId ? 'Update Entry' : 'Save Entry'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Display Section */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-7"
        >
          <div className="bg-white rounded-3xl shadow-xl shadow-amber-100/40 border border-amber-100 p-8 h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Entries</h2>
            
            {savedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-amber-200 rounded-2xl bg-amber-50/50">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 text-primary shadow-sm">
                  <FaMagic size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-800">No Mehandi Entries Yet</h3>
                <p className="text-gray-500 max-w-xs mt-2 text-sm font-medium">Fill out the form on the left to add a new mehandi prize offering.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {savedItems.map((item) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                      key={item.id}
                      className="p-5 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 bg-white group flex flex-col md:flex-row gap-4 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-50 to-secondary/10 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none -z-0"></div>
                      
                      <div className="flex-1 relative z-10 flex gap-4">
                        {item.image && (
                          <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-amber-100 shadow-sm">
                            <img src={item.image} alt={item.mehandiType} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">
                              {item.mehandiType}
                            </h3>
                            <span className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text font-extrabold text-xl whitespace-nowrap ml-2">
                              ₹{item.prize}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {item.length && (
                              <span className="bg-amber-50 text-primary border border-amber-100 text-xs font-bold px-2 py-1 rounded-md">
                                {item.length}
                              </span>
                            )}
                            {item.side && (
                              <span className="bg-amber-50 text-secondary border border-amber-100 text-xs font-bold px-2 py-1 rounded-md">
                                {item.side}
                              </span>
                            )}
                          </div>
                          {item.duration && (
                            <p className="text-sm text-gray-500 flex items-center mb-2 font-medium">
                              <FaClock className="mr-1 text-primary text-xs" /> {item.duration}
                            </p>
                          )}
                          {item.description && (
                            <p className="text-gray-600 text-sm leading-relaxed mt-2 p-3 bg-gray-50 rounded-xl border border-gray-100 font-medium">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="relative z-10 flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-4">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="flex-1 md:flex-none flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors bg-gray-50 md:bg-transparent"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 md:flex-none flex items-center justify-center p-2 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors bg-gray-50 md:bg-transparent"
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

export default AdminMehandi;
