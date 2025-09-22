import React from 'react';
import { motion } from 'framer-motion';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="text-2xl"
      >
        🐝
      </motion.div>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-charcoal dark:text-white">
          Ghumo<span className="text-honey">Bee</span>
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
          Travel • Volunteer • Connect
        </span>
      </div>
    </div>
  );
};

export default Logo;