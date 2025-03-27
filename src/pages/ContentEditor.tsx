
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, BarChart, FileText, MessageSquare, ArrowLeft, Save, ExternalLink, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TextEditor from '@/components/TextEditor';

// List of mortgage terms for the General Mortgage section
const mortgageTerms = [
  "Adjustable-Rate Mortgage (ARM)",
  "Amortization",
  "Annual Percentage Rate (APR)",
  "Appraisal",
  "Balloon Mortgage",
  "Borrower",
  "Broker",
  "Closing Costs",
  "Co-Borrower",
  "Collateral",
  "Conforming Loan",
  "Conventional Loan",
  "Credit Score",
  "Debt-to-Income Ratio (DTI)",
  "Default",
  "Down Payment",
  "Earnest Money Deposit",
  "Equity",
  "Escrow",
  "Fannie Mae (FNMA)",
  "FHA Loan",
  "Fixed-Rate Mortgage",
  "Foreclosure",
  "Freddie Mac (FHLMC)",
  "Good Faith Estimate (GFE)",
  "Government-Backed Loan",
  "Hard Money Loan",
  "Hazard Insurance",
  "Home Equity Line of Credit (HELOC)",
  "Homeowners Association (HOA) Fees",
  "Homeowners Insurance",
  "Housing Ratio",
  "Interest Rate",
  "Jumbo Loan",
  "Lender",
  "Lien",
  "Loan Estimate (LE)",
  "Loan-to-Value Ratio (LTV)",
  "Lock-In Rate",
  "Margin (for ARMs)",
  "Maturity Date",
  "Mortgage",
  "Mortgage Banker",
  "Mortgage Broker",
  "Mortgage Insurance (MI)",
  "Mortgage Note",
  "Mortgage Underwriting",
  "Negative Amortization",
  "Non-Conforming Loan",
  "Origination Fee",
  "Pre-Approval",
  "Private Mortgage Insurance (PMI)",
  "Rate Lock",
  "Refinance",
  "Reverse Mortgage",
  "Title Insurance",
  "VA Loan",
  "Balloon Payment",
  "Cash-Out Refinance",
  "Escrow Account",
  "Forbearance",
  "Loan Modification",
  "Construction Loan",
  "Discount Points",
  "Gift Funds",
  "Home Inspection",
  "Interest-Only Loan"
];

// Mock news feed data
const generateNewsFeedData = (option: string) => {
  const today = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  
  // Common data for MBS Commentary and Trending Topics
  const commonData = [
    {
      id: 1,
      category: 'Mortgage',
      date: today,
      title: 'US Q4 final GDP +2.4% vs +2.3% expected',
      content: 'US Q4 final GDP +2.4% vs +2.3% expected. The fourth quarter GDP was revised upward, showing stronger economic growth than initially reported.',
      isGenerating: false,
    },
    {
      id: 2,
      category: 'Mortgage',
      date: today,
      title: 'US initial jobless claims 224K vs 225K estimate',
      content: 'Weekly jobless claims came in slightly below expectations, indicating continued resilience in the labor market despite concerns over potential economic slowdown.',
      isGenerating: false,
    },
    {
      id: 3,
      category: 'Mortgage',
      date: today,
      title: 'Treasury yields are higher as investors weigh new auto tariffs',
      content: 'U.S. Treasury yields ticked higher on Thursday as investors digested the latest news on potential new auto tariffs and their impact on inflation expectations.',
      isGenerating: false,
    },
    {
      id: 4,
      category: 'Mortgage',
      date: today,
      title: 'Update: Lumber Prices Up 15% YoY',
      content: 'Lumber prices have increased 15% compared to the same period last year, potentially raising costs for new home construction and renovation projects.',
      isGenerating: false,
    },
    {
      id: 5,
      category: 'Mortgage',
      date: today,
      title: 'Final Look at Local Housing Markets in February',
      content: 'A brief excerpt from the latest housing market analysis shows inventory levels increasing in most major metros compared to last year, while price growth is moderating.',
      isGenerating: false,
    },
    {
      id: 6,
      category: 'Mortgage',
      date: today,
      title: 'New auto tariffs could impact mortgage rates',
      content: 'Analysts suggest the proposed auto tariffs could put upward pressure on inflation, potentially delaying expected Fed rate cuts this year.',
      isGenerating: false,
    }
  ];
  
  // Return MBS Commentary or Trending Topics data
  if (option === 'this-week') {
    return commonData;
  } else if (option === 'trending') {
    return commonData.filter(item => item.id % 2 === 0);
  } else if (option === 'general') {
    // Randomly select 25 unique mortgage terms
    const shuffled = [...mortgageTerms].sort(() => 0.5 - Math.random());
    const selectedTerms = shuffled.slice(0, 25);
    
    // Generate mortgage term data
    return selectedTerms.map((term, index) => ({
      id: index + 1,
      category: 'Term',
      date: today,
      title: term,
      content: `Description for ${term} will appear here when you generate content.`,
      isGenerating: false,
    }));
  } else {
    return commonData.slice(0, 3);
  }
};

// Option titles and icons
const optionDetails = {
  'this-week': { title: 'MBS Commentary Today', icon: <Newspaper className="w-6 h-6" /> },
  'trending': { title: 'Trending Topics', icon: <BarChart className="w-6 h-6" /> },
  'general': { title: 'General Mortgage', icon: <FileText className="w-6 h-6" /> },
  'custom': { title: 'Custom Content', icon: <MessageSquare className="w-6 h-6" /> }
};

