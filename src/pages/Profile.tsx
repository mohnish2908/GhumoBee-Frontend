import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store/store';
import HostProfile from '../components/HostProfile';
import VolunteerProfile from '../components/VolunteerProfile';
import AdminDashboard from '../components/admin/AdminDashboard';

const Profile: React.FC = () => {
  const userState = useSelector((state: RootState) => state.user);
  const { role, token, loading } = userState || {};

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey"></div>
      </div>
    );
  }

  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to unauthorized if no role
  if (!role) {
    return <Navigate to="/unauthorized" replace />;
  }

  const renderProfile = () => {
    switch (role) {
      case 'host':
        return <HostProfile />;
      case 'volunteer':
        return <VolunteerProfile />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <Navigate to="/unauthorized" replace />;
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {renderProfile()}
    </div>
  );
};

export default Profile;