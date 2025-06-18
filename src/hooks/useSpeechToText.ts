import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import { startListening, stopListening, isListening as checkIfListening } from '@/utils/speechRecognition';

interface UseSpeechToTextOptions {
  onTranscript?: (text: string) => void;
  autoStart?: boolean;
  autoClose?: boolean;
  silenceTimeout?: number;
}

export const useSpeechToText = (options: UseSpeechToTextOptions = {}) => {
  const { 
    onTranscript, 
    autoStart = false, 
    autoClose = true,
    silenceTimeout = 1500
  } = options;
  
  const [transcript, setTranscript] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  // Handle transcript updates
  const handleTranscript = useCallback((text: string) => {
    setTranscript(text);
    if (onTranscript) {
      onTranscript(text);
    }
  }, [onTranscript]);

  // Start listening
  const start = useCallback(() => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser');
      toast({
        variant: "destructive",
        title: "Voice not supported",
        description: "Speech recognition is not supported in this browser",
      });
      return false;
    }

    try {
      const success = startListening(handleTranscript, autoClose, silenceTimeout);
      if (!success) {
        setError('Failed to start speech recognition');
        toast({
          variant: "destructive",
          title: "Voice error",
          description: "Failed to start speech recognition",
        });
      } else {
        setIsListening(true);
      }
      return success;
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setError('Error starting speech recognition');
      toast({
        variant: "destructive",
        title: "Voice error",
        description: "Error starting speech recognition",
      });
      return false;
    }
  }, [handleTranscript, toast, autoClose, silenceTimeout]);

  // Stop listening
  const stop = useCallback(() => {
    try {
      const success = stopListening();
      if (success) {
        setIsListening(false);
      }
      return success;
    } catch (err) {
      console.error('Error stopping speech recognition:', err);
      setError('Error stopping speech recognition');
      return false;
    }
  }, []);

  // Toggle listening
  const toggle = useCallback(() => {
    if (isListening) {
      return stop();
    } else {
      return start();
    }
  }, [isListening, start, stop]);

  // Auto-start on mount if requested
  useEffect(() => {
    if (autoStart) {
      start();
    }
    
    // Cleanup on unmount
    return () => {
      if (isListening) {
        stop();
      }
    };
  }, [autoStart, start, stop, isListening]);

  // Check actual listening state periodically
  useEffect(() => {
    if (!isListening) return;
    
    const checkListeningState = () => {
      const actuallyListening = checkIfListening();
      if (isListening !== actuallyListening) {
        setIsListening(actuallyListening);
    }
    };
    
    const interval = setInterval(checkListeningState, 500);
    return () => clearInterval(interval);
  }, [isListening]);

  return {
    transcript,
    isListening,
    error,
    isSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    start,
    stop,
    toggle
  };
};
