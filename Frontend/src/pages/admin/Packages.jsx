import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaSave, FaMinusCircle } from 'react-icons/fa';

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentPackage, setCurrentPackage] = useState(null);

  const defaultPackage = {
    id: '',
    name: '',
    price: '',
    description: '',
    service_ids: [],
    image: null
  };

  const fetchPackages = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/packages/');
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/services/');
      if (res.ok) {
        const data = await res.json();
        setAvailableServices(data.filter(s => s.status === 'Active'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPackages();
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setModalMode('add');
    setCurrentPackage({ ...defaultPackage, service_ids: [] });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setModalMode('edit');
    setCurrentPackage({ 
      ...pkg, 
      service_ids: pkg.services ? pkg.services.map(s => s.id) : [] 
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setCurrentPackage(null), 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPackage(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCurrentPackage(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('admin_access_token');
    
    const formData = new FormData();
    formData.append('name', currentPackage.name);
    formData.append('description', currentPackage.description);
    formData.append('price', currentPackage.price);
    
    // Append each service id individually for Django DRF ManyToManyField
    if (currentPackage.service_ids && currentPackage.service_ids.length > 0) {
      currentPackage.service_ids.forEach(id => formData.append('service_ids', id));
    }
    
    if (currentPackage.image && typeof currentPackage.image !== 'string') {
      formData.append('image', currentPackage.image);
    }

    try {
      if (modalMode === 'add') {
        const res = await fetch('http://127.0.0.1:8000/api/packages/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        if (res.ok) {
          await fetchPackages();
        } else {
          alert('Error adding package: ' + res.statusText);
        }
      } else {
        const res = await fetch(`http://127.0.0.1:8000/api/packages/${currentPackage.id}/`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        if (res.ok) {
          await fetchPackages();
        } else {
          alert('Error updating package: ' + res.statusText);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Network error while saving package.');
    }
    
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      const token = localStorage.getItem('admin_access_token');
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/packages/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          await fetchPackages();
        } else {
          alert('Error deleting package');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="relative font-sans min-h-[80vh] pb-10">
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink-200/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl -z-10"></div>

      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Manage Packages</h1>
          <p className="text-gray-500 mt-2 font-medium">Create and manage your service packages.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-md shadow-pink-200/50 hover:shadow-lg text-white px-6 py-3 rounded-xl flex items-center transition-all duration-300 transform hover:-translate-y-1 font-bold"
        >
          <FaPlus className="mr-2" /> Create Package
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <AnimatePresence>
          {packages.map((pkg) => (
            <motion.div 
              key={pkg.id} 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl shadow-pink-100/40 border border-pink-50 flex overflow-hidden group hover:shadow-2xl hover:shadow-pink-200/50 transition-all duration-300"
            >
              {pkg.image && (
                <div className="w-1/3 min-h-full">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold text-primary group-hover:text-pink-600 transition-colors">{pkg.name}</h3>
                  <span className="text-xl font-extrabold text-primary">₹{pkg.price}</span>
                </div>
                <p className="text-sm text-gray-500 font-medium mb-4">{pkg.services?.length || 0} Services Included</p>
                
                {pkg.description && (
                  <p className="text-gray-600 mb-4 text-sm italic border-l-2 border-primary pl-3">{pkg.description}</p>
                )}

                <ul className="space-y-3 mb-4">
                  {pkg.services && pkg.services.map((service, index) => (
                    <li key={index} className="text-sm text-gray-700 font-medium flex items-center">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <FaCheck className="text-green-500 text-xs" />
                      </div>
                      <span className="font-bold text-primary">{service.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-pink-50/50 flex flex-col justify-center border-l border-pink-50 p-4 space-y-4">
                <button 
                  onClick={() => handleOpenEdit(pkg)}
                  className="text-gray-500 hover:text-pink-600 p-3 rounded-xl hover:bg-white transition-colors shadow-sm bg-white/50" 
                  title="Edit"
                >
                  <FaEdit size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(pkg.id)}
                  className="text-gray-500 hover:text-red-500 p-3 rounded-xl hover:bg-white transition-colors shadow-sm bg-white/50" 
                  title="Delete"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
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
              className="bg-white rounded-3xl w-full max-w-3xl p-8 shadow-2xl shadow-pink-200/50 relative z-10 border border-pink-100 max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-extrabold text-primary">
                  {modalMode === 'add' ? 'Create New Package' : 'Edit Package'}
                </h2>
                <button 
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-primary bg-gray-50 hover:bg-pink-50 p-2 rounded-full transition-colors"
                >
                  <FaTimes size={18} />
                </button>
              </div>
              
              <div className="overflow-y-auto pr-4 flex-1 custom-scrollbar">
                <form id="package-form" onSubmit={handleSubmit} className="space-y-8 pb-4">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Package Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={currentPackage?.name || ''} 
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all shadow-sm text-gray-800"
                      placeholder="e.g. Bridal Beauty Pack"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Package Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all shadow-sm text-gray-800"
                    />
                  </div>
                  
                  {/* Pricing */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Total Price (₹)</label>
                    <input 
                      type="number" 
                      name="price"
                      value={currentPackage?.price || ''} 
                      onChange={handleChange}
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all shadow-sm font-bold text-pink-600"
                      placeholder="e.g. 5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea 
                      name="description"
                      value={currentPackage?.description || ''} 
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all shadow-sm resize-none text-gray-800"
                      placeholder="Enter detailed description of the package..."
                    />
                  </div>

                  {/* Services Selection */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Select Services Included (Combo Offer)</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 h-64 overflow-y-auto custom-scrollbar shadow-inner">
                      {availableServices.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {availableServices.map(service => {
                            const isSelected = currentPackage?.service_ids?.includes(String(service.id)) || currentPackage?.service_ids?.includes(Number(service.id));
                            
                            return (
                              <label 
                                key={service.id} 
                                className={`flex items-start p-3 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-pink-500 bg-pink-50 shadow-sm' : 'border-gray-200 bg-white hover:border-pink-300'}`}
                              >
                                <div className="flex items-center h-5 mt-1">
                                  <input 
                                    type="checkbox" 
                                    className="w-5 h-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer accent-pink-500"
                                    checked={!!isSelected}
                                    onChange={(e) => {
                                      const id = service.id;
                                      let newIds = [...(currentPackage?.service_ids || [])];
                                      if (e.target.checked) {
                                        // Push either number or string based on how it's currently structured, DRF handles both usually but string is safer
                                        if (!newIds.some(val => String(val) === String(id))) newIds.push(id);
                                      } else {
                                        newIds = newIds.filter(val => String(val) !== String(id));
                                      }
                                      setCurrentPackage(prev => ({ ...prev, service_ids: newIds }));
                                    }}
                                  />
                                </div>
                                <div className="ml-3 flex-1">
                                  <span className={`block text-sm font-bold ${isSelected ? 'text-pink-700' : 'text-gray-700'}`}>
                                    {service.name}
                                  </span>
                                  <span className={`block text-xs font-extrabold mt-1 ${isSelected ? 'text-pink-600' : 'text-purple-600'}`}>
                                    ₹{service.price}
                                  </span>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                          <p className="font-medium">No active services found.</p>
                          <p className="text-sm">Please create services first.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              <div className="pt-6 mt-2 border-t border-gray-100">
                <button 
                  type="submit"
                  form="package-form"
                  className="w-full group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl hover:shadow-[0_10px_20px_rgba(236,72,153,0.4)] hover:-translate-y-1 focus:outline-none overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                  <span className="relative flex items-center text-lg tracking-wide">
                    <FaSave className="mr-3 group-hover:scale-110 transition-transform" size={20} /> 
                    {modalMode === 'add' ? 'Save Package' : 'Update Package'}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPackages;
