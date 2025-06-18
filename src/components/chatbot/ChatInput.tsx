import React, { useRef, useState } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSendMessage: () => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  toggleListening: () => void;
  toggleAudio: () => void;
  isListening: boolean;
  audioEnabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  handleSendMessage,
  handleInputKeyDown,
  toggleListening,
  toggleAudio,
  isListening,
  audioEnabled,
  inputRef
}) => {
  return (
    <div className="glass-cosmic-dark p-4 rounded-2xl relative shadow-[0_4px_15px_rgba(0,0,0,0.2)] border border-blue-500/30 backdrop-blur-lg">
      <div className="flex items-center">
        <button 
          onClick={toggleListening}
          className={`btn-icon mr-2 transition-all duration-300 border ${isListening ? 'border-red-400/50 text-red-400 bg-black/40 shadow-glow-red' : 'border-blue-400/30 text-blue-300 hover:border-blue-400/60 hover:bg-black/30'} rounded-full p-2`}
          aria-label={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
        </button>
        
        <button 
          onClick={toggleAudio}
          className={`btn-icon mr-2 transition-all duration-300 border ${audioEnabled ? 'border-blue-400/50 text-blue-300 bg-black/20' : 'border-blue-400/30 text-blue-400/60 hover:border-blue-400/60'} rounded-full p-2 hover:bg-black/30`}
          aria-label={audioEnabled ? "Turn off voice responses" : "Turn on voice responses"}
        >
          {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Type your message..."
          className="flex-1 bg-transparent border-none focus:outline-none text-blue-100 placeholder:text-blue-400/50 px-3 dark:text-blue-100 dark:placeholder:text-blue-400/50 light:text-blue-100 light:placeholder:text-blue-300/60"
          aria-label="Message input"
        />
        
        <button 
          onClick={handleSendMessage}
          className={`btn-icon ml-2 transition-all duration-300 rounded-full p-2 border ${inputValue.trim() ? 'text-blue-300 border-blue-500/50 hover:bg-blue-900/20 hover:border-blue-400 dark:text-blue-300 light:text-blue-200' : 'text-blue-400/30 border-blue-500/10 dark:text-blue-400/30 light:text-blue-300/30'}`}
          disabled={!inputValue.trim()}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
