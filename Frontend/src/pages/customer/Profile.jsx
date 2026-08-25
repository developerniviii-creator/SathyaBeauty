import { FaUserEdit, FaEnvelope, FaPhone, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { customerUser, customerLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    customerLogout();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-6 py-12 flex justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-primary to-secondary h-32 relative">
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-500 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            {customerUser ? `${customerUser.first_name || ''} ${customerUser.last_name || ''}`.trim() || customerUser.username : 'Loading...'}
          </h2>
          <p className="text-gray-500 mb-6">{customerUser?.is_customer ? 'Customer' : 'Member'}</p>
          
          <div className="space-y-4 max-w-md mx-auto text-left mb-8">
            <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <FaEnvelope className="text-primary mr-4" />
              <span>{customerUser?.email || 'No email provided'}</span>
            </div>
            {customerUser?.phone_number && (
              <div className="flex items-center text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <FaPhone className="text-primary mr-4" />
                <span>{customerUser.phone_number}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="bg-gray-900 hover:bg-primary text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center shadow-md w-full sm:w-auto justify-center">
              <FaUserEdit className="mr-2" /> Edit Profile
            </button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center shadow-md w-full sm:w-auto justify-center">
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
