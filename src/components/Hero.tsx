
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen pt-24 pb-16 px-6 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-white -z-10" />
      
      {/* Abstract Shape - Top Right */}
      <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-nextrend-100 rounded-bl-full opacity-40 -z-10" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] -z-10" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-6 items-center">
          <div className="flex flex-col animate-fade-up">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 text-sm font-medium bg-nextrend-100 text-nextrend-700 rounded-full">
                Simplify Your Content Creation
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Content creation <span className="text-nextrend-500">in your voice</span>, at scale.
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              NexTrend.AI helps loan officers create engaging, personalized content in minutes. Stay on top of mortgage trends, rates, and terms with AI-powered content generation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/dashboard" 
                className="button-hover inline-flex items-center justify-center px-6 py-3 text-white bg-nextrend-500 rounded-lg font-medium"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              
              <Link 
                to="#features" 
                className="button-hover inline-flex items-center justify-center px-6 py-3 text-nextrend-600 bg-nextrend-50 rounded-lg font-medium border border-nextrend-200"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-white">
                {/* Dashboard Preview Image */}
                <div className="w-full h-full bg-gradient-to-br from-nextrend-500 to-nextrend-700 p-8 flex flex-col justify-center items-center">
                  <div className="glass p-6 rounded-lg w-full max-w-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Generate Content</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="h-2 w-3/4 bg-nextrend-100 rounded"></div>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="h-2 w-1/2 bg-nextrend-100 rounded"></div>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <div className="h-2 w-5/6 bg-nextrend-100 rounded"></div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <div className="h-8 w-24 bg-nextrend-500 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-1/2 -right-12 w-24 h-24 bg-nextrend-200 rounded-full opacity-60 animate-pulse-soft" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-8 left-1/4 w-16 h-16 bg-nextrend-300 rounded-full opacity-40 animate-pulse-soft" style={{ animationDelay: '1.2s' }}></div>
          </div>
        </div>
        
        {/* Social Proof */}
        <div className="mt-20 border-t border-gray-200 pt-12">
          <p className="text-center text-gray-500 mb-8">Trusted by loan officers across the country</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {['Bank of Trust', 'Lender Prime', 'HomeQuest', 'FutureMortgage', 'LoanStar'].map((company) => (
              <div key={company} className="text-gray-400 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
