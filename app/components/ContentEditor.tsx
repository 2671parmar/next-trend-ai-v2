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
import { type MBSArticle, TrendingArticle, GeneralTerm } from '@/lib/services/contentService';
import TypewriterText from '@/components/TypewriterText';

const mortgageTerms = [
  // ... existing mortgage terms array ...
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
  
  // ... rest of the generateNewsFeedData function ...
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
        } catch (error) {
          console.error('Error loading data:', error);
          setError('Failed to load data. Please try again.');
        } finally {
          setIsDataLoaded(true);
          requestAnimationFrame(() => {
            setIsRendered(true);
            setIsLoading(false);
          });
        }
      };
      loadData();
    }
  }, [option]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

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

      setGeneratedContents(contentTypes.map(type => ({
        type: type.type,
        content: '',
        isGenerating: true
      })));

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
    const article = newsFeed.find(item => item.id === articleId);
    if (article?.url) {
      window.open(article.url, '_blank');
    }
  };

  const handleUseArticle = async (articleId: number) => {
    const article = newsFeed.find(item => item.id === articleId);
    if (article) {
      try {
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

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const filteredNews = activeTab === 'all' ? newsFeed : newsFeed.filter(item => item.category.toLowerCase() === activeTab);
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = filteredNews.slice(startIndex, endIndex);

  if (showEditor) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <main className="pt-16 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="ghost" 
                className="flex items-center text-gray-600"
                onClick={() => setShowEditor(false)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {optionDetails[option as keyof typeof optionDetails]?.title}
              </Button>

              <Button 
                variant="default" 
                className="bg-green-500 hover:bg-green-600"
                onClick={() => navigate('/dashboard')}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Content
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">
                {error}
              </div>
            )}
            
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center mr-3">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">
                {selectedArticle?.title}
              </h1>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {selectedArticle && (
                <Card className="mb-4">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="outline" className="bg-gray-100">
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
                <Card key={index} className="mt-6">
                  <CardContent className="p-0">
                    <div className="border-b border-gray-100 bg-gray-50 p-4 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <label className="font-medium text-gray-700">{content.type}</label>
                        {content.isGenerating && (
                          <RefreshCw className="w-4 h-4 text-green-500 animate-spin ml-2" />
                        )}
                      </div>
                      {!content.isGenerating && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(content.content)}
                          className="hover:bg-gray-100"
                        >
                          <Copy className="w-4 h-4 text-gray-600" />
                        </Button>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="prose max-w-none">
                        <div className="text-gray-600 text-sm leading-relaxed">
                          {content.isGenerating ? (
                            <div className="flex items-center gap-2">
                              <span className="text-green-500">Generating {content.type}...</span>
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
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-16 pb-16 px-6">
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
            <h1 className="text-2xl font-bold">{optionDetails[option as keyof typeof optionDetails]?.title}</h1>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-lg text-gray-600">
                {option === 'this-week' ? 'Loading MBS Commentary...' : 'Loading content...'}
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <p className="text-lg text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
                <TabsTrigger value="housing">Housing</TabsTrigger>
                <TabsTrigger value="economy">Economy</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentArticles.map((article) => (
                    <Card key={article.id} className="overflow-hidden">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-center mb-3">
                          <Badge variant="outline" className="bg-gray-100">
                            {article.category}
                          </Badge>
                          <span className="text-sm text-gray-500">{article.date}</span>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                        
                        <div className="text-gray-600 text-sm mb-4">
                          {article.content}
                        </div>
                        
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReadArticle(article.id)}
                            className="flex-1"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Read Article
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUseArticle(article.id)}
                            className="flex-1 bg-green-500 hover:bg-green-600"
                          >
                            Use Article
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
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
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContentEditor; 