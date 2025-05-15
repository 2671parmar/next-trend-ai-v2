import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, BarChart, FileText, MessageSquare } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ContentOption from '@/components/ContentOption';

type ContentOptionType = 'this-week' | 'trending' | 'general' | 'custom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleOptionSelect = (option: ContentOptionType) => {
    navigate(`/editor/${option}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-6">
        <div className="max-w-6xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Generate Content Your Clients Will Love
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Select a content source below to start generating personalized content in your unique voice.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <ContentOption
              icon={<Newspaper className="w-6 h-6" />}
              title="MBS Commentary Today"
              description="Get the latest mortgage market updates explained in simple terms for your clients."
              onClick={() => handleOptionSelect('this-week')}
              delay={0.1}
            />
            
            <ContentOption
              icon={<BarChart className="w-6 h-6" />}
              title="Trending Topics"
              description="Create content based on the hottest mortgage and real estate topics right now."
              onClick={() => handleOptionSelect('trending')}
              delay={0.2}
            />
            
            <ContentOption
              icon={<FileText className="w-6 h-6" />}
              title="General Mortgage"
              description="Generate educational content about common mortgage products and terms."
              onClick={() => handleOptionSelect('general')}
              delay={0.3}
            />
            
            <ContentOption
              icon={<MessageSquare className="w-6 h-6" />}
              title="You Tell Me"
              description="Your brainstorm, your way. Anything goes."
              onClick={() => handleOptionSelect('custom')}
              delay={0.4}
            />
          </div>
          
          {/* Recent Content */}
          {/* <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Recent Content</h2>
            
            <div className="text-center py-8 text-gray-500">
              <p>You haven't created any content yet.</p>
              <p className="text-sm mt-2">Select a content source above to get started.</p>
            </div>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
