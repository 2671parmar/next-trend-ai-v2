
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-nextrend-50 to-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto md:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              AI-Partnered Content Creation 
              <span className="text-nextrend-500"> In Your Brand Voice</span> for Mortgage Professionals
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Your Brand. Your Voice. Your Growth.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Your brand needs visibility, but writing content takes too much time.
              What if one click could instantly generate a full suite of engaging, on-brand content?
              <span className="font-semibold"> With NexTrend.AI, it does.</span>
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button 
              onClick={handleGetStarted}
              className="button-hover bg-nextrend-500 text-white px-8 py-3 rounded-lg font-medium text-lg shadow-lg shadow-nextrend-500/20"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="button-hover px-8 py-3 rounded-lg font-medium text-lg border border-gray-300 hover:border-gray-400 bg-white"
            >
              See Demo
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <div className="flex flex-wrap gap-4 items-center">
              <p className="text-gray-500 font-medium">Why Loan Officers Love NexTrend.AI:</p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-block px-3 py-1 bg-nextrend-50 text-nextrend-700 rounded-full text-sm font-medium">No more blank screens</span>
                <span className="inline-block px-3 py-1 bg-nextrend-50 text-nextrend-700 rounded-full text-sm font-medium">Mortgage focused</span>
                <span className="inline-block px-3 py-1 bg-nextrend-50 text-nextrend-700 rounded-full text-sm font-medium">Time-saving</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="hidden md:block absolute right-6 top-1/2 transform -translate-y-1/2 w-2/5">
          {/* Placeholder for hero image/illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-xl"
          >
            <div className="aspect-video bg-gray-100 rounded-lg mb-4"></div>
            <div className="h-8 bg-gray-100 rounded-md w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-100 rounded-md w-full mb-2"></div>
            <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
          </motion.div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-nextrend-100 rounded-bl-full opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-nextrend-100 rounded-tr-full opacity-50 -z-10"></div>
    </section>
  );
};

export default Hero;
