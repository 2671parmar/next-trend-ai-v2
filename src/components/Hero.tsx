
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const Hero: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <section className="relative py-32 bg-gradient-to-br from-nextrend-50 to-white">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Generate Multi-Platform Content 
            <span className="text-nextrend-500"> in Seconds</span>
          </h1>
          
          <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto">
            NexTrend.AI helps loan officers create tailored content for LinkedIn, blogs, videos, emails, social media, and more — all from a single news item.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 mb-16">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="button-hover bg-nextrend-500 text-white px-8 py-6 rounded-lg font-medium text-lg shadow-lg shadow-nextrend-500/20"
            >
              Get Started
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="lg"
              className="button-hover px-8 py-6 rounded-lg font-medium text-lg border border-gray-300 hover:border-gray-400 bg-white"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative mt-8 max-w-5xl mx-auto"
        >
          <div className="aspect-[16/8] bg-white rounded-xl shadow-xl overflow-hidden">
            <img 
              src="/lovable-uploads/5b5bfca4-a9df-4f91-b965-3f21223e570f.png" 
              alt="NexTrend.AI Dashboard Preview" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent rounded-xl pointer-events-none"></div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-24 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            All-in-One Content Solution
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Your Brand. Your Voice. Your Growth.
          </p>
          <div className="mt-10 max-w-2xl mx-auto">
            <p className="text-lg text-gray-600 mb-5">
              Your brand needs visibility, but writing content can take too much time.
            </p>
            <p className="text-lg text-gray-600 mb-5">
              What if three clicks could instantly generate a full suite of engaging, on-brand content?
            </p>
            <p className="text-lg text-gray-600 mb-5">
              <span className="font-semibold">With NexTrend.AI, it does.</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center justify-center mt-12">
            <p className="text-gray-500 font-medium">Why Loan Officers Love NexTrend.AI:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="inline-block px-3 py-1 bg-nextrend-50 text-nextrend-700 rounded-full text-sm font-medium">No more blank screens</span>
              <span className="inline-block px-3 py-1 bg-nextrend-50 text-nextrend-700 rounded-full text-sm font-medium">Mortgage focused</span>
              <span className="inline-block px-3 py-1 bg-nextrend-50 text-nextrend-700 rounded-full text-sm font-medium">Time-saving</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-nextrend-100 rounded-bl-full opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-nextrend-100 rounded-tr-full opacity-50 -z-10"></div>
    </section>
  );
};

export default Hero;
