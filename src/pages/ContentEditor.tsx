import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Newspaper, BarChart, FileText, MessageSquare, ArrowLeft, Save, ExternalLink, Send, RefreshCw, Copy, ChevronLeft, ChevronRight, Pencil, Linkedin, Facebook, Twitter, Mail } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TextEditor from '@/components/TextEditor';
import { contentService } from '@/lib/services/contentService';
import { type MBSArticle, type MortgageTerm } from '@/lib/services/contentService';
import TypewriterText from '@/components/TypewriterText';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface ContentPrompt {
  id: number;
  headline: string;
  hook: string;
  category?: string;
  is_active: boolean;
}

const generateNewsFeedData = async (option: string) => {
  try {
    switch (option) {
      case 'this-week':
        const mbsArticles = await contentService.getMBSArticles();
        return mbsArticles.map(article => ({
          id: article.id,
          category: article.category,
          date: new Date(article.date).toISOString().split('T')[0],
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          isGenerating: article.is_generating
        }));
      case 'trending':
        const trendingArticles = await contentService.getTrendingArticles();
        return trendingArticles.map(article => ({
          id: article.id,
          category: article.category || 'Trending',
          date: new Date(article.date).toISOString().split('T')[0],
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          isGenerating: false
        }));
      case 'general':
        const terms = await contentService.getMortgageTerms();
        return terms.map((term, index) => ({
          id: term.id || index + 1,
          category: 'Term',
          date: new Date().toISOString().split('T')[0],
          title: term.term,
          content: term.definition,
          mortgage_relevance: term.mortgage_relevance,
          isGenerating: false
        }));
      default:
        return [];
    }
  } catch (error) {
    throw error;
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

interface GeneratedContent {
  type: string;
  content: string;
  isGenerating?: boolean;
  isEditing?: boolean;
}

const ITEMS_PER_PAGE = 12;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

const ContentEditor: React.FC = () => {
  const { option } = useParams<{ option: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [brandVoice, setBrandVoice] = useState<string | null>(null);
  
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
  const [selectedPrompt, setSelectedPrompt] = useState<ContentPrompt | null>(null);
  const [cache, setCache] = useState<{ [key: string]: { data: any[]; timestamp: number } }>({});
  
  useEffect(() => {
    const fetchBrandVoice = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('brand_voice')
          .select('summary')
          .eq('user_id', user.id)
          .single();

        if (error) {
          return;
        }

        if (data?.summary) {
          setBrandVoice(data.summary);
        }
      } catch (error) {
        setError('Failed to fetch brand voice');
      }
    };

    fetchBrandVoice();
  }, [user]);

  // Fetch content prompts
  useEffect(() => {
    const fetchContentPrompts = async () => {
      try {
        const { data, error } = await supabase
          .from('content_prompts')
          .select('*')
          .eq('is_active', true)
          .order('id');

        if (error) {
          console.error('Error fetching content prompts:', error);
          return;
        }

        if (data && data.length > 0) {
          // Randomly select a prompt
          const randomIndex = Math.floor(Math.random() * data.length);
          setSelectedPrompt(data[randomIndex]);
        }
      } catch (error) {
        console.error('Error in fetchContentPrompts:', error);
      }
    };

    if (option === 'custom') {
      fetchContentPrompts();
    }
  }, [option]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  const loadData = async () => {
    if (!option || !user) {
      setIsLoading(false);
      return;
    }

    const cachedData = cache[option];
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      setNewsFeed(cachedData.data);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const data = await generateNewsFeedData(option);
      setNewsFeed(data);
      setSelectedArticle(null);
      setShowEditor(false);
      setGeneratedContents([]);
      setCache(prev => ({ ...prev, [option]: { data, timestamp: Date.now() } }));
    } catch (error) {
      setError('Failed to load data. Please try again.');
      toast.error('Failed to load content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadData();
  }, [option, user]);
  
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
        { type: 'SMS Broadcast - For Clients', description: 'Concise, CTA-Driven' },
        { type: 'SMS Broadcast - For Realtor Partners', description: 'Concise, Informational, Value Driven' },
        { type: 'Motivational Quote', description: 'Uplifting, Short, Non-Salesy' }
      ];

      setGeneratedContents(contentTypes.map(type => ({
        type: type.type,
        content: '',
        isGenerating: true
      })));

      for (const [index, { type, description }] of contentTypes.entries()) {
        const prompt = `Generate a ${type} (${description}) for this ${articleData.category} article:\n\nTitle: ${articleData.title}\n\nContent: ${articleData.content}`;
        const result = await contentService.generateContent(prompt, brandVoice);
        setGeneratedContents(prev => prev.map((c, i) => i === index ? { ...c, content: result, isGenerating: false } : c));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleReadArticle = (articleId: number) => {
    setNewsFeed(prev => prev.map(article => article.id === articleId ? { ...article, isSelected: true } : article));
  };

  const handleUseArticle = async (articleId: number) => {
    const article = newsFeed.find(item => item.id === articleId);
    if (article) {
      setIsLoading(true);
      try {
        if (option === 'this-week' && article.url) {
          const fullArticle = await contentService.getMBSArticleContent(article.url);
          setSelectedArticle(fullArticle ? { ...article, content: fullArticle.content } : article);
        } else {
          setSelectedArticle(article);
        }
        setShowEditor(true);
        setGeneratedContents([]);
      } catch (error) {
        setError('Failed to fetch article content');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleUseGeneralTerm = async (article: any) => {
    setIsLoading(true);
    try {
      setSelectedArticle({
        ...article,
        content: `${article.title}\n\n${article.content}\n\n${article.mortgage_relevance}`
      });
      setShowEditor(true);
      setGeneratedContents([]);
    } catch (error) {
      setError('Failed to load term content');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    setIsGenerating(true);
    try {
      const customContent = { title: "Custom Content", content: userInput, category: "Custom" };
      const contentTypes = [
        { type: 'LinkedIn Post', description: 'Thought Leadership, Expert Take' },
        { type: 'Blog Post', description: 'Deep-Dive, SEO-Optimized' },
        { type: 'Video Script', description: 'Educational, Senior Loan Officer Perspective' },
        { type: 'Email', description: 'Client-Focused, Trust-Building' },
        { type: 'Social Post', description: 'Engaging & Value-Driven' },
        { type: 'X/Twitter Post', description: 'Quick, Authority Take' },
        { type: 'SMS Broadcast - For Clients', description: 'Concise, CTA-Driven' },
        { type: 'SMS Broadcast - For Realtor Partners', description: 'Concise, Informational, Value Driven' },
        { type: 'Motivational Quote', description: 'Uplifting, Short, Non-Salesy' }
      ];
      
      setGeneratedContents(contentTypes.map(type => ({ type: type.type, content: '', isGenerating: true })));
      
      for (const [index, { type, description }] of contentTypes.entries()) {
        const prompt = `Generate a ${type} (${description}) for this custom content:\n\nContent: ${customContent.content}`;
        const result = await contentService.generateContent(prompt, brandVoice);
        setGeneratedContents(prev => prev.map((c, i) => i === index ? { ...c, content: result, isGenerating: false } : c));
      }

      setChatMessages(prev => [...prev, { role: 'user', content: userInput, timestamp: new Date() }, { role: 'assistant', content: 'Content generated.', timestamp: new Date() }]);
      setUserInput('');
    } catch (err) {
      setError('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    const files = 'dataTransfer' in event ? event.dataTransfer.files : (event.target as HTMLInputElement).files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setChatMessages(prev => [...prev, { role: 'user', content: `Uploaded: ${file.name}`, timestamp: new Date() }]);
        setIsGenerating(true);
        setTimeout(() => {
          setChatMessages(prev => [...prev, { role: 'assistant', content: `Analyzed ${file.name}. Summary: Mortgage info for homebuyers.`, timestamp: new Date() }]);
          setGeneratedContents([{ type: 'LinkedIn Post', content: `Analyzed ${file.name}. Summary: Mortgage info for homebuyers.` }]);
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
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => handleFileUpload(event);
  
  const handleSave = () => navigate('/dashboard');
  
  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch (err) {
      // Silent fail
    }
  };
  
  const handleEditContent = (index: number) => {
    setGeneratedContents(prev => prev.map((c, i) => i === index ? { ...c, isEditing: !c.isEditing } : c));
  };

  const handleContentChange = (index: number, newContent: string) => {
    setGeneratedContents(prev => prev.map((c, i) => i === index ? { ...c, content: newContent } : c));
  };

  const handleShareContent = (type: string, content: string) => {
    const encodedContent = encodeURIComponent(content);
    let shareUrl = '';
    
    switch (type) {
      case 'LinkedIn Post':
        shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedContent}`;
        break;
      case 'Social Post':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodedContent}`;
        break;
      case 'X/Twitter Post':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedContent}`;
        break;
      case 'Email':
        const lines = content.split('\n');
        const subject = encodeURIComponent(lines[0].trim());
        const body = encodeURIComponent(lines.slice(1).join('\n').trim());
        shareUrl = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${subject}&body=${body}`;
        break;
      default:
        return;
    }
    copyToClipboard(content);
    window.open(shareUrl, '_blank');
  };
  
  if (!option || !optionDetails[option as keyof typeof optionDetails]) return <div>Invalid option</div>;
  
  const { title, icon } = optionDetails[option as keyof typeof optionDetails];
  const filteredNews = activeTab === 'all' ? newsFeed : newsFeed.filter(item => item.category.toLowerCase() === activeTab);
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentArticles = filteredNews.slice(startIndex, endIndex);
  
  const SkeletonCard = () => (
    <div className="animate-pulse">
      <Card className="overflow-hidden h-full flex flex-col">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-center mb-3">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
          <div className="mt-auto border-t border-gray-100 p-4 flex justify-between items-center bg-gray-50">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  if (showEditor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-24 pb-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
              <Button variant="ghost" className="flex items-center text-gray-600" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
              <Button variant="default" className="bg-nextrend-500 hover:bg-nextrend-600" onClick={handleSave} disabled={!generatedContents.length}>
                <Save className="w-4 h-4 mr-2" /> Save Content
              </Button>
            </motion.div>
            {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">{error}</div>}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-nextrend-50 text-nextrend-500 flex items-center justify-center mr-3">
                <FileText className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">{selectedArticle?.title}</h1>
            </motion.div>
            <div className="grid grid-cols-1 gap-6">
              {option === 'general' ? (
                <>
                  {selectedArticle && (
                    <Card className="mb-4">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-center mb-3">
                          <Badge variant="outline" className="bg-nextrend-50 text-nextrend-500 hover:bg-nextrend-100">{selectedArticle.category}</Badge>
                          <span className="text-sm text-gray-500">{selectedArticle.date}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{selectedArticle.title}</h3>
                        {selectedArticle.description && (
                          <div className="text-gray-600 text-sm mb-4">{selectedArticle.description}</div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-end mb-4">
                        <Button variant="outline" size="sm" onClick={handleGenerateContent} disabled={isGenerating} className="flex items-center">
                          <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                          {isGenerating ? 'Generating...' : 'Generate Content'}
                        </Button>
                      </div>
                      <TextEditor content={selectedArticle?.content || ''} onContentChange={(value) => {
                        setSelectedArticle(prev => prev ? { ...prev, content: value } : null);
                        setGeneratedContents(prev => {
                          const updated = prev.map(c => c.type === 'Original Article' ? { ...c, content: value } : c);
                          if (!updated.find(c => c.type === 'Original Article')) updated.unshift({ type: 'Original Article', content: value });
                          return updated;
                        });
                      }} loading={isGenerating} placeholder="Click 'Generate Content' to create social media posts..." />
                    </CardContent>
                  </Card>
                  {generatedContents.filter(content => content.type !== 'Original Article').map((content, index) => (
                    <Card key={index} className="mt-6 overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-0">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-nextrend-50/50 to-white p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-nextrend-500"></div>
                            <label className="font-medium text-gray-700">{content.type}</label>
                            {content.isGenerating && <RefreshCw className="w-4 h-4 text-nextrend-500 animate-spin ml-2" />}
                          </div>
                          {!content.isGenerating && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditContent(index)}
                                className="hover:bg-nextrend-100/50"
                              >
                                <Pencil className="w-4 h-4 text-gray-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(content.content)}
                                className="hover:bg-nextrend-100/50"
                              >
                                <Copy className="w-4 h-4 text-gray-600" />
                              </Button>
                              {['LinkedIn Post', 'Social Post', 'X/Twitter Post', 'Email'].includes(content.type) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleShareContent(content.type, content.content)}
                                  className="hover:bg-nextrend-100/50"
                                >
                                  {content.type === 'LinkedIn Post' && <Linkedin className="w-4 h-4 text-[#0077B5]" />}
                                  {content.type === 'Social Post' && <Facebook className="w-4 h-4 text-[#1877F2]" />}
                                  {content.type === 'X/Twitter Post' && <Twitter className="w-4 h-4 text-[#1DA1F2]" />}
                                  {content.type === 'Email' && <Mail className="w-4 h-4 text-gray-600" />}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="p-6 bg-white">
                          <div className="prose max-w-none">
                            <div className="text-gray-600 text-sm leading-relaxed">
                              {content.isGenerating ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-nextrend-500">Generating {content.type}...</span>
                                </div>
                              ) : content.isEditing ? (
                                <Textarea
                                  value={content.content}
                                  onChange={(e) => handleContentChange(index, e.target.value)}
                                  className="min-h-[200px] w-full"
                                />
                              ) : (
                                <TypewriterText content={content.content} speed={15} />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  {selectedArticle && (
                    <Card className="mb-4">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-center mb-3">
                          <Badge variant="outline" className="bg-nextrend-50 text-nextrend-500 hover:bg-nextrend-100">{selectedArticle.category}</Badge>
                          <span className="text-sm text-gray-500">{selectedArticle.date}</span>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">{selectedArticle.title}</h3>
                        {selectedArticle.description && (
                          <div className="text-gray-600 text-sm mb-4">{selectedArticle.description}</div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-end mb-4">
                        <Button variant="outline" size="sm" onClick={handleGenerateContent} disabled={isGenerating} className="flex items-center">
                          <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                          {isGenerating ? 'Generating...' : 'Generate Content'}
                        </Button>
                      </div>
                      <TextEditor content={selectedArticle?.content || ''} onContentChange={(value) => {
                        setSelectedArticle(prev => prev ? { ...prev, content: value } : null);
                        setGeneratedContents(prev => {
                          const updated = prev.map(c => c.type === 'Original Article' ? { ...c, content: value } : c);
                          if (!updated.find(c => c.type === 'Original Article')) updated.unshift({ type: 'Original Article', content: value });
                          return updated;
                        });
                      }} loading={isGenerating} placeholder="Click 'Generate Content' to create social media posts..." />
                    </CardContent>
                  </Card>
                  {generatedContents.filter(content => content.type !== 'Original Article').map((content, index) => (
                    <Card key={index} className="mt-6 overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-0">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-nextrend-50/50 to-white p-4 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-nextrend-500"></div>
                            <label className="font-medium text-gray-700">{content.type}</label>
                            {content.isGenerating && <RefreshCw className="w-4 h-4 text-nextrend-500 animate-spin ml-2" />}
                          </div>
                          {!content.isGenerating && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditContent(index)}
                                className="hover:bg-nextrend-100/50"
                              >
                                <Pencil className="w-4 h-4 text-gray-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(content.content)}
                                className="hover:bg-nextrend-100/50"
                              >
                                <Copy className="w-4 h-4 text-gray-600" />
                              </Button>
                              {['LinkedIn Post', 'Social Post', 'X/Twitter Post', 'Email'].includes(content.type) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleShareContent(content.type, content.content)}
                                  className="hover:bg-nextrend-100/50"
                                >
                                  {content.type === 'LinkedIn Post' && <Linkedin className="w-4 h-4 text-[#0077B5]" />}
                                  {content.type === 'Social Post' && <Facebook className="w-4 h-4 text-[#1877F2]" />}
                                  {content.type === 'X/Twitter Post' && <Twitter className="w-4 h-4 text-[#1DA1F2]" />}
                                  {content.type === 'Email' && <Mail className="w-4 h-4 text-gray-600" />}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="p-6 bg-white">
                          <div className="prose max-w-none">
                            <div className="text-gray-600 text-sm leading-relaxed">
                              {content.isGenerating ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-nextrend-500">Generating {content.type}...</span>
                                </div>
                              ) : content.isEditing ? (
                                <Textarea
                                  value={content.content}
                                  onChange={(e) => handleContentChange(index, e.target.value)}
                                  className="min-h-[200px] w-full"
                                />
                              ) : (
                                <TypewriterText content={content.content} speed={15} />
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
              <Button variant="ghost" className="flex items-center text-gray-600" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
              </Button>
              <Button variant="default" className="bg-nextrend-500 hover:bg-nextrend-600" onClick={handleSave} disabled={!generatedContents.length}>
                <Save className="w-4 h-4 mr-2" /> Save Content
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-nextrend-50 text-nextrend-500 flex items-center justify-center mr-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold">Your Custom Content</h1>
            </motion.div>
            <div className="grid grid-cols-1 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-6 h-full flex flex-col">
                    <h2 className="text-lg font-semibold mb-4">Create Custom Content</h2>
                    <div className="flex-1 flex flex-col gap-4">
                      <Textarea 
                        value={userInput || (selectedPrompt?.headline || '')} 
                        onChange={(e) => setUserInput(e.target.value)} 
                        placeholder="Type your message here..." 
                        className="resize-none flex-grow min-h-[300px] text-lg" 
                      />
                      <Button 
                        className="h-12 bg-nextrend-500 hover:bg-nextrend-600 w-full flex items-center justify-center" 
                        disabled={isGenerating || !userInput?.trim()} 
                        onClick={handleSendMessage}
                      >
                        <Send className="h-5 w-5 mr-2" /> Send Message
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            {generatedContents.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-6">
                {generatedContents.map((content, index) => (
                  <Card key={index} className="mt-6 overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <CardContent className="p-0">
                      <div className="border-b border-gray-100 bg-gradient-to-r from-nextrend-50/50 to-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-nextrend-500"></div>
                          <label className="font-medium text-gray-700">{content.type}</label>
                          {content.isGenerating && <RefreshCw className="w-4 h-4 text-nextrend-500 animate-spin ml-2" />}
                        </div>
                        {!content.isGenerating && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditContent(index)}
                              className="hover:bg-nextrend-100/50"
                            >
                              <Pencil className="w-4 h-4 text-gray-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(content.content)}
                              className="hover:bg-nextrend-100/50"
                            >
                              <Copy className="w-4 h-4 text-gray-600" />
                            </Button>
                            {['LinkedIn Post', 'Social Post', 'X/Twitter Post', 'Email'].includes(content.type) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleShareContent(content.type, content.content)}
                                className="hover:bg-nextrend-100/50"
                              >
                                {content.type === 'LinkedIn Post' && <Linkedin className="w-4 h-4 text-[#0077B5]" />}
                                {content.type === 'Social Post' && <Facebook className="w-4 h-4 text-[#1877F2]" />}
                                {content.type === 'X/Twitter Post' && <Twitter className="w-4 h-4 text-[#1DA1F2]" />}
                                {content.type === 'Email' && <Mail className="w-4 h-4 text-gray-600" />}
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="p-6 bg-white">
                        <div className="prose max-w-none">
                          <div className="text-gray-600 text-sm leading-relaxed">
                            {content.isGenerating ? (
                              <div className="flex items-center gap-2">
                                <span className="text-nextrend-500">Generating {content.type}...</span>
                              </div>
                            ) : content.isEditing ? (
                              <Textarea
                                value={content.content}
                                onChange={(e) => handleContentChange(index, e.target.value)}
                                className="min-h-[200px] w-full"
                              />
                            ) : (
                              <TypewriterText content={content.content} speed={15} />
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            <div className="text-sm p-4 bg-nextrend-50 border border-nextrend-100 rounded-md mt-2">
              {chatMessages.length > 0 && chatMessages[0].role === 'assistant' && (
                <div className="mb-4 text-gray-700">
                  {chatMessages[0].content}
                </div>
              )}
              
              <div className="content-prompt">
                {selectedPrompt && (
                  <>
                    <p className="text-gray-600 italic mt-1">
                      {selectedPrompt.hook}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  const tabsContent = option === 'general' 
    ? <TabsList className="mb-6"><TabsTrigger value="all">All Terms</TabsTrigger></TabsList>
    : option === 'this-week'
    ? <TabsList className="mb-6"><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="daily">Daily</TabsTrigger><TabsTrigger value="weekly">Weekly</TabsTrigger><TabsTrigger value="monthly">Monthly</TabsTrigger></TabsList>
    : <TabsList className="mb-6"><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="trending">Trending</TabsTrigger><TabsTrigger value="mortgage">Mortgage</TabsTrigger><TabsTrigger value="housing">Housing</TabsTrigger><TabsTrigger value="economy">Economy</TabsTrigger></TabsList>;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">
              {option === 'this-week' ? 'This Week\'s MBS Commentary' : option === 'trending' ? 'Trending Topics' : option === 'general' ? 'General Mortgage' : 'Custom Content'}
            </h1>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[...Array(ITEMS_PER_PAGE)].map((_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
              <p className="text-lg text-destructive">{error}</p>
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" /> Try Again
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
                              <Badge variant="outline" className="bg-nextrend-50 text-nextrend-500 hover:bg-nextrend-100">{article.category}</Badge>
                              <span className="text-sm text-gray-500">{article.date}</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                            {(option === 'this-week' || option === 'trending') && article.description && (
                              <div className="text-gray-600 text-sm mb-4">{article.description}</div>
                            )}
                          </div>
                          <div className="mt-auto border-t border-gray-100 p-4 flex justify-between items-center bg-gray-50">
                            {(option === 'this-week' || option === 'trending') ? (
                              <div className="flex w-full gap-2">
                                {/* <Button variant="outline" size="sm" onClick={() => handleReadArticle(article.id)} className="text-xs flex-1">
                                  <ExternalLink className="h-3 w-3 mr-1" /> Read Article
                                </Button> */}
                                <Button variant="default" size="sm" onClick={() => handleUseArticle(article.id)} className="text-xs flex-1 bg-nextrend-500 hover:bg-nextrend-600" disabled={isLoading}>
                                  Use Article
                                </Button>
                              </div>
                            ) : option === 'general' ? (
                              <Button variant="default" size="sm" onClick={() => handleUseGeneralTerm(article)} className="text-xs flex-1 bg-nextrend-500 hover:bg-nextrend-600" disabled={isLoading}>
                                Use this Mortgage Term
                              </Button>
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                  <Button variant="outline" size="icon" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages}>
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