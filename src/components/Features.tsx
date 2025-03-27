import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Shield, Sparkles, Layers, Users } from 'lucide-react';

const Features = () => {
  const navigate = useNavigate();
  
  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for Loan Officers Who Want to Scale FAST Online</h2>
            <p className="text-xl text-gray-600">
              NexTrend.AI provides mortgage professionals with the tools to create engaging, personalized content that resonates with clients.
            </p>
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: <Sparkles className="w-7 h-7" />,
              title: "AI-Powered Content",
              description: "Create tailored content for social media, blogs, emails, and more with our advanced AI assistant."
            },
            {
              icon: <Zap className="w-7 h-7" />,
              title: "Mortgage-Specific",
              description: "Content tailored for the mortgage industry, including market updates, product information, and FAQ answers."
            },
            {
              icon: <Shield className="w-7 h-7" />,
              title: "Your Authentic Voice",
              description: "Our AI learns your tone and style to create content that sounds like you wrote it yourself."
            },
            {
              icon: <Layers className="w-7 h-7" />,
              title: "Multiple Content Formats",
              description: "Generate content for social posts, videos, emails, blog articles, and more from a single topic."
            },
            {
              icon: <Users className="w-7 h-7" />,
              title: "Audience-Focused",
              description: "Create content that educates and engages both first-time homebuyers and seasoned real estate investors."
            },
            {
              icon: <Check className="w-7 h-7" />,
              title: "Compliance-Ready",
              description: "Industry-aware content that helps you stay within regulatory guidelines while being informative."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="rounded-full bg-nextrend-50 w-14 h-14 flex items-center justify-center text-nextrend-500 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <button 
            onClick={() => navigate('/dashboard')}
            className="button-hover inline-flex items-center px-6 py-3 bg-nextrend-500 text-white rounded-lg font-medium"
          >
            See All Features
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
