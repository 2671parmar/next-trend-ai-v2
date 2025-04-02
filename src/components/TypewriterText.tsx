import React, { useState, useEffect } from 'react';

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
    <div className="whitespace-pre-wrap">
      {displayedContent}
      {!isComplete && (
        <span className="inline-block w-2 h-4 ml-1 bg-nextrend-500 animate-pulse" />
      )}
    </div>
  );
};

export default TypewriterText; 