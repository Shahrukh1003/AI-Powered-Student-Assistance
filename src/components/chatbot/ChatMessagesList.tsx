import React, { RefObject, useEffect } from 'react';
import ChatMessage from '@/components/ChatMessage';
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatMessagesListProps {
  messages: Message[];
  isTyping: boolean;
  fetchingAnnouncements: boolean;
  audioEnabled: boolean;
  chatContainerRef: RefObject<HTMLDivElement>;
}

const ChatMessagesList: React.FC<ChatMessagesListProps> = ({
  messages,
  isTyping,
  fetchingAnnouncements,
  audioEnabled,
  chatContainerRef
}) => {
  // Log when audio is enabled/disabled for debugging
  useEffect(() => {
    console.log('ChatMessagesList: Audio enabled:', audioEnabled);
  }, [audioEnabled]);
  
  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto glass-cosmic p-6 rounded-2xl mb-4 hide-scrollbar shadow-[0_4px_15px_rgba(0,0,0,0.15)] border border-blue-500/20 backdrop-blur-lg"
    >
      {messages.map((message, index) => (
        <ChatMessage 
          key={message.id} 
          message={message} 
          delay={index * 300}
          audioEnabled={audioEnabled}
        />
      ))}
      
      {/* Enhanced loading indicators */}
      {isTyping && (
        <div className="flex justify-start mb-4">
          <div className="glass-cosmic px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%]">
            {fetchingAnnouncements ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  <span className="text-xs text-blue-300 ml-2">Fetching announcements...</span>
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full bg-blue-500/10" />
                  <Skeleton className="h-3 w-5/6 bg-blue-500/10" />
                  <Skeleton className="h-3 w-4/6 bg-blue-500/10" />
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessagesList;
