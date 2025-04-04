
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Play } from 'lucide-react';

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
            AI-Partnered Content Creation 
            <span className="text-nextrend-500"> In Your Brand Voice</span> for Mortgage Professionals
          </h1>
          
          <div className="mt-6 mb-10 max-w-3xl mx-auto">
            <p className="text-lg text-gray-600 mb-3">
              Your brand needs visibility, but writing content can take too much time.
            </p>
            <p className="text-lg text-gray-600 mb-3">
              What if three clicks could instantly generate a full suite of engaging, on-brand content?
            </p>
            <p className="text-lg text-gray-600 mb-3">
              <span className="font-semibold">With NexTrend.AI, it does.</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 mb-8">
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
          
          <p className="text-xl text-gray-700 mt-10 mb-16">
            Your Brand. Your Voice. Your Growth.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-24 text-center"
        >
          {/* Video Demo Placeholder */}
          <div className="max-w-4xl mx-auto relative rounded-xl overflow-hidden shadow-2xl">
            <div className="aspect-w-16 aspect-h-9 bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
                alt="NexTrend.AI Demo Video" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button 
                  className="w-20 h-20 bg-nextrend-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-nextrend-600 transition-colors"
                  aria-label="Play demo video"
                >
                  <Play className="h-8 w-8 ml-1" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <h3 className="text-white text-xl font-semibold">See NexTrend.AI in Action</h3>
                <p className="text-white/80">Watch how easy it is to create mortgage content in minutes</p>
              </div>
            </div>
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
