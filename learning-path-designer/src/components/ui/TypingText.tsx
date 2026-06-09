import React, { useState, useEffect, useRef } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export default function TypingText({ text, speed = 20, onComplete, className = '' }: TypingTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [cursor, setCursor] = useState(true);
  const indexRef = useRef(0);
  const completed = useRef(false);

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;
    completed.current = false;

    const lines = text.split('\n');
    const flatChars: string[] = [];
    lines.forEach((line, i) => {
      for (const ch of line) flatChars.push(ch);
      if (i < lines.length - 1) flatChars.push('\n');
    });

    const timer = setInterval(() => {
      if (indexRef.current < flatChars.length) {
        setDisplayed(prev => prev + flatChars[indexRef.current]);
        indexRef.current++;
      } else {
        clearInterval(timer);
        if (!completed.current) {
          completed.current = true;
          onComplete?.();
        }
      }
    }, speed);

    const cursorTimer = setInterval(() => setCursor(c => !c), 500);

    return () => {
      clearInterval(timer);
      clearInterval(cursorTimer);
    };
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {indexRef.current < text.length && (
        <span className={`inline-block w-0.5 h-4 bg-brand ml-0.5 align-middle ${cursor ? 'opacity-100' : 'opacity-0'}`} />
      )}
    </span>
  );
}
