
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Shield, Sparkles, Layers, Users, Linkedin, FileText, Video, Mail, MessageSquare, X, TrendingUp, Film } from 'lucide-react';

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
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Built for Loan Officers Who Want to Scale FAST Online</h2>
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
          transition={{ duration: 0.5 }}
          className="mt-24 mb-16 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">1 Click = 8 Ready-to-Post Content Pieces</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            More engagement. More visibility. More business.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: <Linkedin className="w-6 h-6" />,
              title: "LinkedIn Post",
              description: "Build authority & start conversations."
            },
            {
              icon: <FileText className="w-6 h-6" />,
              title: "Blog Post",
              description: "SEO-friendly articles that drive traffic."
            },
            {
              icon: <Video className="w-6 h-6" />,
              title: "Video Script",
              description: "Ready-to-use scripts for YouTube, reels & shorts."
            },
            {
              icon: <Film className="w-6 h-6" />,
              title: "Reel/Short Script",
              description: "Attention-grabbing scripts for Instagram & TikTok."
            },
            {
              icon: <Mail className="w-6 h-6" />,
              title: "Email",
              description: "Personalized emails that nurture leads."
            },
            {
              icon: <MessageSquare className="w-6 h-6" />,
              title: "Social Post",
              description: "Content for Facebook, Instagram & beyond."
            },
            {
              icon: <X className="w-6 h-6" />,
              title: "X (Twitter) Post",
              description: "Short, impactful tweets that engage."
            },
            {
              icon: <TrendingUp className="w-6 h-6" />,
              title: "SMS Broadcast",
              description: "Quick, effective texts for instant response."
            }
          ].map((format, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="rounded-full bg-nextrend-50 w-12 h-12 flex items-center justify-center text-nextrend-500 mb-4">
                {format.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{format.title}</h3>
              <p className="text-gray-600 text-sm">{format.description}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-nextrend-50 rounded-2xl p-8 md:p-12 mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-nextrend-500 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Enter your idea or topic</h3>
              <p className="text-gray-600">Start with a simple idea or industry topic.</p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-nextrend-500 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Click once</h3>
              <p className="text-gray-600">Watch NexTrend.AI generate 8 formats instantly.</p>
            </div>
            <div className="text-center">
              <div className="rounded-full bg-nextrend-500 text-white w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Copy, tweak & publish</h3>
              <p className="text-gray-600">Use immediately or make small adjustments before posting.</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-lg font-medium text-nextrend-700">Need daily posts? A week's worth of content?</p>
            <p className="text-lg font-bold text-nextrend-700">Create it all in under 10 minutes.</p>
          </div>
        </motion.div>
        
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
