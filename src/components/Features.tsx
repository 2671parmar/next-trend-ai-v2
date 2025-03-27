
import React from 'react';
import { Newspaper, MessageSquare, Video, BarChart, FileText, Cpu } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Create Content That Converts
          </h2>
          <p className="text-lg text-gray-600">
            NexTrend.AI helps you create personalized, engaging content in your own voice across multiple formats, saving you hours of work each week.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
        
        <div className="mt-20">
          <div className="bg-gradient-to-br from-nextrend-50 to-blue-50 rounded-2xl p-8 md:p-12 shadow-lg animate-fade-up">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-6">
                  Your Voice, Amplified by AI
                </h3>
                <p className="text-gray-600 mb-6">
                  NexTrend.AI learns your unique voice and style, ensuring all generated content sounds authentically like you. Upload existing content or answer a few questions to get started.
                </p>
                <ul className="space-y-3">
                  {[
                    "Maintain brand consistency across all channels",
                    "Save hours of writing and editing time",
                    "Scale your content marketing effortlessly",
                    "Stay relevant with real-time mortgage trends"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <div className="shrink-0 mt-1 mr-3 w-5 h-5 rounded-full bg-nextrend-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="relative">
                <div className="relative z-10 bg-white rounded-xl shadow-lg p-6 md:p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-nextrend-100 flex items-center justify-center mr-3">
                      <Cpu className="w-4 h-4 text-nextrend-600" />
                    </div>
                    <h4 className="font-medium">Brand Voice Analysis</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="h-2 w-3/4 bg-nextrend-100 rounded mb-2"></div>
                      <div className="h-2 w-1/2 bg-nextrend-100 rounded"></div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <div className="flex-1 h-2 bg-nextrend-200 rounded-full"></div>
                      <div className="flex-1 h-2 bg-nextrend-300 rounded-full"></div>
                      <div className="flex-1 h-2 bg-nextrend-400 rounded-full"></div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="h-2 w-5/6 bg-nextrend-100 rounded mb-2"></div>
                      <div className="h-2 w-2/3 bg-nextrend-100 rounded"></div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-nextrend-100 rounded-full -z-10"></div>
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-100 rounded-full opacity-70 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="card-hover bg-white border border-gray-100 rounded-xl p-6 shadow-sm animate-fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-12 h-12 rounded-lg bg-nextrend-50 text-nextrend-500 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const features = [
  {
    icon: <Newspaper className="w-6 h-6" />,
    title: "Weekly Market Updates",
    description: "Stay on top of mortgage trends with AI-generated updates that explain complex market movements in simple terms."
  },
  {
    icon: <BarChart className="w-6 h-6" />,
    title: "Trending Topics",
    description: "Never miss an important industry development with content created from the latest mortgage and real estate trends."
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Mortgage Education",
    description: "Create educational content about mortgage products and terms that builds trust with potential clients."
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Video Scripts",
    description: "Generate engaging video scripts with hooks and proper structure to boost your social media presence."
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Social Media Posts",
    description: "Create platform-specific content optimized for LinkedIn, Facebook, and other social channels."
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "AI Voice Matching",
    description: "Train the AI to match your unique voice and style, ensuring all content sounds authentically like you."
  }
];

export default Features;
