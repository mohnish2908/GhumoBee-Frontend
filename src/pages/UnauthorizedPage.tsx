import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full mx-auto text-center"
      >
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You don't have permission to access this page. Please check your account permissions or contact support.
          </p>
          
          <div className="space-y-3">
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center px-4 py-2 bg-honey hover:bg-yellow-500 text-charcoal font-medium rounded-lg transition-colors"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to Home
            </Link>
            
            {/* <Link
              to="/login"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors"
            >
              Login with Different Account
            </Link> */}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage;
