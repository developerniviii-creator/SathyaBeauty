import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserEdit, FaBell, FaShieldAlt, FaSave, FaStore, FaPalette, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import axios from 'axios';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    parlour_name: "Sathya Beauty",
    contact_number: "+91 98765 43210",
    application_address: "123 Beauty Avenue, Anna Nagar, Chennai, Tamil Nadu 600040",
    currency: "INR (₹)",
    email_alerts: true,
    sms_alerts: false,
    booking_reminders: true,
    marketing_emails: false,
    theme_color: "pink",
    dashboard_mode: "light"
  });

  useEffect(() => {
    // fetch settings
    axios.get('http://localhost:8000/api/settings/')
      .then(response => {
        if (response.data) {
          setSettings(prev => ({ ...prev, ...response.data }));
        }
      })
      .catch(error => console.error("Error fetching settings:", error));
  }, []);

  const handleSaveSettings = () => {
    const token = localStorage.getItem('admin_access_token');
    axios.put('http://localhost:8000/api/settings/', 
      settings,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(response => {
      alert("Settings saved successfully!");
    })
    .catch(error => {
      console.error("Error saving settings:", error);
      alert("Failed to save settings.");
    });
  };

  const toggleNotification = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-10 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="mb-8 relative z-10">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">System Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage your parlour configuration and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        {/* Sidebar Tabs */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-3xl shadow-xl shadow-pink-100/40 border border-pink-50 overflow-hidden sticky top-24">
            <nav className="flex flex-col p-4 space-y-2">
              <button 
                onClick={() => setActiveTab('general')}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors font-bold ${activeTab === 'general' ? 'bg-pink-50 text-pink-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
              >
                <FaStore className={`mr-3 ${activeTab === 'general' ? 'text-pink-600' : 'text-gray-400'}`} /> General Settings
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors font-bold ${activeTab === 'profile' ? 'bg-pink-50 text-pink-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
              >
                <FaUserEdit className={`mr-3 ${activeTab === 'profile' ? 'text-pink-600' : 'text-gray-400'}`} /> Admin Profile
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors font-bold ${activeTab === 'notifications' ? 'bg-pink-50 text-pink-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
              >
                <FaBell className={`mr-3 ${activeTab === 'notifications' ? 'text-pink-600' : 'text-gray-400'}`} /> Notifications
              </button>
              <button 
                onClick={() => setActiveTab('appearance')}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors font-bold ${activeTab === 'appearance' ? 'bg-pink-50 text-pink-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
              >
                <FaPalette className={`mr-3 ${activeTab === 'appearance' ? 'text-pink-600' : 'text-gray-400'}`} /> Appearance
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors font-bold ${activeTab === 'security' ? 'bg-pink-50 text-pink-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
              >
                <FaShieldAlt className={`mr-3 ${activeTab === 'security' ? 'text-pink-600' : 'text-gray-400'}`} /> Security
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl shadow-pink-100/40 border border-pink-50 p-8 min-h-[500px]"
          >
            {activeTab === 'general' && (
              <div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b border-gray-100 pb-4">General Settings</h2>
                <form className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Parlour Name</label>
                      <input type="text" value={settings.parlour_name} onChange={(e) => handleSettingChange('parlour_name', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all text-gray-800 font-semibold shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Contact Number</label>
                      <input type="text" value={settings.contact_number} onChange={(e) => handleSettingChange('contact_number', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all text-gray-800 font-semibold shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Business Address</label>
                    <textarea 
                      rows="3" 
                      value={settings.application_address}
                      onChange={(e) => handleSettingChange('application_address', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all resize-none text-gray-800 font-medium shadow-sm"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Currency</label>
                    <select value={settings.currency} onChange={(e) => handleSettingChange('currency', e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all text-gray-800 font-bold shadow-sm">
                      <option value="INR (₹)">INR (₹)</option>
                      <option value="USD ($)">USD ($)</option>
                      <option value="EUR (€)">EUR (€)</option>
                    </select>
                  </div>
                  <div className="pt-4">
                    <button type="button" onClick={handleSaveSettings} className="bg-primary hover:bg-secondary text-white px-8 py-3.5 rounded-xl font-bold flex items-center transition-colors shadow-md shadow-pink-200 transform hover:-translate-y-0.5">
                      <FaSave className="mr-2" /> Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b border-gray-100 pb-4">Admin Profile</h2>
                <div className="flex items-center mb-8 bg-pink-50/50 p-6 rounded-2xl border border-pink-50">
                  <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md overflow-hidden mr-6">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200" alt="Admin" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-primary px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors mb-2">
                      Change Photo
                    </button>
                    <p className="text-xs font-bold text-gray-400">Recommended size: 256x256px</p>
                  </div>
                </div>
                <form className="space-y-6 max-w-2xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                      <input type="text" defaultValue="Admin" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all text-gray-800 font-semibold shadow-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                      <input type="text" defaultValue="User" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all text-gray-800 font-semibold shadow-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                    <input type="email" defaultValue="admin@sathyabeauty.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all text-gray-800 font-semibold shadow-sm" />
                  </div>
                  <div className="pt-4">
                    <button type="button" className="bg-primary hover:bg-secondary text-white px-8 py-3.5 rounded-xl font-bold flex items-center transition-colors shadow-md shadow-pink-200 transform hover:-translate-y-0.5">
                      <FaSave className="mr-2" /> Update Profile
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b border-gray-100 pb-4">Notification Preferences</h2>
                <div className="space-y-4 max-w-2xl mb-8">
                  <div className="flex items-center justify-between p-5 bg-gray-50 hover:bg-pink-50/50 transition-colors rounded-2xl border border-gray-100">
                    <div>
                      <h4 className="font-bold text-gray-800">Email Alerts</h4>
                      <p className="text-sm font-medium text-gray-500 mt-1">Receive daily summary emails and important alerts.</p>
                    </div>
                    <button onClick={() => toggleNotification('email_alerts')} className="text-3xl focus:outline-none transition-transform hover:scale-105">
                      {settings.email_alerts ? <FaToggleOn className="text-primary" /> : <FaToggleOff className="text-gray-300" />}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-5 bg-gray-50 hover:bg-pink-50/50 transition-colors rounded-2xl border border-gray-100">
                    <div>
                      <h4 className="font-bold text-gray-800">SMS Alerts</h4>
                      <p className="text-sm font-medium text-gray-500 mt-1">Receive instant SMS for new bookings.</p>
                    </div>
                    <button onClick={() => toggleNotification('sms_alerts')} className="text-3xl focus:outline-none transition-transform hover:scale-105">
                      {settings.sms_alerts ? <FaToggleOn className="text-primary" /> : <FaToggleOff className="text-gray-300" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-gray-50 hover:bg-pink-50/50 transition-colors rounded-2xl border border-gray-100">
                    <div>
                      <h4 className="font-bold text-gray-800">Booking Reminders</h4>
                      <p className="text-sm font-medium text-gray-500 mt-1">Send automated reminders to customers before appointments.</p>
                    </div>
                    <button onClick={() => toggleNotification('booking_reminders')} className="text-3xl focus:outline-none transition-transform hover:scale-105">
                      {settings.booking_reminders ? <FaToggleOn className="text-primary" /> : <FaToggleOff className="text-gray-300" />}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-5 bg-gray-50 hover:bg-pink-50/50 transition-colors rounded-2xl border border-gray-100">
                    <div>
                      <h4 className="font-bold text-gray-800">Marketing Emails</h4>
                      <p className="text-sm font-medium text-gray-500 mt-1">Send promotional content and offers.</p>
                    </div>
                    <button onClick={() => toggleNotification('marketing_emails')} className="text-3xl focus:outline-none transition-transform hover:scale-105">
                      {settings.marketing_emails ? <FaToggleOn className="text-primary" /> : <FaToggleOff className="text-gray-300" />}
                    </button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button type="button" onClick={handleSaveSettings} className="bg-primary hover:bg-secondary text-white px-8 py-3.5 rounded-xl font-bold flex items-center transition-colors shadow-md shadow-pink-200 transform hover:-translate-y-0.5">
                    <FaSave className="mr-2" /> Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b border-gray-100 pb-4">Appearance Settings</h2>
                <p className="text-gray-500 font-medium mb-6">Customize the look and feel of the admin dashboard.</p>
                <div className="space-y-8 max-w-2xl mb-8">
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4">Theme Colors</h4>
                    <div className="flex space-x-4">
                      <div onClick={() => handleSettingChange('theme_color', 'pink')} className={`w-14 h-14 rounded-full bg-pink-500 cursor-pointer shadow-sm ${settings.theme_color === 'pink' ? 'ring-4 ring-pink-200 shadow-md' : 'opacity-50 hover:opacity-100 transition-opacity'}`}></div>
                      <div onClick={() => handleSettingChange('theme_color', 'blue')} className={`w-14 h-14 rounded-full bg-blue-500 cursor-pointer shadow-sm ${settings.theme_color === 'blue' ? 'ring-4 ring-blue-200 shadow-md' : 'opacity-50 hover:opacity-100 transition-opacity'}`}></div>
                      <div onClick={() => handleSettingChange('theme_color', 'emerald')} className={`w-14 h-14 rounded-full bg-emerald-500 cursor-pointer shadow-sm ${settings.theme_color === 'emerald' ? 'ring-4 ring-emerald-200 shadow-md' : 'opacity-50 hover:opacity-100 transition-opacity'}`}></div>
                      <div onClick={() => handleSettingChange('theme_color', 'purple')} className={`w-14 h-14 rounded-full bg-purple-500 cursor-pointer shadow-sm ${settings.theme_color === 'purple' ? 'ring-4 ring-purple-200 shadow-md' : 'opacity-50 hover:opacity-100 transition-opacity'}`}></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-4">Dashboard Mode</h4>
                    <div className="flex space-x-4">
                      <button onClick={() => handleSettingChange('dashboard_mode', 'light')} className={`px-8 py-3.5 border-2 font-bold rounded-xl shadow-sm transition-all ${settings.dashboard_mode === 'light' ? 'border-primary bg-pink-50 text-primary' : 'border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}>Light Mode</button>
                      <button onClick={() => handleSettingChange('dashboard_mode', 'dark')} className={`px-8 py-3.5 border-2 font-bold rounded-xl shadow-sm transition-all ${settings.dashboard_mode === 'dark' ? 'border-primary bg-pink-50 text-primary' : 'border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}>Dark Mode</button>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button type="button" onClick={handleSaveSettings} className="bg-primary hover:bg-secondary text-white px-8 py-3.5 rounded-xl font-bold flex items-center transition-colors shadow-md shadow-pink-200 transform hover:-translate-y-0.5">
                    <FaSave className="mr-2" /> Save Appearance
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-6 border-b border-gray-100 pb-4">Security Settings</h2>
                <form className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all shadow-sm text-gray-800" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all shadow-sm text-gray-800" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 outline-none transition-all shadow-sm text-gray-800" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button type="button" className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3.5 rounded-xl font-bold flex items-center transition-colors shadow-md transform hover:-translate-y-0.5">
                      <FaShieldAlt className="mr-2" /> Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
