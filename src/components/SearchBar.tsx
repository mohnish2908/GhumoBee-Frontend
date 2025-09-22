import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { indianStates } from '../data/states';
import { skills } from '../data/skills';

const SearchBar: React.FC = () => {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showStatePopup, setShowStatePopup] = useState(false);
  const [showSkillPopup, setShowSkillPopup] = useState(false);
  const [stateSearchTerm, setStateSearchTerm] = useState('');
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
  const navigate = useNavigate();

  const statePopupRef = useRef<HTMLDivElement>(null);
  const skillPopupRef = useRef<HTMLDivElement>(null);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statePopupRef.current && !statePopupRef.current.contains(event.target as Node)) {
        setShowStatePopup(false);
      }
      if (skillPopupRef.current && !skillPopupRef.current.contains(event.target as Node)) {
        setShowSkillPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStateSelect = (stateName: string) => {
    if (selectedStates.includes(stateName)) {
      setSelectedStates(selectedStates.filter(s => s !== stateName));
    } else {
      setSelectedStates([...selectedStates, stateName]);
    }
  };

  const handleSkillSelect = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const removeState = (stateName: string) => {
    setSelectedStates(selectedStates.filter(s => s !== stateName));
  };

  const removeSkill = (skillName: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skillName));
  };

  const filteredStates = indianStates.filter(state =>
    state.name.toLowerCase().includes(stateSearchTerm.toLowerCase())
  );

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase())
  );

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    
    // Add selected states as filter
    if (selectedStates.length > 0) {
      searchParams.set('states', selectedStates.join(','));
    }
    
    // Add selected skills as filter
    if (selectedSkills.length > 0) {
      searchParams.set('skills', selectedSkills.join(','));
    }
    
    // Navigate to opportunities page with search parameters
    navigate(`/opportunities?${searchParams.toString()}`);
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 relative"
      style={{ zIndex: 10 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Location Selector */}
        <div className="flex-1 relative" ref={statePopupRef} style={{ zIndex: 1 }}>
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <button
            onClick={() => setShowStatePopup(!showStatePopup)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-honey focus:border-transparent bg-transparent dark:text-white text-left"
          >
            {selectedStates.length > 0 
              ? `${selectedStates.length} location${selectedStates.length > 1 ? 's' : ''} selected`
              : 'Where do you want to volunteer?'
            }
          </button>

          {/* State Popup */}
          <AnimatePresence>
            {showStatePopup && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-[99999] max-h-80 overflow-hidden"
                style={{ zIndex: 99999 }}
              >
                <div className="p-4">
                  <input
                    type="text"
                    placeholder="Search states..."
                    value={stateSearchTerm}
                    onChange={(e) => setStateSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-transparent dark:text-white"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredStates.map((state) => (
                    <button
                      key={state.id}
                      onClick={() => handleStateSelect(state.name)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedStates.includes(state.name)
                          ? 'bg-honey/10 text-honey font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {state.name}
                        {selectedStates.includes(state.name) && (
                          <span className="text-honey">✓</span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Skills Selector */}
        <div className="flex-1 relative" ref={skillPopupRef} style={{ zIndex: 1 }}>
          <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <button
            onClick={() => setShowSkillPopup(!showSkillPopup)}
            className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-honey focus:border-transparent bg-transparent dark:text-white text-left"
          >
            {selectedSkills.length > 0 
              ? `${selectedSkills.length} skill${selectedSkills.length > 1 ? 's' : ''} selected`
              : 'What skills do you have?'
            }
          </button>

          {/* Skills Popup */}
          <AnimatePresence>
            {showSkillPopup && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl z-[99999] max-h-80 overflow-hidden"
                style={{ zIndex: 99999 }}
              >
                <div className="p-4">
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={skillSearchTerm}
                    onChange={(e) => setSkillSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-transparent dark:text-white"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredSkills.map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => handleSkillSelect(skill.name)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedSkills.includes(skill.name)
                          ? 'bg-honey/10 text-honey font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="flex items-center justify-between">
                        {skill.name}
                        {selectedSkills.includes(skill.name) && (
                          <span className="text-honey">✓</span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button */}
        <motion.button 
          onClick={handleSearch}
          className="px-8 py-4 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-xl transition-colors flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search className="h-5 w-5 mr-2" />
          Search
        </motion.button>
      </div>

      {/* Selected Filters Display */}
      {(selectedStates.length > 0 || selectedSkills.length > 0) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedStates.map((state) => (
            <span
              key={state}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-honey/20 text-honey"
            >
              {state}
              <button
                onClick={() => removeState(state)}
                className="ml-2 text-honey hover:text-yellow-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {selectedSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal/20 text-teal"
            >
              {skill}
              <button
                onClick={() => removeSkill(skill)}
                className="ml-2 text-teal hover:text-teal-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default SearchBar;