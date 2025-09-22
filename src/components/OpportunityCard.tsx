import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface OpportunityCardProps {
  opportunity: {
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
  };
  showScore?: boolean;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, showScore = false }) => {
  const displaySkills = opportunity.skills.slice(0, 3);
  const hasMoreSkills = opportunity.skills.length > 3;
  const remainingSkillsCount = opportunity.skills.length - 3;
  
  const formatDuration = () => {
    if (opportunity.maximumDuration) {
      return `${opportunity.minimumDuration}-${opportunity.maximumDuration} weeks`;
    }
    return `${opportunity.minimumDuration}+ weeks`;
  };

  return (
    <Link 
      to={`/opportunity/${opportunity._id}`}
      state={{ opportunityData: opportunity }}
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer block"
        whileHover={{ 
          scale: 1.03,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={opportunity.images?.[0]?.url || '/api/placeholder/400/300'}
            alt={opportunity.title}
            className="w-full h-full object-cover transition-transform hover:scale-110"
          />
          {(opportunity.rating || (showScore && opportunity.score !== undefined)) && (
            <div className="absolute top-4 right-4 flex gap-2">
              {opportunity.rating && (
                <div className="bg-white/90 px-2 py-1 rounded-full flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-semibold">{opportunity.rating}</span>
                </div>
              )}
              {showScore && opportunity.score !== undefined && opportunity.score > 0 && (
                <div className="bg-honey/90 px-2 py-1 rounded-full flex items-center">
                  <span className="text-sm font-semibold text-charcoal">Match: {opportunity.score}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-semibold text-charcoal dark:text-white mb-2">
            {opportunity.title}
          </h3>
        
          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-300 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{opportunity.district}, {opportunity.state}</span>
          </div>

          {/* District + "Ghumo" */}
          <p className="text-sm text-teal font-medium mb-3">
            {opportunity.district}Ghumo
          </p>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {displaySkills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-teal/10 text-teal text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {hasMoreSkills && (
              <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{remainingSkillsCount} more
              </span>
            )}
          </div>

          {/* Duration & Reviews */}
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm">{formatDuration()}</span>
            </div>
            {opportunity.reviews && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {opportunity.reviews} reviews
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default OpportunityCard;