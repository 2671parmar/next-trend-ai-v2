
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, FileText, MessageSquare, Send } from 'lucide-react';

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
  if (chatMode && chatMessages.length > 0) {
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
        
        <div className="flex gap-2">
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
          <Button 
            className="h-20 bg-nextrend-500 hover:bg-nextrend-600"
            disabled={loading || !userInput?.trim()}
            onClick={onSendMessage}
          >
            <Send className="h-5 w-5" />
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
              Regenerate
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
