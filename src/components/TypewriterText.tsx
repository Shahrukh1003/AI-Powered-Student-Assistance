
import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  loop?: boolean;
}

const TypewriterText = ({ 
  text, 
  delay = 100, 
  className = "", 
  onComplete,
  loop = false
}: TypewriterTextProps) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        if (loop) {
          setIsDeleting(true);
        }
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (currentText === "") {
        setIsDeleting(false);
        setCurrentIndex(0);
        return;
      }

      timeout = setTimeout(() => {
        setCurrentText(prev => prev.slice(0, -1));
      }, delay / 2);
    } else {
      if (currentIndex === text.length) {
        if (onComplete) onComplete();
        if (loop) {
          setIsPaused(true);
        }
        return;
      }

      timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, currentText, delay, isDeleting, isPaused, loop, onComplete, text]);

  return (
    <span className={`${className}`}>
      {currentText}
      <span className="border-r-2 border-reva-blue animate-blink ml-1"></span>
    </span>
  );
};

export default TypewriterText;
