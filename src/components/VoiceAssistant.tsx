import React from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceAssistantProps {
  isListening: boolean;
  onClose: () => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ isListening, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="relative w-full max-w-md p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"></div>
        <div className="relative bg-black/40 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex flex-col items-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
              isListening 
                ? 'bg-red-500/20 animate-pulse' 
                : 'bg-blue-500/20'
            }`}>
              {isListening ? (
                <MicOff className="w-12 h-12 text-red-400" />
              ) : (
                <Mic className="w-12 h-12 text-blue-400" />
              )}
      </div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              {isListening ? 'Listening...' : 'Voice Assistant'}
            </h2>
            <p className="text-white/60 text-center mb-6">
              {isListening 
                ? 'Speak clearly into your microphone'
                : 'Click the microphone to start speaking'}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            >
              Close
            </button>
      </div>
      </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
