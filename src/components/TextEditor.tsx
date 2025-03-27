
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw } from 'lucide-react';

interface TextEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  onRegenerateClick?: () => void;
  loading?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  content,
  onContentChange,
  onRegenerateClick,
  loading = false,
  label = 'Content',
  placeholder = 'Start typing or edit the generated content...',
  className = '',
}) => {
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
