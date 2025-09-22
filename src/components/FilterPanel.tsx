import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, DollarSign } from 'lucide-react';

const FilterPanel: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  const locations = [
    'Europe', 'Asia', 'Africa', 'South America', 'North America', 'Oceania'
  ];

  const durations = [
    '1-2 weeks', '3-4 weeks', '1-2 months', '3-6 months', '6+ months'
  ];

  const skills = [
    'Teaching', 'Farming', 'Conservation', 'Cooking', 'Construction',
    'Art', 'Technology', 'Healthcare', 'Child Care', 'Research'
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-6 flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-honey" />
        Filters
      </h3>

      {/* Location Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-charcoal dark:text-white mb-3">Location</h4>
        <div className="space-y-2">
          {locations.map((location) => (
            <label key={location} className="flex items-center">
              <input
                type="radio"
                name="location"
                value={location}
                checked={selectedLocation === location}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="text-honey focus:ring-honey"
              />
              <span className="ml-2 text-gray-600 dark:text-gray-300">{location}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-charcoal dark:text-white mb-3 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          Duration
        </h4>
        <div className="space-y-2">
          {durations.map((duration) => (
            <label key={duration} className="flex items-center">
              <input
                type="radio"
                name="duration"
                value={duration}
                checked={selectedDuration === duration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="text-honey focus:ring-honey"
              />
              <span className="ml-2 text-gray-600 dark:text-gray-300">{duration}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Skills Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-charcoal dark:text-white mb-3">Skills Needed</h4>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedSkills.includes(skill)
                  ? 'bg-honey text-charcoal'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-honey/20'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-charcoal dark:text-white mb-3 flex items-center">
          <Star className="h-4 w-4 mr-1" />
          Minimum Rating
        </h4>
        <div className="flex space-x-2">
          {[4.0, 4.5, 4.8, 4.9].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                minRating === rating
                  ? 'bg-honey text-charcoal'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-honey/20'
              }`}
            >
              {rating}+
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setSelectedLocation('');
          setSelectedDuration('');
          setSelectedSkills([]);
          setMinRating(0);
        }}
        className="w-full px-4 py-2 text-sm text-teal hover:bg-teal/10 rounded-lg transition-colors"
      >
        Clear All Filters
      </button>
    </motion.div>
  );
};

export default FilterPanel;