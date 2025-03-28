import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, BarChart, FileText, MessageSquare, ArrowLeft, Save, ExternalLink, Send, RefreshCw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TextEditor from '@/components/TextEditor';

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

const generateNewsFeedData = (option: string) => {
  const today = new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  
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
  
  if (option === 'this-week') {
    return commonData.slice(0, 3);
  } else if (option === 'trending') {
    const extendedTrending = [...commonData];
    for (let i = 0; i < 3; i++) {
      extendedTrending.push({
        ...commonData[i],
        id: i + 7,
        title: `${commonData[i].title} - Updated`,
      });
    }
    for (let i = 0; i < 3; i++) {
      extendedTrending.push({
        ...commonData[i + 3],
        id: i + 10,
        title: `${commonData[i + 3].title} - New Analysis`,
      });
    }
    return extendedTrending.slice(0, 9);
  } else if (option === 'general') {
    const shuffled = [...mortgageTerms].sort(() => 0.5 - Math.random());
    const selectedTerms = shuffled.slice(0, 25);
    
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

const optionDetails = {
  'this-week': { title: 'MBS Commentary Today', icon: <Newspaper className="w-6 h-6" /> },
  'trending': { title: 'Trending Topics', icon: <BarChart className="w-6 h-6" /> },
  'general': { title: 'General Mortgage', icon: <FileText className="w-6 h-6" /> },
  'custom': { title: 'Custom Content', icon: <MessageSquare className="w-6 h-6" /> }
};

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
  
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  
  useEffect(() => {
    if (option) {
      setNewsFeed(generateNewsFeedData(option));
      setSelectedArticle(null);
      setShowEditor(false);
      setGeneratedContent('');
      
      if (option === 'custom' && chatMessages.length === 0) {
        setChatMessages([
          {
            role: 'assistant',
            content: 'Hi there! How can I help you create content today?',
            timestamp: new Date()
          }
        ]);
      }
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
    
    setTimeout(() => {
      const article = newsFeed.find(item => item.id === articleId);
      if (article && option === 'general') {
        const generatedContent = `${article.title}: A key mortgage concept that helps borrowers understand the lending process. This term is important for clients to know when navigating their home financing journey.`;
        
        setSelectedArticle({
          ...article,
          isGenerating: false,
          generatedContent: generatedContent
        });
        
        const initialContent = `# ${article.title}\n\n${article.title} is an important mortgage concept that your clients should understand.\n\nKey points about this term:\n- This term relates to the mortgage process\n- Understanding this can help clients make better decisions\n- You can customize this explanation for your specific audience`;
        
        setGeneratedContent(initialContent);
        setShowEditor(true);
      } else {
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
      }
    }, 1500);
  };
  
  const handleReadArticle = (articleId: number) => {
    console.log(`Opening full article with ID: ${articleId}`);
    setNewsFeed(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, isSelected: true }
          : article
      )
    );
  };

  const handleUseArticle = (articleId: number) => {
    const article = newsFeed.find(item => item.id === articleId);
    if (article) {
      setSelectedArticle(article);
      setShowEditor(true);
      
      let initialContent = '';
      if (article.generatedContent) {
        initialContent = article.generatedContent;
      } else if (option === 'general') {
        initialContent = `# ${article.title}\n\n${article.title} is an important mortgage concept that your clients should understand.\n\nKey points about this term:\n- This term relates to the mortgage process\n- Understanding this can help clients make better decisions\n- You can customize this explanation for your specific audience`;
      } else {
        initialContent = `${article.title}\n\n${article.content}\n\nFurther analysis and context can be added here...`;
      }
      
      setGeneratedContent(initialContent);
    }
  };
  
  const handleRegenerateContent = () => {
    if (!selectedArticle) return;
    
    setIsGenerating(true);
    
    setTimeout(() => {
      let updatedContent;
      
      if (option === 'general') {
        updatedContent = `# ${selectedArticle.title} - Explained\n\n${selectedArticle.title} is a fundamental mortgage concept that clients often ask about.\n\nDetailed explanation:\n- This term relates to how loans are structured\n- It impacts monthly payments and overall loan costs\n- Clients should understand this before making financing decisions\n\nTips for explaining to clients:\n- Use simple language and relatable examples\n- Compare with similar concepts they might already understand\n- Highlight how this affects their specific situation`;
      } else {
        updatedContent = `${selectedArticle.title} - Regenerated\n\n${selectedArticle.content}\n\nThis is a newly generated version with additional insights and information about this topic that would be valuable to share with clients.`;
      }
      
      setGeneratedContent(updatedContent);
      setIsGenerating(false);
    }, 1500);
  };
  
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: userInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsGenerating(true);
    
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
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    setDragActive(false);
    
    let files: FileList | null = null;
    
    if ('dataTransfer' in event) {
      files = event.dataTransfer.files;
    } else if ('target' in event && event.target) {
      files = (event.target as HTMLInputElement).files;
    }
    
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target?.result as string;
        
        const userMessage: ChatMessage = {
          role: 'user',
          content: `Uploaded document: ${file.name}`,
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, userMessage]);
        setIsGenerating(true);
        
        setTimeout(() => {
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: `I've analyzed the document "${file.name}". Here's a summary you can share with clients:\n\nThis document covers important mortgage information that would be valuable for potential homebuyers. The key points include market trends and financing options.`,
            timestamp: new Date()
          };
          
          setChatMessages(prev => [...prev, assistantMessage]);
          setGeneratedContent(`I've analyzed the document "${file.name}". Here's a summary you can share with clients:\n\nThis document covers important mortgage information that would be valuable for potential homebuyers. The key points include market trends and financing options.`);
          setIsGenerating(false);
        }, 2000);
      };
      
      reader.readAsText(file);
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };
  
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    handleFileUpload(event);
  };
  
  const handleSave = () => {
    navigate('/dashboard');
  };
  
  if (!option || !optionDetails[option as keyof typeof optionDetails]) {
    return <div>Invalid option</div>;
  }
  
  const { title, icon } = optionDetails[option as keyof typeof optionDetails];
  const filteredNews = activeTab === 'all' ? newsFeed : newsFeed.filter(item => item.category.toLowerCase() === activeTab);
  
  if (showEditor && (option === 'this-week' || option === 'trending' || option === 'general')) {
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
                onClick={() => setShowEditor(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {title}
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
                {option === 'general' ? 'Edit Mortgage Term Content' : 'Edit Article Content'}
              </h1>
            </motion.div>
            
            <div className="grid grid-cols-1 gap-6">
              {selectedArticle && (
                <Card className="mb-4">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="outline" className="bg-nextrend-50 text-nextrend-500 hover:bg-nextrend-100">
                        {selectedArticle.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{selectedArticle.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{selectedArticle.title}</h3>
                    <p className="text-gray-600 text-sm">{selectedArticle.content}</p>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardContent className="p-6">
                  <TextEditor
                    content={generatedContent}
                    onContentChange={setGeneratedContent}
                    onRegenerateClick={handleRegenerateContent}
                    loading={isGenerating}
                    label="Content Editor"
                    placeholder="Edit the content to make it your own..."
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
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
                <MessageSquare className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">
                Your Custom Content
              </h1>
            </motion.div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Upload an article or document</h2>
                    
                    <div 
                      className={`bg-gray-50 border border-gray-100 rounded-lg p-4 mb-4 h-[300px] overflow-y-auto flex flex-col gap-3 ${
                        dragActive ? 'border-nextrend-500 bg-nextrend-50' : ''
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div 
                        className="text-center border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-full cursor-pointer"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <FileText className="w-16 h-16 text-gray-400 mb-3" />
                        <p className="text-gray-600 mb-2">Drag and drop your document here</p>
                        <p className="text-gray-500 text-sm">or click to browse files</p>
                        <input 
                          id="file-upload" 
                          type="file" 
                          accept=".txt,.pdf,.doc,.docx,.md" 
                          className="hidden" 
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <Button 
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="flex-1 max-w-xs"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Upload New Document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Chat About Anything Below</h2>
                    
                    <TextEditor
                      content={generatedContent}
                      onContentChange={setGeneratedContent}
                      loading={isGenerating}
                      placeholder="Type your message to get started..."
                      className="flex-1"
                      chatMode={true}
                      userInput={userInput}
                      onUserInputChange={setUserInput}
                      onSendMessage={handleSendMessage}
                      chatMessages={chatMessages}
                      label=""
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
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
                          
                          {article.generatedContent && option !== 'general' && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-100 text-sm">
                              <p className="font-medium mb-1 text-nextrend-600">Generated Content:</p>
                              <p className="text-gray-600">{article.generatedContent}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-auto border-t border-gray-100 p-4 flex justify-between items-center bg-gray-50">
                          {(option === 'this-week' || option === 'trending') ? (
                            <div className="flex w-full gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleReadArticle(article.id)}
                                className="text-xs flex-1"
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                Read Article
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleUseArticle(article.id)}
                                className="text-xs flex-1 bg-nextrend-500 hover:bg-nextrend-600"
                              >
                                Use Article
                              </Button>
                            </div>
                          ) : option === 'general' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateContent(article.id)}
                              disabled={article.isGenerating}
                              className="text-xs w-full"
                            >
                              {article.isGenerating ? 'Generating...' : 'Use this Mortgage Term'}
                            </Button>
                          ) : (
                            !article.generatedContent ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateContent(article.id)}
                                disabled={article.isGenerating}
                                className="text-xs w-full"
                              >
                                Generate Content
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
                                  onClick={() => handleUseArticle(article.id)}
                                >
                                  Use This
                                </Button>
                              </div>
                            )
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
