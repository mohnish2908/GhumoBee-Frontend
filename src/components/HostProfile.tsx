import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, LogOut } from 'lucide-react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/operations/authApi";
import { useSelector } from 'react-redux';
import HostOpportunities from './host/HostOpportunities';
import HostApplications from './host/HostApplications';

const HostProfile: React.FC = () => {
  const user = useSelector((state: any) => state.user);  
  const [activeTab, setActiveTab] = useState('opportunities');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Debug log to check user data
  console.log('HostProfile - User data:', user);

  const handleEditProfile = () => {
    navigate("/personal-info");
  };

  const handleLogout = async () => {
    await (dispatch as any)(logout());
    navigate("/login");
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src={
                user?.profilePicture ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-charcoal dark:text-white mb-2">
              {user?.name || 'Host Name'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {user?.email || 'No email provided'}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2 capitalize">
              Role: {user?.role || 'Unknown'}
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {user?.city || user?.state
                ? [user.city, user.state].filter(Boolean).join(", ")
                : "Location not set"}
            </p>
            <p
              className={`text-sm font-medium ${
                user?.isVerified ? "text-green-600" : "text-red-600"
              }`}
            >
              {user?.isVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              className="px-6 py-3 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-colors flex items-center"
              onClick={handleEditProfile}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
            
            <button 
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors flex items-center"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <motion.div 
        className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        {['opportunities', 'applications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all capitalize ${
              activeTab === tab
                ? 'bg-white dark:bg-gray-800 text-charcoal dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-charcoal dark:hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'opportunities' && <HostOpportunities />}
        {activeTab === 'applications' && <HostApplications />}
      </motion.div>
    </div>
  );
};

export default HostProfile;