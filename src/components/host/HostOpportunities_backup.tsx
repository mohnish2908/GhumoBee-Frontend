import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Plus, Eye, Edit, MoreVertical, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { AppDispatch, RootState } from '../../store/store';
import { clearOpportunities, fetchHostOpportunities, updateOpportunityData } from '../../slices/opportunitySlice';

const HostOpportunities: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const opportunityState = useSelector((state: RootState) => state.opportunity);
  const user = useSelector((state: RootState) => state.user); // Get the entire user state
  
  // Debug logs
  console.log("HostOpportunities - opportunityState:", opportunityState);
  console.log("HostOpportunities - opportunities array:", opportunityState?.opportunities);
  
  // Safely destructure with fallbacks
  const {
    opportunities = [],
    loading = false,
    updating = false,
    error = null,
    lastFetched = null
  } = opportunityState || {};

  const [localUpdates, setLocalUpdates] = useState<{ [key: string]: any }>({});
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});
  const [previousUserId, setPreviousUserId] = useState<string | null>(null);

  useEffect(() => {
    console.log('HostOpportunities useEffect triggered, user:', user);
    
    // Check if user has changed
    const currentUserId = user?._id;
    
    if (currentUserId && currentUserId !== previousUserId) {
      console.log('User changed from', previousUserId, 'to', currentUserId);
      console.log('Clearing opportunities and fetching for user:', currentUserId);
      
      // Clear existing opportunities when user changes
      dispatch(clearOpportunities());
      
      // Fetch fresh opportunities for the current user
      dispatch(fetchHostOpportunities());
      
      // Update previous user ID
      setPreviousUserId(currentUserId);
    } else if (!currentUserId && previousUserId) {
      // User logged out
      console.log('User logged out, clearing opportunities');
      dispatch(clearOpportunities());
      setPreviousUserId(null);
    }
  }, [dispatch, user?._id, previousUserId]); // Watch user._id

  // Handle status toggle
  const handleStatusToggle = async (opportunityId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    // Optimistic update
    setLocalUpdates(prev => ({
      ...prev,
      [opportunityId]: { status: newStatus }
    }));

    try {
      await dispatch(updateOpportunityData({
        id: opportunityId,
        data: { status: newStatus }
      })).unwrap();
      
      // Clear local update on success
      setLocalUpdates(prev => {
        const updated = { ...prev };
        delete updated[opportunityId];
        return updated;
      });
      
      toast.success(`Opportunity ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
    } catch (error: any) {
      // Revert optimistic update on error
      setLocalUpdates(prev => {
        const updated = { ...prev };
        delete updated[opportunityId];
        return updated;
      });
      
      toast.error(error.message || 'Failed to update opportunity status');
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchHostOpportunities());
  };

  // Handle edit opportunity
  const handleEditOpportunity = (opportunityId: string) => {
    navigate(`/create-opportunity?edit=${opportunityId}`);
  };

  // Get effective status (with local updates)
  const getEffectiveStatus = (opportunity: any) => {
    return localUpdates[opportunity._id]?.status || opportunity.status;
  };

  // Toggle card expansion
  const toggleCardExpansion = (opportunityId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [opportunityId]: !prev[opportunityId]
    }));
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  if (loading && opportunities.length === 0) {
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

  if (error && opportunities.length === 0) {
    return (
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <p className="text-red-600 text-center">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-honey hover:bg-yellow-500 text-charcoal rounded-lg font-medium transition-colors flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
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
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-semibold text-charcoal dark:text-white">Current Opportunities</h3>
          {loading && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-honey"></div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="px-3 py-2 text-gray-600 hover:text-charcoal dark:text-gray-300 dark:hover:text-white transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/create-opportunity"
            className="px-4 py-2 bg-honey hover:bg-yellow-500 text-charcoal font-medium rounded-lg transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Link>
        </div>
      </div>

      {opportunities.length === 0 ? (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
            No opportunities posted yet
          </h4>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create your first opportunity to start attracting volunteers!
          </p>
          <Link
            to="/create-opportunity"
            className="inline-flex items-center px-4 py-2 bg-honey hover:bg-yellow-500 text-charcoal font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Opportunity
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-charcoal dark:text-white">
                {opportunities.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Opportunities
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {opportunities.filter((opp: any) => getEffectiveStatus(opp) === 'active').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Active
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {opportunities.reduce((sum: number, opp: any) => sum + (opp.applications?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Applications
              </div>
            </div>
          </div>

          {/* Opportunities Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opportunity: any) => {
              const effectiveStatus = getEffectiveStatus(opportunity);
              const isUpdating = updating && localUpdates[opportunity._id];
              const isExpanded = expandedCards[opportunity._id];
              
              return (
                <motion.div 
                  key={opportunity._id} 
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-semibold text-charcoal dark:text-white line-clamp-2">
                        {opportunity.title}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            effectiveStatus === 'active'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : effectiveStatus === 'inactive'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                          }`}
                        >
                          {effectiveStatus}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {opportunity.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <p><span className="font-medium">Location:</span> {opportunity.location || `${opportunity.district}, ${opportunity.state}`}</p>
                      <p><span className="font-medium">Volunteers needed:</span> {opportunity.volunteerNeeded}</p>
                      <p><span className="font-medium">Applications:</span> {opportunity.applications?.length || 0}</p>
                      {isExpanded && (
                        <>
                          <p><span className="font-medium">Duration:</span> {opportunity.minimumDuration} - {opportunity.maximumDuration || '∞'} days</p>
                          <p><span className="font-medium">Working Hours:</span> {opportunity.workingHours} hours/day</p>
                          <p><span className="font-medium">Days Off:</span> {opportunity.daysOff} days/week</p>
                          <p><span className="font-medium">Property:</span> {opportunity.propertyName}</p>
                          <p><span className="font-medium">Meals:</span> {opportunity.meals}</p>
                          {opportunity.skills && opportunity.skills.length > 0 && (
                            <div>
                              <span className="font-medium">Skills:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {opportunity.skills.map((skill: string, index: number) => (
                                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {opportunity.amenities && opportunity.amenities.length > 0 && (
                            <div>
                              <span className="font-medium">Amenities:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {opportunity.amenities.map((amenity: string, index: number) => (
                                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                                    {amenity}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusToggle(opportunity._id, effectiveStatus)}
                          disabled={isUpdating}
                          className={`px-3 py-1 rounded text-sm font-medium disabled:opacity-50 transition-colors ${
                            effectiveStatus === 'active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                          }`}
                        >
                          {isUpdating ? 'Updating...' : effectiveStatus === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        
                        <Link
                          to={`/opportunity/${opportunity._id}`}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:text-blue-200"
                        >
                          <Eye className="h-3 w-3 inline mr-1" />
                          View
                        </Link>
                        
                        <button
                          onClick={() => handleEditOpportunity(opportunity._id)}
                          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm font-medium hover:bg-yellow-200 transition-colors dark:bg-yellow-900 dark:text-yellow-200"
                        >
                          <Edit className="h-3 w-3 inline mr-1" />
                          Edit
                        </button>
                      </div>

                      <button
                        onClick={() => toggleCardExpansion(opportunity._id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {lastFetched && (
        <p className="text-center text-gray-400 text-sm mt-6">
          Last updated: {new Date(lastFetched).toLocaleString()}
        </p>
      )}
    </motion.div>
  );
};

export default HostOpportunities;
