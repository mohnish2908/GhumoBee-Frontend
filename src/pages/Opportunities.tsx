import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import OpportunityCard from '../components/OpportunityCard';
import OpportunitySearchBar from '../components/OpportunitySearchBar';
import { getAllOpportunities } from '../services/operations/opportunityApi';
import { toast } from 'react-hot-toast';

interface Opportunity {
  _id: string;
  title: string;
  district: string;
  state: string;
  host: string;
  images: Array<{
    url: string;
    asset_id: string;
    public_id: string;
  }>;
  skills: string[];
  minimumDuration: number;
  maximumDuration: number | null;
  rating?: number;
  reviews?: number;
  score?: number;
  createdAt?: string;
}

const Opportunities: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOpportunities, setTotalOpportunities] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentFilters, setCurrentFilters] = useState({
    states: [] as string[],
    skills: [] as string[],
  });

  // Caching mechanism
  const [cachedOpportunities, setCachedOpportunities] = useState<Opportunity[] | null>(null);
  const [cacheTimestamp, setCacheTimestamp] = useState<number | null>(null);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const limit = 12;

  // Function to clear cache manually if needed
  const clearCache = () => {
    setCachedOpportunities(null);
    setCacheTimestamp(null);
    console.log('Cache cleared');
  };

  // Function to refresh data (clear cache and refetch)
  const refreshData = () => {
    clearCache();
    fetchOpportunities(currentFilters, currentPage);
  };

  // Extract initial filters from URL params
  useEffect(() => {
    const states = searchParams.get('states')?.split(',').filter(Boolean) || [];
    const skills = searchParams.get('skills')?.split(',').filter(Boolean) || [];
    const page = parseInt(searchParams.get('page') || '1');

    setCurrentFilters({ states, skills });
    setCurrentPage(page);
  }, [searchParams]);

  // Fetch opportunities based on filters
  const fetchOpportunities = async (filters: any, page: number = 1) => {
    try {
      setLoading(true);

      console.log('Fetching opportunities with filters:', filters);

      let allOpportunities: Opportunity[] = [];

      // Check if we have valid cached data
      const now = Date.now();
      const isCacheValid = cachedOpportunities && 
                          cacheTimestamp && 
                          (now - cacheTimestamp) < CACHE_DURATION;

      if (isCacheValid) {
        console.log('Using cached opportunities data');
        allOpportunities = cachedOpportunities;
      } else {
        console.log('Fetching fresh data from API');
        // Fetch fresh data from API
        const response = await getAllOpportunities();

        if (response && response.success) {
          allOpportunities = response.opportunities || [];
          
          // Cache the fresh data
          setCachedOpportunities(allOpportunities);
          setCacheTimestamp(now);
          console.log('Data cached successfully');
        } else {
          toast.error('Failed to fetch opportunities');
          return;
        }
      }

      let opportunities = [...allOpportunities]; // Create a copy for processing
        
      // Apply scoring algorithm if filters are applied
      if ((filters.states && filters.states.length > 0) || (filters.skills && filters.skills.length > 0)) {
        console.log('Applying scoring with filters:', filters);
        
        opportunities = opportunities.map((op: Opportunity) => {
          let score = 0;

          // Check state match - exact match gets 1 point
          if (filters.states && filters.states.length > 0 && filters.states.includes(op.state)) {
            score += 1;
            console.log(`State match for ${op.title}: +1 point (${op.state})`);
          }

          // Check skill matches - each matching skill gets 1 point
          if (filters.skills && filters.skills.length > 0) {
            const matchedSkills = op.skills.filter((skill: string) => 
              filters.skills.includes(skill)
            );
            score += matchedSkills.length;
            if (matchedSkills.length > 0) {
              console.log(`Skill matches for ${op.title}: +${matchedSkills.length} points (${matchedSkills.join(', ')})`);
            }
          }

          console.log(`Total score for ${op.title}: ${score}`);
          return { ...op, score };
        });

        // Sort by score (highest first), then by creation date for same scores
        opportunities.sort((a: any, b: any) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        console.log('Opportunities sorted by score:', opportunities.map((op: any) => ({ title: op.title, score: op.score })));
      } else {
        // No filters applied, sort by creation date only
        opportunities.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedResults = opportunities.slice(startIndex, endIndex);

      setOpportunities(paginatedResults);
      setTotalOpportunities(opportunities.length);
      setTotalPages(Math.ceil(opportunities.length / limit));

    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to fetch opportunities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOpportunities(currentFilters, currentPage);
  }, [currentFilters, currentPage]);

  // Handle search from search bar
  const handleSearch = (filters: { states: string[]; skills: string[] }) => {
    setCurrentFilters(filters);
    setCurrentPage(1);

    // Update URL parameters
    const newSearchParams = new URLSearchParams();
    if (filters.states.length > 0) newSearchParams.set('states', filters.states.join(','));
    if (filters.skills.length > 0) newSearchParams.set('skills', filters.skills.join(','));
    newSearchParams.set('page', '1');
    
    setSearchParams(newSearchParams);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-charcoal dark:text-white mb-4">
            Volunteer Opportunities
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Discover amazing volunteer opportunities around the world
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <OpportunitySearchBar
            onSearch={handleSearch}
            initialFilters={currentFilters}
          />
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <div className="text-gray-600 dark:text-gray-300 flex items-center justify-between">
            <div>
              <span className="font-medium">{totalOpportunities}</span> opportunities found
              {(currentFilters.states.length > 0 || currentFilters.skills.length > 0) && (
                <span className="text-sm text-teal ml-2">
                  (Sorted by relevance - best matches first)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* {cachedOpportunities && (
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                  Cached Data
                </span>
              )} */}
              <button
                onClick={refreshData}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                title="Clear cache and fetch fresh data"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
          </div>
        )}

        {/* Opportunities Grid */}
        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
          >
            {opportunities.map((opportunity) => (
              <motion.div key={opportunity._id} variants={fadeInUp}>
                <OpportunityCard 
                  opportunity={opportunity} 
                  showScore={(currentFilters.states.length > 0 || currentFilters.skills.length > 0)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* No Results */}
        {!loading && opportunities.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No opportunities found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search criteria or filters.
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && opportunities.length > 0 && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center gap-4 mt-8"
          >
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-teal text-white'
                        : 'border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;
