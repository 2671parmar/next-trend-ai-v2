
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, FileText, MessageSquare, Send } from 'lucide-react';

interface ContentPrompt {
  headline: string;
  hook: string;
}

// Content prompts for loan officers
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
    headline: "Talk about a time you had to get creative to solve a client's loan problem.",
    hook: "The rules said no, but I found a yes—wait 'til you hear this:"
  },
  {
    headline: "How has your definition of success evolved since you started in this industry?",
    hook: "I used to chase dollars, but now I chase something bigger:"
  },
  {
    headline: "Share a memory of a house you grew up in and how it influences your work today.",
    hook: "That creaky porch taught me more about homes than any textbook:"
  },
  {
    headline: "Describe a time you learned something valuable from a client—what was it?",
    hook: "They flipped the script on me, and I've never been the same since:"
  },
  {
    headline: "Share a time you had to say 'no' to a client and how you turned it into a positive.",
    hook: "I shut the door, but opened a window—here's what happened next:"
  },
  {
    headline: "What's the strangest request a client ever made, and how did you handle it?",
    hook: "They asked for the moon, and I didn't blink—guess what I did:"
  },
  {
    headline: "Reflect on a time you felt like giving up but pushed through—what kept you going?",
    hook: "I was this close to quitting, but then this one thing pulled me back:"
  },
  {
    headline: "Tell the story of a client who reminded you why you love this job.",
    hook: "Their smile at closing was worth every late night—here's why:"
  },
  {
    headline: "How has a family member's advice shaped your approach to your career?",
    hook: "Grandma dropped a truth bomb, and I still use it every day:"
  },
  {
    headline: "Describe a moment you surprised yourself with your own determination.",
    hook: "I didn't know I had it in me until this one deal tested me:"
  },
  {
    headline: "Share a time you helped a client rebuild after a tough financial hit.",
    hook: "They were down and out, but I handed them a lifeline—here's how:"
  },
  {
    headline: "What's the best compliment a client ever gave you, and why did it stick?",
    hook: "Their words hit me like a freight train, and I'll never forget why:"
  },
  {
    headline: "Talk about a time you learned a hard truth about the mortgage industry.",
    hook: "The rose-colored glasses came off, and this is what I saw:"
  },
  {
    headline: "How has a hobby or passion outside work made you a better loan officer?",
    hook: "My weekend obsession turned into my weekday superpower:"
  },
  {
    headline: "Reflect on a time you had to rebuild trust with a client—what did you learn?",
    hook: "I dropped the ball, but picked it up stronger—here's the takeaway:"
  },
  {
    headline: "Share a moment when you felt truly connected to a client's journey.",
    hook: "Their story became mine, and it hit me right here:"
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

// Keep track of which prompts have been displayed
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
  
  // Function to get a random content prompt
  const getRandomContentPrompt = () => {
    if (contentPrompts.length === 0) return null;
    
    // If all prompts have been used, reset the tracking
    if (usedPromptIndexes.size >= contentPrompts.length) {
      usedPromptIndexes.clear();
    }
    
    // Find an index that hasn't been used yet
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * contentPrompts.length);
    } while (usedPromptIndexes.has(randomIndex));
    
    // Mark this index as used
    usedPromptIndexes.add(randomIndex);
    
    return contentPrompts[randomIndex];
  };

  // Set a random content prompt when component mounts or when chatMode changes
  useEffect(() => {
    if (chatMode) {
      setContentPrompt(getRandomContentPrompt());
    }
  }, [chatMode]);

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
        
        <div className="flex flex-col gap-2">
          <div className="relative flex-1">
            <Textarea
              value={userInput}
              onChange={(e) => onUserInputChange && onUserInputChange(e.target.value)}
              placeholder="Type your message here..."
              className="resize-none h-20 pr-12"
            />
            {userInput && userInput.trim().length > 0 && (
              <Button 
                className="absolute bottom-2 right-2 p-2 h-auto w-auto bg-nextrend-500 hover:bg-nextrend-600 rounded-full"
                disabled={loading}
                onClick={onSendMessage}
                type="button"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {contentPrompt && (
            <div className="text-sm p-3 bg-nextrend-50 border border-nextrend-100 rounded-md">
              <p className="font-medium text-nextrend-600">{contentPrompt.headline}</p>
              <p className="text-gray-600 italic mt-1">{contentPrompt.hook}</p>
            </div>
          )}
          
          <Button 
            className="h-12 bg-nextrend-500 hover:bg-nextrend-600"
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
