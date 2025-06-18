import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speak, stopSpeaking, isSpeaking as checkIsSpeaking } from '@/utils/textToSpeech';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
  };
  delay?: number;
  audioEnabled?: boolean;
}

const ChatMessage = ({ message, delay = 0, audioEnabled = true }: ChatMessageProps) => {
  const [visible, setVisible] = useState(false);
  const [animateText, setAnimateText] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const speechCheckInterval = useRef<number | null>(null);
  const messageId = useRef<string>(message.id);
  const hasSpokenRef = useRef<boolean>(false);
  
  // Reset hasSpoken when message changes
  useEffect(() => {
    hasSpokenRef.current = false;
    messageId.current = message.id;
  }, [message.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      // Add a small delay before starting text animation
      setTimeout(() => {
        setAnimateText(true);
      }, 100);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // Check if speech is currently playing for this message
  useEffect(() => {
    const checkSpeechStatus = () => {
      const isSpeakingNow = checkIsSpeaking();
      setIsSpeaking(isSpeakingNow);
    };
    
    // Set up an interval to check speech status
    speechCheckInterval.current = window.setInterval(checkSpeechStatus, 300);
    
    return () => {
      if (speechCheckInterval.current !== null) {
        window.clearInterval(speechCheckInterval.current);
      }
    };
  }, []);

  // Automatically speak bot messages
  useEffect(() => {
    const autoSpeak = async () => {
      // Only speak if:
      // 1. Message is visible
      // 2. It's a bot message
      // 3. We haven't spoken it yet
      // 4. Speech is enabled
      if (visible && message.sender === 'bot' && !hasSpokenRef.current && audioEnabled) {
        try {
          console.log('Auto speaking message:', message.id);
          setIsSpeaking(true);
          hasSpokenRef.current = true;
          
          // Enhanced text-to-speech configuration based on message content
          const isAnnouncement = message.text.includes('latest announcements') || 
                               message.text.includes('Here are the latest announcements') ||
                               message.text.includes('📢 Here are the latest announcements');
                               
          const isError = message.text.includes('couldn\'t retrieve') || 
                        message.text.includes('error') || 
                        message.text.includes('sorry');
          
          // Choose voice parameters based on message type
          let speechRate = 1.0;
          let speechPitch = 1.1;
          
          if (isAnnouncement) {
            // Slower and more authoritative for announcements
            speechRate = 0.9;
            speechPitch = 1.05;
          } else if (isError) {
            // Slightly lower pitch for error messages to sound more sympathetic
            speechRate = 0.95;
            speechPitch = 0.95;
          }
          
          await speak(message.text, { 
            rate: speechRate,
            pitch: speechPitch
          });
          // The interval will handle setting isSpeaking to false
        } catch (error) {
          console.error('Failed to speak message:', error);
          setIsSpeaking(false);
        }
      }
    };

    // Small delay before speaking to ensure smooth UI animation
    const speakTimer = setTimeout(() => {
      autoSpeak();
    }, 300);

    return () => {
      clearTimeout(speakTimer);
    };
  }, [visible, message, audioEnabled]);

  const toggleSpeech = async () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      try {
        setIsSpeaking(true);
        await speak(message.text, {
          rate: 1.0,
          pitch: 1.1
        });
        // The interval will set isSpeaking to false when speech finishes
      } catch (error) {
        console.error('Speech error:', error);
        setIsSpeaking(false);
      }
    }
  };

  if (!visible) return null;

  // Detect different message types for enhanced styling
  const isAnnouncementMessage = message.text.includes('Here are the latest announcements') || 
                              message.text.includes('📢 Here are the latest announcements');
  const isErrorMessage = message.text.includes('couldn\'t retrieve') || 
                       message.text.includes('error') || 
                       message.text.includes('sorry');

  return (
    <div 
      ref={messageRef}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4 opacity-0 animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div 
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          message.sender === 'user' 
            ? 'bg-reva-blue/80 text-white rounded-tr-none shadow-[0_2px_10px_rgba(0,100,255,0.15)]' 
            : isErrorMessage
              ? 'glass-cosmic-error rounded-tl-none shadow-[0_2px_10px_rgba(255,100,100,0.15)]'
              : isAnnouncementMessage
                ? 'glass-cosmic-announcement rounded-tl-none shadow-[0_2px_10px_rgba(100,200,255,0.2)]'
                : 'glass-cosmic rounded-tl-none shadow-[0_2px_10px_rgba(51,170,255,0.1)]'
        } transition-all duration-300 hover:shadow-[0_4px_15px_rgba(51,170,255,0.2)] hover:scale-[1.01] relative`}
      >
        <div className={`text-sm ${animateText ? 'animate-fade-in' : 'opacity-0'} ${
          message.sender === 'user' 
            ? 'text-white' 
            : isErrorMessage
              ? 'text-red-100 dark:text-red-100 light:text-red-100'
              : 'text-white dark:text-white light:text-white'
        } ${isAnnouncementMessage ? 'whitespace-pre-line' : ''}`}>
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-2 mb-1" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-base font-semibold mt-2 mb-1" {...props} />,
              p: ({node, ...props}) => <p className="mb-1" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-1 pl-4" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-1 pl-4" {...props} />,
              li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
              strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
              em: ({node, ...props}) => <em className="italic" {...props} />,
              code: ({node, ...props}) => <code className="bg-gray-700 text-white rounded px-1 py-0.5 text-xs" {...props} />,
              pre: ({node, ...props}) => <pre className="bg-gray-800 text-white rounded p-2 text-xs overflow-auto" {...props} />,
            }}
          >{message.text}</ReactMarkdown>
        </div>
        <div className="flex justify-between items-center mt-1">
          <p className={`text-xs opacity-70 text-left ${
            message.sender === 'user'
              ? 'text-white/70'
              : isErrorMessage
                ? 'text-red-200/70 dark:text-red-200/70 light:text-red-200/70'
                : 'text-white/70 dark:text-white/70 light:text-white/70'
          }`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>

          {message.sender === 'bot' && (
            <button 
              onClick={toggleSpeech}
              className={`ml-2 p-1 rounded-full ${
                isSpeaking 
                  ? isErrorMessage
                    ? 'text-red-300 dark:text-red-300 light:text-red-300'
                    : 'text-blue-300 dark:text-blue-300 light:text-blue-300' 
                  : isErrorMessage
                    ? 'text-red-400/60 dark:text-red-400/60 light:text-red-400/60'
                    : 'text-blue-400/60 dark:text-blue-400/60 light:text-blue-400/60'
              } hover:text-blue-300 dark:hover:text-blue-300 light:hover:text-blue-300 transition-colors`}
              aria-label={isSpeaking ? "Stop speaking" : "Play message"}
            >
              {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
