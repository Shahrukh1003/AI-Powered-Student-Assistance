import React, { useState, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speak, stopSpeaking } from '@/utils/textToSpeech';

interface ChatMessageControlsProps {
  message: string;
  isUserMessage?: boolean;
  className?: string;
}

const ChatMessageControls: React.FC<ChatMessageControlsProps> = ({
  message,
  isUserMessage = false,
  className = ''
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Only show TTS controls for bot messages
  if (isUserMessage) {
    return null;
  }
  
  const handleSpeak = useCallback(async () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      try {
        await speak(message);
      } finally {
        setIsSpeaking(false);
      }
    }
  }, [message, isSpeaking]);
  
  return (
    <div className={`flex items-center ${className}`}>
      <button
        onClick={handleSpeak}
        className={`p-2 rounded-full transition-colors ${
          isSpeaking 
            ? 'text-blue-400 hover:text-blue-300' 
            : 'text-gray-400 hover:text-gray-300'
        }`}
        aria-label={isSpeaking ? "Stop speaking" : "Speak message"}
      >
        {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </div>
  );
};

export default ChatMessageControls;
