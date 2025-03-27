
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import { ArrowRight, ArrowUp } from 'lucide-react';

const Index = () => {
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <Navbar />
      
      <Hero />
      
      <Features />
      
      {/* Added Pricing component here */}
      <Pricing />
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-nextrend-500 to-nextrend-700 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-up">
            Your Personal Content Machine. Three Clicks Away.
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Start building your brand authority without wasting time. Get early access to NexTrend.AI today!
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="button-hover inline-flex items-center justify-center px-8 py-4 bg-white text-nextrend-600 rounded-lg font-medium text-lg animate-fade-up shadow-xl shadow-nextrend-700/20"
            style={{ animationDelay: '0.2s' }}
          >
            Start Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/lovable-uploads/d7cf0d96-7b79-4ff2-ba6b-9467b46d8ff2.png" 
                  alt="NexTrend.AI Logo" 
                  className="h-8 w-auto"
                />
                <div className="text-2xl font-bold">
                  <span>NexTrend</span>
                  <span className="text-nextrend-400">.AI</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered content creation for mortgage professionals.
                Personalized, engaging, and in your authentic voice.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => navigate('/dashboard')} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-white transition-colors">About</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Contact</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Privacy</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Terms</button></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} NexTrend.AI. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-nextrend-500 text-white rounded-full shadow-lg hover:bg-nextrend-600 transition-all z-50 animate-fade-in"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default Index;
