import React from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Clock, FileText } from 'lucide-react';

interface Application {
  _id: string;
  volunteerName: string;
  volunteerEmail: string;
  opportunityTitle: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  message?: string;
}

interface HostApplicationsProps {
  applications?: Application[];
  loading?: boolean;
  error?: string | null;
}

const HostApplications: React.FC<HostApplicationsProps> = ({ 
  applications = [], 
  loading = false, 
  error = null 
}) => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const handleApplicationAction = (applicationId: string, action: 'accept' | 'reject') => {
    // TODO: Implement application action logic
    console.log(`${action} application ${applicationId}`);
  };

  if (loading) {
    return (
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-honey"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-red-600 text-center">{error}</p>
          <button className="px-4 py-2 bg-honey hover:bg-yellow-500 text-charcoal rounded-lg font-medium transition-colors">
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
      variants={fadeInUp}
      initial="initial"
      animate="animate"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-charcoal dark:text-white">Volunteer Applications</h3>
        {applications.length > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {applications.length} application{applications.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            No applications yet
          </h4>
          <p className="text-gray-500 dark:text-gray-400">
            Applications from volunteers will appear here once they apply to your opportunities.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Applications Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-charcoal dark:text-white">
                {applications.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Applications
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Pending Review
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'accepted').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Accepted
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="grid gap-4 md:grid-cols-2">
            {applications.map((application) => (
              <motion.div
                key={application._id}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-charcoal dark:text-white">
                      {application.volunteerName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {application.volunteerEmail}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                    {application.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="font-medium">Opportunity:</span>
                    <span className="ml-1">{application.opportunityTitle}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-medium">Applied:</span>
                    <span className="ml-1">{new Date(application.appliedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="font-medium">Time:</span>
                    <span className="ml-1">{new Date(application.appliedAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                {application.message && (
                  <div className="mb-4 p-3 bg-white dark:bg-gray-600 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-200">
                      <span className="font-medium">Message:</span> {application.message}
                    </p>
                  </div>
                )}

                {application.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApplicationAction(application._id, 'accept')}
                      className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded text-sm font-medium hover:bg-green-200 transition-colors dark:bg-green-900 dark:text-green-200"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleApplicationAction(application._id, 'reject')}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition-colors dark:bg-red-900 dark:text-red-200"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {application.status !== 'pending' && (
                  <div className="text-center py-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Application {application.status}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default HostApplications;
