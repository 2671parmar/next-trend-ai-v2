import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import OpenAI from 'openai';

// Initialize OpenAI with error handling
let openai: OpenAI | null = null;
try {
  openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });
} catch (error) {
  console.error('Error initializing OpenAI:', error);
}

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
        console.error('Error fetching brand voice:', error);
        return;
      }

      if (data) {
        console.log('Fetched brand voice data:', data);
        setSavedContent(data);
        setContent(data.content);
      }
    } catch (error) {
      console.error('Error in fetchBrandVoice:', error);
      setError('Failed to fetch brand voice data');
    }
  };

  const generateSummary = async (text: string): Promise<string> => {
    if (!openai) {
      throw new Error('OpenAI client not initialized');
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{
          role: "system",
          content: "You are a brand voice analyzer. Create a concise summary that captures the essence of the brand's tone and style, similar to: 'Professional, approachable, and client-focused with a conversational tone'"
        }, {
          role: "user",
          content: `Summarize the following text into a concise brand voice description (200 words or less) that will be used in a different prompt to generate content: ${text}`
        }],
        temperature: 0.5,
        max_tokens: 150
      });

      const summary = response.choices[0].message.content;
      if (!summary) {
        throw new Error('Failed to generate summary');
      }
      console.log('Generated summary:', summary);
      return summary;
    } catch (error) {
      console.error('Error in generateSummary:', error);
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
      console.log('Generating summary for content...');
      const summary = await generateSummary(content);

      if (!summary) {
        throw new Error('Failed to generate summary');
      }

      console.log('Saving to Supabase...', {
        user_id: user.id,
        content: content,
        summary: summary
      });

      const { data, error } = await supabase
        .from('brand_voice')
        .upsert({
          user_id: user.id,
          content: content,
          summary: summary,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id' // Update the row where user_id conflicts
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Save successful:', data);
      setSavedContent({ content, summary });
      toast.success('Content and summary saved successfully');
      
      // Refresh the data
      fetchBrandVoice();
    } catch (error: any) {
      console.error('Error in handleSave:', error);
      setError(error.message || 'Failed to save content');
      toast.error(error.message || 'Failed to save content');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while auth is initializing
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

  // Show error state if there's an error
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

              {savedContent && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Brand Voice Summary</h3>
                  <p className="text-gray-600">{savedContent.summary}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}