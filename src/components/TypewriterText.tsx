import React, { useState, useEffect, useRef } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onType?: () => void;
  onComplete?: () => void;
}

export default function TypewriterText({ text, speed = 12, onType, onComplete }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const currentIndexRef = useRef(0);
  const textRef = useRef(text);
  const onTypeRef = useRef(onType);
  const onCompleteRef = useRef(onComplete);

  // Maintain updated references to avoid triggering effect resets on function reference changes
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    onTypeRef.current = onType;
  }, [onType]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setDisplayedText("");
    currentIndexRef.current = 0;

    const intervalId = setInterval(() => {
      if (currentIndexRef.current < textRef.current.length) {
        // For longer messages, increment by small chunks (2-3 characters) to avoid dragging out the visual effect
        const increment = textRef.current.length > 400 ? 3 : 1;
        const nextChars = textRef.current.substring(
          currentIndexRef.current,
          currentIndexRef.current + increment
        );
        setDisplayedText((prev) => prev + nextChars);
        currentIndexRef.current += increment;
        
        if (onTypeRef.current) {
          onTypeRef.current();
        }
      } else {
        clearInterval(intervalId);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, speed);

    return () => {
      clearInterval(intervalId);
    };
  }, [text, speed]);

  // Click on the bubble to skip typewriter effect and reveal full text instantly
  const handleSkip = (e: React.MouseEvent) => {
    // Avoid interrupting double-clicks or selection, but allow a single click to reveal all
    if (currentIndexRef.current < text.length) {
      e.stopPropagation();
      setDisplayedText(text);
      currentIndexRef.current = text.length;
      if (onTypeRef.current) onTypeRef.current();
      if (onCompleteRef.current) onCompleteRef.current();
    }
  };

  return (
    <div 
      onClick={handleSkip} 
      className="cursor-pointer select-text relative"
      title={currentIndexRef.current < text.length ? "Click to instantly reveal response" : undefined}
    >
      <p className="whitespace-pre-wrap leading-relaxed inline">{displayedText}</p>
      {displayedText.length < text.length && (
        <span className="inline-block w-1.5 h-3.5 ml-1 bg-indigo-400 dark:bg-indigo-300 animate-pulse align-middle" />
      )}
    </div>
  );
}
