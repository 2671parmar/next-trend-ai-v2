import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, BarChart, FileText, MessageSquare, ArrowLeft, Save, ExternalLink, Send, RefreshCw, Copy, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TextEditor from '@/components/TextEditor';
import { contentService } from '@/lib/services/contentService';
import { type MBSArticle } from '@/lib/services/contentService';
import TypewriterText from '@/components/TypewriterText';

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

const contentPrompts = [
  { headline: "What's the most important mortgage term for your clients?", hook: "Understanding this term can help them make better decisions when financing their homes." },
  { headline: "How can you explain the difference between a fixed-rate and adjustable-rate mortgage?", hook: "This can help clients choose the right loan for their needs." },
  { headline: "What are some common mortgage terms that clients often ask about?", hook: "This can help you provide more personalized and helpful responses." }
];

const generateNewsFeedData = async (option: string) => {
  if (option === 'this-week') {
    try {
      const articles = await contentService.getMBSArticles();
      return articles.map(article => ({
        id: article.id,
        category: article.category,
        date: new Date(article.date).toLocaleDateString('en-US', { 
          month: 'numeric', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        title: article.title,
        content: article.description,
        url: article.url,
        isGenerating: article.is_generating
      }));
    } catch (error) {
      console.error('Error fetching MBS articles:', error);
      throw error;
    }
  }
  
  if (option === 'trending') {
    try {
      const articles = await contentService.getTrendingArticles();
      return articles.map(article => ({
        id: article.id,
        category: article.category || 'Mortgage',
        date: new Date(article.date).toLocaleDateString('en-US', { 
          month: 'numeric', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        title: article.title,
        content: article.content,
        url: article.url,
        isGenerating: false
      }));
    } catch (error) {
      console.error('Error fetching trending articles:', error);
      throw error;
    }
  }
  
  if (option === 'general') {
    const shuffled = [...mortgageTerms].sort(() => 0.5 - Math.random());
    const selectedTerms = shuffled.slice(0, 25);
    
    return selectedTerms.map((term, index) => ({
      id: index + 1,
      category: 'Term',
      date: new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }),
      title: term,
      content: `Description for ${term} will appear here when you generate content.`,
      isGenerating: false,
    }));
  }
  
  return [];
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

interface GeneratedContent {
  type: string;
  content: string;
  isGenerating?: boolean;
}

const ITEMS_PER_PAGE = 12;

const ContentEditor: React.FC = () => {
  const { option } = useParams<{ option: string }>();
  const navigate = useNavigate();
  
  const [newsFeed, setNewsFeed] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [userInput, setUserInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(contentPrompts[Math.floor(Math.random() * contentPrompts.length)]);

  // Reset pagination when changing tabs or options
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, option]);

  // Update selected prompt when component mounts or when chat messages are cleared
  useEffect(() => {
    if (option === 'custom' && chatMessages.length === 0) {
      setSelectedPrompt(contentPrompts[Math.floor(Math.random() * contentPrompts.length)]);
    }
  }, [option, chatMessages.length]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (option) {
      const loadData = async () => {
        setIsLoading(true);
        setIsDataLoaded(false);
        setIsRendered(false);
        setError('');
        try {
          const data = await generateNewsFeedData(option);
          setNewsFeed(data);
          setSelectedArticle(null);
          setShowEditor(false);
          setGeneratedContents([]);
          
          if (option === 'custom' && chatMessages.length === 0) {
            setChatMessages([
              {
                role: 'assistant',
                content: 'Example Idea:',
                timestamp: new Date()
              }
            ]);
          }
        } catch (error) {
          console.error('Error loading data:', error);
          setError('Failed to load data. Please try again.');
        } finally {
          // Set data loaded first
          setIsDataLoaded(true);
          // Then wait for next render cycle to set rendered state
          requestAnimationFrame(() => {
            setIsRendered(true);
          });
        }
      };
      loadData();
    }
  }, [option]);
  
  const handleGenerateContent = async () => {
    if (!selectedArticle) return;
    
    setIsGenerating(true);
    setError('');
    
    try {
      const articleData = {
        title: selectedArticle.title,
        content: selectedArticle.content,
        category: selectedArticle.category
      };
      
      const contentTypes = [
        { type: 'LinkedIn Post', description: 'Thought Leadership, Expert Take' },
        { type: 'Blog Post', description: 'Deep-Dive, SEO-Optimized' },
        { type: 'Video Script', description: 'Educational, Senior Loan Officer Perspective' },
        { type: 'Email', description: 'Client-Focused, Trust-Building' },
        { type: 'Social Post', description: 'Engaging & Value-Driven' },
        { type: 'X/Twitter Post', description: 'Quick, Authority Take' },
        { type: 'SMS Broadcast', description: 'Concise, CTA-Driven' }
      ];

      // Initialize all content types with loading state
      setGeneratedContents(contentTypes.map(type => ({
        type: type.type,
        content: '',
        isGenerating: true
      })));

      // Generate content for each type sequentially
      for (const [index, { type, description }] of contentTypes.entries()) {
        const prompt = `Generate a ${type} (${description}) for this ${articleData.category} article:\n\nTitle: ${articleData.title}\n\nContent: ${articleData.content}`;
        const result = await contentService.generateContent(prompt);
        
        setGeneratedContents(prev => {
          const updated = [...prev];
          updated[index] = {
            type,
            content: result,
            isGenerating: false
          };
          return updated;
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
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

  const handleUseArticle = async (articleId: number) => {
    const article = newsFeed.find(item => item.id === articleId);
    if (article) {
      try {
        // Fetch full article content if it's an MBS article
        if (option === 'this-week' && article.url) {
          const fullArticle = await contentService.getMBSArticleContent(article.url);
          if (fullArticle) {
            setSelectedArticle({
              ...article,
              description: article.content,
              content: fullArticle.content
            });
          }
        } else {
          setSelectedArticle({
            ...article,
            description: article.content
          });
        }
        setShowEditor(true);
        setGeneratedContents([]);
        // Set the initial content in the editor
        setGeneratedContents([{ 
          type: 'Original Article',
          content: `${article.title}\n\n${article.content}`
        }]);
      } catch (error) {
        console.error('Error fetching article content:', error);
        setError('Failed to fetch article content');
      }
    }
  };
  
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    setIsGenerating(true);
    setError('');
    
    try {
      // Prepare the content for generation
      const customContent = {
        title: "Custom Content",
        content: userInput,
        category: "Custom"
      };
      
      // Generate content for each type from contentService.ts
      const contentTypes = [
        { type: 'LinkedIn Post', description: 'Thought Leadership, Expert Take' },
        { type: 'Blog Post', description: 'Deep-Dive, SEO-Optimized' },
        { type: 'Video Script', description: 'Educational, Senior Loan Officer Perspective' },
        { type: 'Email', description: 'Client-Focused, Trust-Building' },
        { type: 'Social Post', description: 'Engaging & Value-Driven' },
        { type: 'X/Twitter Post', description: 'Quick, Authority Take' },
        { type: 'SMS Broadcast', description: 'Concise, CTA-Driven' }
      ];
      
      // Initialize all content types with loading state
      setGeneratedContents(contentTypes.map(type => ({
        type: type.type,
        content: '',
        isGenerating: true
      })));
      
      const newContents = [];
      
      // Generate content for each type sequentially
      for (const [index, { type, description }] of contentTypes.entries()) {
        const prompt = `Generate a ${type} (${description}) for this custom content:\n\nContent: ${customContent.content}`;
        const result = await contentService.generateContent(prompt);
        
        setGeneratedContents(prev => {
          const updated = [...prev];
          updated[index] = {
            type,
            content: result,
            isGenerating: false
          };
          return updated;
        });
      }

      // Add the message to chat history
      const userMessage: ChatMessage = {
        role: 'user',
        content: userInput,
        timestamp: new Date()
      };
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: 'I have generated various content formats based on your input. You can find them below.',
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, userMessage, assistantMessage]);
      setUserInput('');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
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
          setGeneratedContents([{ type: 'LinkedIn Post', content: `I've analyzed the document "${file.name}". Here's a summary you can share with clients:\n\nThis document covers important mortgage information that would be valuable for potential homebuyers. The key points include market trends and financing options.` }]);
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
  
  const handleTestGeneration = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Test with a sample mortgage topic
      const testContent = "Generate content about Fixed-Rate Mortgages and their benefits in today's market.";
      const result = await contentService.generateContent(testContent);
      setGeneratedContents([{ type: 'LinkedIn Post', content: result }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // You can add toast notification here if you want
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  const handleUseGeneralTerm = async (article: any) => {
    setSelectedArticle({
      ...article,
      description: article.content,
      content: `Generate comprehensive, expert-level content about the mortgage term: ${article.title}. Include its definition, importance, and how it affects mortgage decisions.`
    });
    setShowEditor(true);
    setGeneratedContents([]);
    // Set the initial content in the editor
    setGeneratedContents([{ 
      type: 'Original Article',
      content: `${article.title}\n\n${article.content}`
    }]);
  };
  
  if (!option || !optionDetails[option as keyof typeof optionDetails]) {
    return <div>Invalid option</div>;
  }
  
  const { title, icon } = optionDetails[option as keyof typeof optionDetails];
  const filteredNews = activeTab === 'all' ? newsFeed : newsFeed.filter(item => item.category.toLowerCase() === activeTab);
  
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = filteredNews.slice(startIndex, endIndex);
  
  if (showEditor) {
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
                Back to {option === 'general' ? 'General Mortgage' : title}
              </Button>

              <Button 
                variant="default" 
                className="bg-green-500 hover:bg-green-600"
                onClick={handleSave}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Content
              </Button>
            </motion.div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">
                {error}
              </div>
            )}
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center mb-6"
            >
              <div className="w-10 h-10 rounded-lg bg-nextrend-50 text-nextrend-500 flex items-center justify-center mr-3">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">
                {selectedArticle?.title}
              </h1>
            </motion.div>
            
            <div className="grid grid-cols-1 gap-6">
              {option === 'general' ? (
                // For General Mortgage Terms
                <>
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
                        <p className="text-gray-600 text-sm">{selectedArticle.description}</p>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-end mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateContent}
                          disabled={isGenerating}
                          className="flex items-center"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                          {isGenerating ? 'Generating...' : 'Generate Content'}
                        </Button>
                      </div>
                      <TextEditor
                        content={selectedArticle?.content || ''}
                        onContentChange={(value) => {
                          setGeneratedContents(prev => {
                            const updated = prev.map(c => 
                              c.type === 'Original Article' 
                                ? { ...c, content: value }
                                : c
                            );
                            if (!updated.find(c => c.type === 'Original Article')) {
                              updated.unshift({ type: 'Original Article', content: value });
                            }
                            return updated;
                          });
                        }}
                        loading={isGenerating}
                        placeholder="Click 'Generate Content' to create social media posts..."
                      />
                    </CardContent>
                  </Card>

                  {generatedContents
                    .filter(content => content.type !== 'Original Article')
                    .map((content, index) => (
                    <Card key={index} className="mt-6 overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-0">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-nextrend-50/50 to-white p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-nextrend-500"></div>
                            <label className="font-medium text-gray-700">{content.type}</label>
                            {content.isGenerating && (
                              <RefreshCw className="w-4 h-4 text-nextrend-500 animate-spin ml-2" />
                            )}
                          </div>
                          {!content.isGenerating && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(content.content)}
                              className="hover:bg-nextrend-100/50"
                            >
                              <Copy className="w-4 h-4 text-gray-600" />
                            </Button>
                          )}
                        </div>
                        <div className="p-6 bg-white">
                          <div className="prose max-w-none">
                            <div className="text-gray-600 text-sm leading-relaxed">
                              {content.isGenerating ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-nextrend-500">Generating {content.type}...</span>
                                </div>
                              ) : (
                                <TypewriterText 
                                  content={content.content} 
                                  speed={15}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                // For MBS Commentary Today and Trending Topics
                <>
                  {selectedArticle && (
                    <Card className="mb-4">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-center mb-3">
                          <Badge variant="outline" className="bg-nextrend-50 text-nextrend-500 hover:bg-nextrend-100">
                            {option === 'trending' ? 'Mortgage' : selectedArticle.category}
                          </Badge>
                          <span className="text-sm text-gray-500">{selectedArticle.date}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{selectedArticle.title}</h3>
                        {option !== 'trending' && (
                          <p className="text-gray-600 text-sm">{selectedArticle.description}</p>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-end mb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateContent}
                          disabled={isGenerating}
                          className="flex items-center"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                          {isGenerating ? 'Generating...' : 'Generate Content'}
                        </Button>
                      </div>
                      <TextEditor
                        content={selectedArticle?.content || ''}
                        onContentChange={(value) => {
                          setGeneratedContents(prev => {
                            const updated = prev.map(c => 
                              c.type === 'Original Article' 
                                ? { ...c, content: value }
                                : c
                            );
                            if (!updated.find(c => c.type === 'Original Article')) {
                              updated.unshift({ type: 'Original Article', content: value });
                            }
                            return updated;
                          });
                        }}
                        loading={isGenerating}
                        placeholder="Click 'Generate Content' to create social media posts..."
                      />
                    </CardContent>
                  </Card>

                  {generatedContents
                    .filter(content => content.type !== 'Original Article')
                    .map((content, index) => (
                    <Card key={index} className="mt-6 overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-0">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-nextrend-50/50 to-white p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-nextrend-500"></div>
                            <label className="font-medium text-gray-700">{content.type}</label>
                            {content.isGenerating && (
                              <RefreshCw className="w-4 h-4 text-nextrend-500 animate-spin ml-2" />
                            )}
                          </div>
                          {!content.isGenerating && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(content.content)}
                              className="hover:bg-nextrend-100/50"
                            >
                              <Copy className="w-4 h-4 text-gray-600" />
                            </Button>
                          )}
                        </div>
                        <div className="p-6 bg-white">
                          <div className="prose max-w-none">
                            <div className="text-gray-600 text-sm leading-relaxed">
                              {content.isGenerating ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-nextrend-500">Generating {content.type}...</span>
                                </div>
                              ) : (
                                <TypewriterText 
                                  content={content.content} 
                                  speed={15}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
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
                disabled={!generatedContents.length}
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
                    <h2 className="text-lg font-semibold mb-4">Create Custom Content</h2>
                    
                    <div className="flex-1 flex flex-col gap-4">
                      <Textarea
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="resize-none h-32 flex-grow"
                      />
                      
                      <Button 
                        className="h-12 bg-nextrend-500 hover:bg-nextrend-600 w-full flex items-center justify-center"
                        disabled={isGenerating || !userInput?.trim()}
                        onClick={handleSendMessage}
                      >
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </Button>
                      
                      {/* Content prompt section */}
                      {option === 'custom' && (
                        <div className="text-sm p-4 bg-nextrend-50 border border-nextrend-100 rounded-md mt-2">
                          {chatMessages.length > 0 && chatMessages[0].role === 'assistant' && (
                            <div className="mb-4 text-gray-700">
                              {chatMessages[0].content}
                            </div>
                          )}
                          
                          {/* Random content prompt */}
                          <div className="content-prompt">
                            {selectedPrompt && (
                              <>
                                <p className="font-medium text-nextrend-600">
                                  {selectedPrompt.headline}
                                </p>
                                <p className="text-gray-600 italic mt-1">
                                  {selectedPrompt.hook}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Generated Content Cards */}
            {generatedContents.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-6">
                {generatedContents.map((content, index) => (
                  <Card key={index} className="mt-6 overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-0">
                      <div className="border-b border-gray-100 bg-gradient-to-r from-nextrend-50/50 to-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-nextrend-500"></div>
                          <label className="font-medium text-gray-700">{content.type}</label>
                          {content.isGenerating && (
                            <RefreshCw className="w-4 h-4 text-nextrend-500 animate-spin ml-2" />
                          )}
                        </div>
                        {!content.isGenerating && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(content.content)}
                            className="hover:bg-nextrend-100/50"
                          >
                            <Copy className="w-4 h-4 text-gray-600" />
                          </Button>
                        )}
                      </div>
                      <div className="p-6 bg-white">
                        <div className="prose max-w-none">
                          <div className="text-gray-600 text-sm leading-relaxed">
                            {content.isGenerating ? (
                              <div className="flex items-center gap-2">
                                <span className="text-nextrend-500">Generating {content.type}...</span>
                              </div>
                            ) : (
                              <TypewriterText 
                                content={content.content} 
                                speed={15}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
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
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">
              {option === 'this-week' ? 'This Week\'s MBS Commentary' :
               option === 'trending' ? 'Trending Topics' :
               option === 'general' ? 'General Mortgage' :
               'Custom Content'}
            </h1>
          </div>

          {(!isDataLoaded || !isRendered) ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-muted-foreground"
              >
                {option === 'this-week' ? 'Loading MBS Commentary...' : 'Loading content...'}
              </motion.p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <p className="text-lg text-destructive">{error}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
              {tabsContent}
              
              <TabsContent value={activeTab} className="mt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {currentArticles.map((article) => (
                    <div key={article.id}>
                      <Card className="overflow-hidden h-full flex flex-col">
                        <CardContent className="p-0 flex flex-col h-full">
                          <div className="p-5">
                            <div className="flex justify-between items-center mb-3">
                              <Badge variant="outline" className="bg-nextrend-50 text-nextrend-500 hover:bg-nextrend-100">
                                {option === 'trending' ? 'Mortgage' : article.category}
                              </Badge>
                              <span className="text-sm text-gray-500">{article.date}</span>
                            </div>
                            
                            <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                            
                            {option !== 'trending' && (
                              <div className="text-gray-600 text-sm mb-4">
                                {article.content}
                              </div>
                            )}
                            
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
                                onClick={() => handleUseGeneralTerm(article)}
                                className="text-xs w-full"
                              >
                                Use this Mortgage Term
                              </Button>
                            ) : (
                              !article.generatedContent ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleGenerateContent()}
                                  disabled={isGenerating}
                                  className="text-xs w-full"
                                >
                                  Generate Content
                                </Button>
                              ) : (
                                <div className="flex w-full justify-between">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGenerateContent()}
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
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContentEditor;
