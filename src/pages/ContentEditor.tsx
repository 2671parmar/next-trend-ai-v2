
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, BarChart, FileText, MessageSquare, Video, Linkedin, Facebook, Mail, ArrowLeft, Save } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import TextEditor from '@/components/TextEditor';
import ContentForm, { contentFormOptions } from '@/components/ContentForm';
import ContentOutput from '@/components/ContentOutput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock content generation
const generateMockContent = (option: string, format: string) => {
  const baseContent = {
    'this-week': "This week in the mortgage market, rates have stabilized around 6.5% after several weeks of volatility. The Federal Reserve's recent comments suggest they're taking a patient approach to future rate adjustments, which could mean good news for prospective homebuyers in the coming months.",
    'trending': "First-time homebuyer programs are gaining significant attention as more millennials enter the housing market despite high interest rates. Many are taking advantage of down payment assistance and specialized loan products to overcome affordability challenges.",
    'general': "A fixed-rate mortgage offers stability with the same interest rate throughout the life of your loan. This means your monthly principal and interest payments remain unchanged, making budgeting more predictable, even if market rates increase.",
    'custom': "As your local mortgage expert, I'm seeing increasing opportunities for homeowners to tap into their equity through cash-out refinancing. With property values in our area up by 15% over the last year, many clients are using this strategy to fund home improvements or consolidate debt."
  };

  return baseContent[option as keyof typeof baseContent] || '';
};

// Content format icons
const formatIcons = {
  'video-script': <Video className="w-4 h-4" />,
  'blog-post': <FileText className="w-4 h-4" />,
  'linkedin': <Linkedin className="w-4 h-4" />,
  'social': <Facebook className="w-4 h-4" />,
  'email': <Mail className="w-4 h-4" />,
  'combo': <MessageSquare className="w-4 h-4" />,
};

// Option titles and icons
const optionDetails = {
  'this-week': { title: 'MBS Commentary Today', icon: <Newspaper className="w-6 h-6" /> },
  'trending': { title: 'Trending Topics', icon: <BarChart className="w-6 h-6" /> },
  'general': { title: 'General Mortgage', icon: <FileText className="w-6 h-6" /> },
  'custom': { title: 'Custom Content', icon: <MessageSquare className="w-6 h-6" /> }
};

const ContentEditor: React.FC = () => {
  const { option } = useParams<{ option: string }>();
  const navigate = useNavigate();
  
  const [content, setContent] = useState('');
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  
  useEffect(() => {
    // Initialize with sample content based on the option
    if (option) {
      setContent(generateMockContent(option, ''));
    }
  }, [option]);
  
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };
  
  const handleFormatToggle = (formatId: string) => {
    setSelectedFormats(prev => 
      prev.includes(formatId)
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    );
  };
  
  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate content generation with a delay
    setTimeout(() => {
      const newGeneratedContent: Record<string, string> = {};
      
      selectedFormats.forEach(format => {
        newGeneratedContent[format] = generateMockContent(option || '', format);
      });
      
      setGeneratedContent(newGeneratedContent);
      setIsGenerating(false);
    }, 1500);
  };
  
  const handleSave = () => {
    // In a real app, this would save the content to the database
    navigate('/dashboard');
  };
  
  if (!option || !optionDetails[option as keyof typeof optionDetails]) {
    return <div>Invalid option</div>;
  }
  
  const { title, icon } = optionDetails[option as keyof typeof optionDetails];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <Button 
              variant="ghost" 
              className="flex items-center text-gray-600"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            <Button 
              variant="default" 
              className="bg-nextrend-500 hover:bg-nextrend-600"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Content
            </Button>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center mb-6"
          >
            <div className="w-10 h-10 rounded-lg bg-nextrend-50 text-nextrend-500 flex items-center justify-center mr-3">
              {icon}
            </div>
            <h1 className="text-2xl font-bold">{title}</h1>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6"
              >
                <TextEditor 
                  content={content}
                  onContentChange={handleContentChange}
                  label="Content Source"
                  placeholder="Enter or edit the content source here..."
                />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <h2 className="text-lg font-semibold mb-4">Select Content Formats</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {contentFormOptions.map((format) => (
                    <ContentForm
                      key={format.id}
                      icon={format.icon}
                      title={format.title}
                      description={format.description}
                      onClick={() => handleFormatToggle(format.id)}
                      selected={selectedFormats.includes(format.id)}
                    />
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    className="bg-nextrend-500 hover:bg-nextrend-600"
                    onClick={handleGenerate}
                    disabled={selectedFormats.length === 0 || isGenerating}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Content'}
                  </Button>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h2 className="font-semibold">Generated Content</h2>
              </div>
              
              {selectedFormats.length > 0 ? (
                <Tabs defaultValue={selectedFormats[0]} className="p-4">
                  <TabsList className="mb-4 w-full justify-start border-b border-gray-100 pb-1">
                    {selectedFormats.map(format => (
                      <TabsTrigger 
                        key={format} 
                        value={format}
                        className="flex items-center"
                      >
                        <span className="mr-1">{formatIcons[format as keyof typeof formatIcons]}</span>
                        <span className="text-xs truncate max-w-[80px]">
                          {contentFormOptions.find(f => f.id === format)?.title}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {selectedFormats.map(format => (
                    <TabsContent key={format} value={format}>
                      <ContentOutput 
                        title={contentFormOptions.find(f => f.id === format)?.title || ''}
                        content={generatedContent[format] || ''}
                        icon={formatIcons[format as keyof typeof formatIcons]}
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <p>Select content formats to generate.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContentEditor;
