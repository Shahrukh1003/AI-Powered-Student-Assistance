
import React from 'react';
import CosmicBackground from '@/components/chatbot/CosmicBackground';
import ChatMessagesList from '@/components/chatbot/ChatMessagesList';
import ChatInput from '@/components/chatbot/ChatInput';
import VoiceAssistant from '@/components/VoiceAssistant';
import { useChatState } from '@/hooks/useChatState';

const Chatbot = () => {
  const {
    messages,
    inputValue,
    setInputValue,
    isListening,
    isTyping,
    selectedLanguage,
    showVoiceAssistant,
    audioEnabled,
    fetchingAnnouncements,
    chatContainerRef,
    inputRef,
    handleSendMessage,
    handleInputKeyDown,
    toggleListening,
    handleVoiceAssistantClose,
    translateText,
    toggleAudio
  } = useChatState();

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 relative">
      {/* Cosmic Background */}
      <CosmicBackground />
      
      <div className="w-full max-w-4xl flex flex-col h-[calc(100vh-8rem)] opacity-0 animate-fade-in z-10">
        {/* Chat Container */}
        <ChatMessagesList
          messages={messages}
          isTyping={isTyping}
          fetchingAnnouncements={fetchingAnnouncements}
          audioEnabled={audioEnabled}
          chatContainerRef={chatContainerRef}
        />

        {/* Input Area */}
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleInputKeyDown={handleInputKeyDown}
          toggleListening={toggleListening}
          toggleAudio={toggleAudio}
          translateText={translateText}
          isListening={isListening}
          audioEnabled={audioEnabled}
          selectedLanguage={selectedLanguage}
          inputRef={inputRef}
        />
      </div>

      {/* Voice Assistant Modal (Full-Screen Overlay) */}
      {showVoiceAssistant && (
        <VoiceAssistant 
          isListening={isListening} 
          onClose={handleVoiceAssistantClose} 
        />
      )}
    </div>
  );
};

export default Chatbot;
