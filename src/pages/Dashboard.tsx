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
      
      <main className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-12 px-6">
        <div className="max-w-6xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-12 pt-12 mb-4 pb-4"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Create High-Trust Content in Just a Few Clicks
            </h1>
            <p className="text-lg text-gray-600 max-w-6xl mx-auto">
            Select a content type below to instantly generate client-ready posts, emails, and more—all tailored for today's mortgage market. Partner with AI to create fast, effective content that keeps you visible—even when you're busy.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <ContentOption
              icon={<Newspaper className="w-6 h-6" />}
              title="MBS Commentary Today"
              description={
                <>
                  <p className="font-semibold">Explain the Market Like a Pro.</p>
                  <p>
                    Turn today's MBS updates into simple, client-ready content that helps you stay credible &amp; current—without needing to decode a market report. Ideal for daily posts or quick educational touchpoints.
                  </p>
                </>
              }
              onClick={() => handleOptionSelect('this-week')}
              delay={0.1}
            />
            
            <ContentOption
              icon={<BarChart className="w-6 h-6" />}
              title="Trending Topics"
              description={
                <>
                  <p className="font-semibold">Be the First to Speak on What's Hot.</p>
                  <p>
                  Generate content around the latest mortgage, housing, and economic trends your clients are already hearing about—positioning you as the expert they trust. Updated regularly to keep you ahead of the conversation.
                  </p>
                </>
              }
              onClick={() => handleOptionSelect('trending')}
              delay={0.2}
            />
            
            <ContentOption
              icon={<FileText className="w-6 h-6" />}
              title="General Mortgage"
              description={
                <>
                  <p className="font-semibold">Answer the Questions Clients Ask Most.</p>
                  <p>
                  Break down common mortgage questions with ready-to-go content on loans, products, and terms—perfect for first-time buyers and repeat clients alike.
                  </p>
                </>
              }
              onClick={() => handleOptionSelect('general')}
              delay={0.3}
            />
            
            <ContentOption
              icon={<MessageSquare className="w-6 h-6" />}
              title="You Tell Me"
              description={
                <>
                  <p className="font-semibold">Your Ideas (or Ours), Turned Into Powerful Content.</p>
                  <p>
                  Drop in your topic or brainstorm, and we'll build the content around it. Use our built-in Hook Library to spark inspiration or fine-tune your message.
                  </p>
                </>
              }
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