// Chat message type for custom content
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ContentEditor: React.FC = () => {
  const { option } = useParams<{ option: string }>();
  const navigate = useNavigate();
  
  const [newsFeed, setNewsFeed] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // State for custom chat interface
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  
  useEffect(() => {
    if (option) {
      // Initialize with news feed data
      setNewsFeed(generateNewsFeedData(option));
    }
  }, [option]);
  
  const handleGenerateContent = (articleId: number) => {
    setNewsFeed(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, isGenerating: true }
          : article
      )
    );
    
    // Simulate content generation
    setTimeout(() => {
      setNewsFeed(prev => 
        prev.map(article => 
          article.id === articleId 
            ? { 
                ...article, 
                isGenerating: false,
                generatedContent: option === 'general'
                  ? `${article.title}: A key mortgage concept that helps borrowers understand the lending process. This term is important for clients to know when navigating their home financing journey.`
                  : `Generated content for "${article.title}" that explains this topic in a way that's easy for clients to understand. This content is tailored for mortgage professionals to share with their clients.`
              }
            : article
        )
      );
    }, 1500);
  };
  
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsGenerating(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `Here's some content about "${userInput}" that you can share with your clients:\n\nThe current mortgage market is seeing significant changes due to recent economic developments. This presents both challenges and opportunities for homebuyers and those looking to refinance.`,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, assistantMessage]);
      setGeneratedContent(`Here's some content about "${userInput}" that you can share with your clients:\n\nThe current mortgage market is seeing significant changes due to recent economic developments. This presents both challenges and opportunities for homebuyers and those looking to refinance.`);
      setIsGenerating(false);
    }, 2000);
  };
  
  const handleSave = () => {
    // In a real app, this would save the content to the database
    navigate('/dashboard');
  };
  
  if (!option || !optionDetails[option as keyof typeof optionDetails]) {
    return <div>Invalid option</div>;
  }
  
  const { title, icon } = optionDetails[option as keyof typeof optionDetails];
  const filteredNews = activeTab === 'all' ? newsFeed : newsFeed.filter(item => item.category.toLowerCase() === activeTab);
  
  // Custom content chat interface
  if (option === 'custom') {
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
                disabled={!generatedContent}
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
              <h1 className="text-2xl font-bold">
                Your Custom Content
              </h1>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chat Interface */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Tell me what you want to write about</h2>
                    
                    <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4 h-[300px] overflow-y-auto flex flex-col gap-3">
                      {chatMessages.length === 0 ? (
                        <div className="text-center text-gray-500 my-auto">
                          <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                          <p>Type a topic or question below to generate content</p>
                        </div>
                      ) : (
                        chatMessages.map((msg, index) => (
                          <div 
                            key={index}
                            className={`p-3 rounded-lg max-w-[80%] ${
                              msg.role === 'user' 
                                ? 'bg-nextrend-500 text-white ml-auto' 
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            {msg.content}
                          </div>
                        ))
                      )}
                      
                      {isGenerating && (
                        <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[80%] flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Type your topic here... (e.g., 'Current mortgage rates' or 'First-time homebuyer tips')"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="flex-1"
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={isGenerating || !userInput.trim()} 
                        className="bg-nextrend-500 hover:bg-nextrend-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              {/* Generated Content Editor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Edit Generated Content</h2>
                    
                    <TextEditor
                      content={generatedContent}
                      onContentChange={setGeneratedContent}
                      onRegenerateClick={chatMessages.length > 0 ? handleSendMessage : undefined}
                      loading={isGenerating}
                      placeholder="Your generated content will appear here..."
                      className="flex-1"
                    />
                    
                    {generatedContent && (
                      <div className="mt-4 flex justify-end">
                        <Button className="bg-nextrend-500 hover:bg-nextrend-600">
                          Use This Content
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  // Custom tabs for the General Mortgage section
  const tabsContent = option === 'general' 
    ? (
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Terms</TabsTrigger>
      </TabsList>
    )
    : (
      <TabsList className="mb-6">
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
        <TabsTrigger value="housing">Housing</TabsTrigger>
        <TabsTrigger value="economy">Economy</TabsTrigger>
      </TabsList>
    );
  
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
            <h1 className="text-2xl font-bold">
              {option === 'general' ? 'Mortgage Terminology' : 'News Feed'}
            </h1>
          </motion.div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            {tabsContent}
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {filteredNews.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: article.id * 0.05 }}
                  >
                    <Card className="overflow-hidden h-full flex flex-col">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="p-5">
                          <div className="flex justify-between items-center mb-3">
                            <Badge variant="outline" className="bg-nextrend-50 text-nextrend-500 hover:bg-nextrend-100">
                              {article.category}
                            </Badge>
                            <span className="text-sm text-gray-500">{article.date}</span>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                          
                          <div className="text-gray-600 text-sm mb-4">
                            {article.content}
                          </div>
                          
                          {article.generatedContent && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100 text-sm">
                              <p className="font-medium mb-1 text-nextrend-600">Generated Content:</p>
                              <p className="text-gray-600">{article.generatedContent}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-auto border-t border-gray-100 p-4 flex justify-between items-center bg-gray-50">
                          {!article.generatedContent ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateContent(article.id)}
                              disabled={article.isGenerating}
                              className="text-xs w-full"
                            >
                              {article.isGenerating ? 'Generating...' : 'Generate Content'}
                            </Button>
                          ) : (
                            <div className="flex w-full justify-between">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateContent(article.id)}
                                className="text-xs"
                              >
                                Regenerate
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                className="text-xs bg-nextrend-500 hover:bg-nextrend-600"
                              >
                                Use This
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ContentEditor;
