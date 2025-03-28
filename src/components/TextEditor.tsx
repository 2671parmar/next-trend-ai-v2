import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, FileText, MessageSquare, Send, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentPrompt {
  headline: string;
  hook: string;
}

const contentPrompts: ContentPrompt[] = [
  {
    headline: "Share a time you overcame a financial setback and what it taught you about resilience.",
    hook: "When my wallet hit rock bottom, I never expected this lesson to lift me up:"
  },
  {
    headline: "Describe a moment when a client's gratitude made you proud to be a loan officer.",
    hook: "Their thank-you note still sits on my desk—here's why it means everything:"
  },
  {
    headline: "Reflect on the biggest mistake you made early in your career and how it shaped you.",
    hook: "I bombed so hard my first year, but wait 'til you hear what I learned:"
  },
  {
    headline: "Tell the story of your first big win helping someone secure their dream home.",
    hook: "The keys were in their hands, but the real victory was mine—here's why:"
  },
  {
    headline: "How would your younger self react to the loan officer you've become today?",
    hook: "If 8-year-old me saw this suit and tie, they'd probably ask one thing:"
  },
  {
    headline: "Recall a time you went above and beyond for a client—what drove you to do it?",
    hook: "I stayed up 'til 2 a.m. for them, and I'd do it again—here's why:"
  },
  {
    headline: "Share a lesson you learned from a deal that didn't go as planned.",
    hook: "The deal crashed, but the wisdom I gained was worth more than gold:"
  },
  {
    headline: "What's the most unexpected advice you've given a client that changed their perspective?",
    hook: "They laughed when I said it, but then their jaw dropped—guess what I told them:"
  },
  {
    headline: "Describe a childhood dream and how your career connects to it now.",
    hook: "I wanted to be an astronaut, but here's how I still reached the stars:"
  },
  {
    headline: "Talk about a mentor who influenced your approach to helping people with loans.",
    hook: "He told me one thing I'll never forget—and it changed everything:"
  },
  {
    headline: "Reflect on a time you turned a stressful situation into a win for a client.",
    hook: "The clock was ticking, but I pulled off a miracle—here's how:"
  },
  {
    headline: "What's one thing you wish you'd known when you started in the mortgage industry?",
    hook: "If I could slap a Post-it on rookie me's forehead, it'd say this:"
  },
  {
    headline: "Share a story of how you helped a client achieve something they thought was impossible.",
    hook: "They said 'no way,' but I said 'watch me'—and then this happened:"
  },
  {
    headline: "How has a personal life challenge made you better at understanding clients' needs?",
    hook: "Life threw me a curveball, and it turned me into their secret weapon:"
  },
  {
    headline: "Tell us about a time you took a risk in your career and how it paid off.",
    hook: "I rolled the dice, and the payout was bigger than I ever dreamed:"
  },
  {
    headline: "What's the most rewarding part of being a loan officer that you didn't expect?",
    hook: "I signed up for numbers, but I stayed for this one thing:"
  },
  {
    headline: "Describe a moment when you realized the true impact of your work on someone's life.",
    hook: "Their tears hit me harder than any commission ever could—here's why:"
  },
  {
    headline: "Share a funny or surprising moment from your career that still makes you smile.",
    hook: "I still chuckle when I think about that one wild closing day:"
  },
  {
    headline: "How do you stay motivated when the market gets tough—tell us your secret!",
    hook: "Rates tanked, but I kept my fire—here's my little trick:"
  },
  {
    headline: "Reflect on a time a client's story inspired you to push harder for them.",
    hook: "Their dream was fading, but their words lit a spark in me:"
  },
  {
    headline: "What's a personal goal you've achieved that mirrors the persistence you bring to work?",
    hook: "I crossed that finish line, and it's why I never quit on clients:"
  },
  {
    headline: "Talk about a time you found joy in the chaos of a busy workday.",
    hook: "The phones wouldn't stop, but I smiled anyway—here's why:"
  },
  {
    headline: "Reflect on a time you realized your work was about more than just loans.",
    hook: "It wasn't about the paperwork—it was about this one moment:"
  }
];

interface TextEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onRegenerateClick?: () => void;
  onFileUpload?: (content: string) => void;
  onSendMessage?: () => void;
  loading?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
  chatMode?: boolean;
  userInput?: string;
  onUserInputChange?: (input: string) => void;
  chatMessages?: Array<{ role: string; content: string; timestamp?: Date }>;
}

const usedPromptIndexes: Set<number> = new Set();

const TextEditor: React.FC<TextEditorProps> = ({
  content,
  onContentChange,
  onRegenerateClick,
  onFileUpload,
  onSendMessage,
  loading = false,
  label = 'Content',
  placeholder = 'Start typing or edit the generated content...',
  className = '',
  chatMode = false,
  userInput = '',
  onUserInputChange,
  chatMessages = [],
}) => {
  const [contentPrompt, setContentPrompt] = useState<ContentPrompt | null>(null);
  const { toast } = useToast();
  
  const getRandomContentPrompt = () => {
    if (contentPrompts.length === 0) return null;
    
    if (usedPromptIndexes.size >= contentPrompts.length) {
      usedPromptIndexes.clear();
    }
    
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * contentPrompts.length);
    } while (usedPromptIndexes.has(randomIndex));
    
    usedPromptIndexes.add(randomIndex);
    
    return contentPrompts[randomIndex];
  };

  useEffect(() => {
    if (chatMode) {
      setContentPrompt(getRandomContentPrompt());
    }
  }, [chatMode]);

  const copyHookToInput = () => {
    if (contentPrompt?.hook && onUserInputChange) {
      onUserInputChange(contentPrompt.hook);
      toast({
        title: "Hook copied to input",
        description: "The hook text has been copied to the input field.",
        duration: 2000,
      });
    }
  };

  if (chatMode) {
    return (
      <div className={`w-full ${className} flex flex-col h-full`}>
        {label && (
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {onRegenerateClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerateClick}
                disabled={loading}
                className="text-xs h-8 px-2"
              >
                {loading ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1" />
                )}
                Regenerate
              </Button>
            )}
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-md border border-gray-200 p-3">
          <div className="flex flex-col gap-3">
            {chatMessages.map((msg, index) => (
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
            ))}
            
            {loading && (
              <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[80%] flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <Textarea
            value={userInput}
            onChange={(e) => onUserInputChange && onUserInputChange(e.target.value)}
            placeholder="Type your message here..."
            className="resize-none min-h-[120px] w-full p-4 text-base border-2 border-gray-200 focus:border-nextrend-400 rounded-lg"
          />
          
          <Button 
            className="h-12 bg-nextrend-500 hover:bg-nextrend-600 w-full"
            disabled={loading || !userInput?.trim()}
            onClick={onSendMessage}
          >
            <Send className="h-5 w-5 mr-2" />
            Send Message
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {onRegenerateClick && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerateClick}
              disabled={loading}
              className="text-xs h-8 px-2"
            >
              {loading ? (
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3 mr-1" />
              )}
              Generate Content
            </Button>
          )}
        </div>
      )}
      <Textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] w-full resize-y"
      />
    </div>
  );
};

export default TextEditor;
