import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export default function BrandVoice() {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [savedContent, setSavedContent] = useState<{ content: string; summary: string } | null>(null);
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      fetchBrandVoice();
    }
  }, [loading, user]);

  const fetchBrandVoice = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('brand_voice')
        .select('content, summary')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        return;
      }

      if (data) {
        setSavedContent(data);
        setContent(data.content);
      }
    } catch (error) {
      setError('Failed to fetch brand voice data');
    }
  };

  const generateSummary = async (text: string): Promise<string> => {
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: 150,
          messages: [{
            role: 'user',
            content: `Summarize this brand voice description in 250 words or less, maintaining the key personality traits and tone:\n\n${text}`
          }],
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      if (!data.content) {
        throw new Error('Invalid response format');
      }

      // Extract the text content from the response
      const responseText = data.content[0]?.text || data.content;
      if (!responseText) {
        throw new Error('No content found in response');
      }

      return responseText;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error('Please log in to save your brand voice');
      return;
    }

    if (!content.trim()) {
      toast.error('Please enter some content');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const summary = await generateSummary(content);

      if (!summary) {
        throw new Error('Failed to generate summary');
      }

      const { data, error } = await supabase
        .from('brand_voice')
        .upsert({
          user_id: user.id,
          content: content,
          summary: summary,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setSavedContent({ content, summary });
      toast.success('Content and summary saved successfully. Brand voice summary generated.');
      
      fetchBrandVoice();
    } catch (error: any) {
      setError(error.message || 'Failed to save content');
      toast.error(error.message || 'Failed to save content');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navbar />
        <main className="container mx-auto px-4 pt-24">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <Navbar />
        <main className="container mx-auto px-4 pt-24">
          <div className="text-red-600">Error: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar />
      <main className="container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-2">Brand Voice</h1>
        <p className="text-gray-600 mb-8">
          Enter your brand's content to define your brand voice. 
          This helps us generate content that matches your style.
        </p>

        <div className="grid grid-cols-1 gap-8">
          <Card>
            <CardContent className="space-y-6 pt-6">
              <Textarea
                placeholder="Enter your brand's content here..."
                className="min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              
              <Button 
                className="w-full"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>

              {savedContent && savedContent.content && savedContent.summary && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Brand Voice Status</h3>
                  <p className="text-gray-600">Brand voice summary exists.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}