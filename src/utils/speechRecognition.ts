// Defining a type for our callback function
type TranscriptCallback = (transcript: string) => void;

// Interface for the SpeechRecognition class
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  onstart: () => void;
  onaudiostart: () => void;
  onsoundstart: () => void;
}

// Global variable to store the SpeechRecognition instance
let recognition: SpeechRecognitionInstance | null = null;

// Global variable to track if we're currently listening
let isListeningActive = false;

// Checking browser compatibility
const isSpeechRecognitionSupported = () => {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

// Initialize speech recognition
const initSpeechRecognition = () => {
  if (!isSpeechRecognitionSupported()) {
    console.error('Speech recognition is not supported in this browser');
    return null;
  }
  
  // @ts-ignore - We're handling the browser compatibility check above
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
  // Create a new instance of SpeechRecognition
  const recognition = new SpeechRecognition() as SpeechRecognitionInstance;
  
  // Configure the recognition for better performance
  recognition.continuous = false;      // Auto-stop after user stops speaking
  recognition.interimResults = true;   // Get results as user speaks
  recognition.lang = 'en-US';          // Set language
  
  return recognition;
};

// Event to broadcast transcript updates
const broadcastTranscript = (transcript: string) => {
  // Always broadcast the transcript, even if empty (for UI feedback)
  const customEvent = new CustomEvent('interim-transcript', { 
    detail: transcript 
  });
  window.dispatchEvent(customEvent);
};

// Start listening and return the transcript
export const startListening = (
  callback: TranscriptCallback, 
  autoClose: boolean = true,
  silenceTimeout: number = 1500
) => {
  if (isListeningActive) {
    console.log('Already listening, stopping previous session');
    stopListening();
  }
  
  if (!recognition) {
    recognition = initSpeechRecognition();
    if (!recognition) return false;
  }
  
  let finalTranscript = '';
  let interimTranscript = '';
  let silenceTimer: number | null = null;
  let finalResultReceived = false;
  let lastInterimTime = Date.now();
  
  // Clear previous handlers to avoid memory leaks
  if (recognition) {
    recognition.onstart = null;
    recognition.onaudiostart = null;
    recognition.onspeechstart = null;
    recognition.onresult = null;
    recognition.onerror = null;
    recognition.onend = null;
  }
  
  recognition.onstart = () => {
    console.log("Speech recognition service has started");
    isListeningActive = true;
    
    // Reset state on new session
    finalTranscript = '';
    interimTranscript = '';
    finalResultReceived = false;
    
    // Broadcast empty transcript to clear any previous text
    broadcastTranscript('');
  };
  
  recognition.onaudiostart = () => {
    console.log("Audio capturing started");
  };
  
  recognition.onspeechstart = () => {
    console.log("Speech detected");
  };
  
  recognition.onresult = (event: any) => {
    interimTranscript = '';
    
    // Update the last time we received an interim result
    lastInterimTime = Date.now();
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript = transcript; // Use only the most recent final result
        finalResultReceived = true;
        console.log("Final transcript received:", finalTranscript);
        
        // Broadcast final transcript for UI updates
        broadcastTranscript(finalTranscript);
        
        // Auto-stop after receiving final result and call callback
        if (autoClose) {
          console.log("Auto-closing after final result");
          
          // Only call callback if there's actual content
          if (finalTranscript.trim() !== '') {
            callback(finalTranscript);
          }
          
          // Stop listening after callback is called
          setTimeout(() => {
            stopListening();
          }, 100);
        }
      } else {
        interimTranscript = transcript; // Use only the most recent interim result
        
        // Broadcast interim transcript for real-time UI updates
        broadcastTranscript(interimTranscript);
        
        // Reset silence detection on new interim results
        if (silenceTimer) {
          clearTimeout(silenceTimer);
          silenceTimer = null;
        }
        
        // Set a silence detector - auto stop if no new speech
        if (autoClose) {
          silenceTimer = window.setTimeout(() => {
            const currentTime = Date.now();
            const timeSinceLastInterim = currentTime - lastInterimTime;
            
            if (timeSinceLastInterim > silenceTimeout && !finalResultReceived && isListeningActive) {
              console.log("Silence detected, using interim transcript:", interimTranscript);
              
              // Only call callback if there's actual content
              if (interimTranscript.trim() !== '') {
                callback(interimTranscript); // Use the interim transcript
              }
              
              // Stop listening after callback is called
              setTimeout(() => {
                stopListening();
              }, 100);
            }
          }, silenceTimeout);
        }
      }
    }
  };
  
  recognition.onerror = (event: any) => {
    console.error('Speech recognition error', event.error);
    
    // Clear any pending timers
    if (silenceTimer) {
      clearTimeout(silenceTimer);
    }
    
    // Set listening to false
    isListeningActive = false;
    
    // Try to retry on network errors
    if (event.error === 'network') {
      console.log("Network error in speech recognition, attempting to restart");
      setTimeout(() => {
        if (!isListeningActive) {
          startListening(callback, autoClose, silenceTimeout);
        }
      }, 1000);
    }
    
    // For no-speech errors, let the user know
    if (event.error === 'no-speech') {
      broadcastTranscript('No speech detected. Please try again.');
      setTimeout(() => {
        broadcastTranscript('');
      }, 2000);
    }
  };
  
  recognition.onend = () => {
    // When recognition ends, make a final call if needed
    if (!finalResultReceived && interimTranscript && interimTranscript.trim() !== '' && isListeningActive) {
      console.log("Recognition ended with interim transcript:", interimTranscript);
      callback(interimTranscript);
    }
    
    if (silenceTimer) {
      clearTimeout(silenceTimer);
    }
    
    // Mark that we're no longer listening
    isListeningActive = false;
    
    console.log("Speech recognition ended");
  };
  
  try {
    recognition.start();
    console.log("Speech recognition started");
    isListeningActive = true;
    return true;
  } catch (error) {
    console.error("Error starting speech recognition:", error);
    isListeningActive = false;
    return false;
  }
};

// Stop listening
export const stopListening = () => {
  if (!recognition || !isListeningActive) {
    isListeningActive = false;
    return false;
  }
  
  try {
    recognition.stop();
    isListeningActive = false;
    console.log("Speech recognition stopped");
    return true;
  } catch (error) {
    console.error("Error stopping speech recognition:", error);
    isListeningActive = false;
    return false;
  }
};

// Check if currently listening
export const isListening = () => {
  return isListeningActive;
};
