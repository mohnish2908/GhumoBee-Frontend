import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Component to redirect authenticated users away from login/signup pages
const AuthRedirect: React.FC = () => {
  const userState = useSelector((state: any) => state.user);
  const user = userState || {};
  const token = userState?.token;

  // If user is authenticated (has token and user data), redirect to profile
  if (token && user._id) {
    return <Navigate to="/profile" replace />;
  }

  // If not authenticated, allow access to login/signup pages
  return <Outlet />;
};

export default AuthRedirect;
