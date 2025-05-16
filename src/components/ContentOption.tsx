import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ContentOptionProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  onClick: () => void;
  delay?: number;
}

const ContentOption: React.FC<ContentOptionProps> = ({ 
  icon, 
  title, 
  description, 
  onClick,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card-hover bg-white border border-gray-100 rounded-xl p-6 shadow-sm cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
      whileTap={{ y: 0 }}
    >
      <div className="flex items-start">
        <div className="shrink-0 w-12 h-12 rounded-lg bg-nextrend-50 text-nextrend-500 flex items-center justify-center mr-4">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <div className="text-gray-600 mb-4">{description}</div>
          <div className="flex justify-end">
            <div className="text-nextrend-500 font-medium flex items-center">
              Select
              <ArrowRight className="ml-1 w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentOption;
