import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface TypewriterTextProps {
  content: string;
  onComplete?: () => void;
  speed?: number;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  content, 
  onComplete, 
  speed = 10 // Characters per frame
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!content) return;

    let currentIndex = 0;
    setDisplayedContent('');
    setIsComplete(false);

    const interval = setInterval(() => {
      if (currentIndex < content.length) {
        // Add next chunk of characters
        const nextChunk = content.slice(
          currentIndex,
          currentIndex + speed
        );
        setDisplayedContent(prev => prev + nextChunk);
        currentIndex += speed;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, 30); // Adjust timing for smooth animation

    return () => clearInterval(interval);
  }, [content, speed, onComplete]);

  return (
    <div className="prose prose-sm max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-base prose-strong:font-bold">
      <ReactMarkdown>{displayedContent}</ReactMarkdown>
      {!isComplete && (
        <span className="inline-block w-2 h-4 ml-1 bg-nextrend-500 animate-pulse" />
      )}
    </div>
  );
};

export default TypewriterText; 