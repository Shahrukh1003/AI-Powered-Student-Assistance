import { useState, useRef, useCallback } from 'react';
import { getChatbotResponse } from '@/services/chatbotService';
import { startListening, stopListening } from '@/utils/speechRecognition';
import { stopSpeaking } from '@/utils/textToSpeech';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const useChatState = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hi there! I'm your REVA University Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [fetchingAnnouncements, setFetchingAnnouncements] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Get response from chatbot service
      const response = await getChatbotResponse(text);
      
      // Add bot response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsTyping(false);
    }
  }, []);

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  }, [inputValue, handleSendMessage]);

  const toggleListening = useCallback(() => {
    if (!isListening) {
      // Start listening
      const success = startListening((transcript) => {
        if (transcript.trim()) {
        setInputValue(transcript);
          handleSendMessage(transcript);
        }
            setIsListening(false);
            setShowVoiceAssistant(false);
      });
      
      if (success) {
        setIsListening(true);
        setShowVoiceAssistant(true);
      } else {
        console.error('Failed to start speech recognition');
      }
    } else {
      // Stop listening
      stopListening();
      setIsListening(false);
      setShowVoiceAssistant(false);
    }
  }, [isListening, handleSendMessage]);

  const handleVoiceAssistantClose = useCallback(() => {
    setIsListening(false);
    setShowVoiceAssistant(false);
  }, []);

  const toggleAudio = useCallback(() => {
    if (audioEnabled) {
      // If turning off audio, stop any current speech
      stopSpeaking();
    }
    setAudioEnabled(prev => !prev);
  }, [audioEnabled]);

  const translateText = useCallback((text: string, targetLang: string) => {
    // Implement translation logic here if needed
    return text;
  }, []);

  return {
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
  };
};
