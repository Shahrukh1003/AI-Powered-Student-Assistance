// Available voice options
type VoiceId = string;

// Sarah voice ID from ElevenLabs (female voice)
const DEFAULT_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL';

interface SpeakOptions {
  voiceId?: VoiceId;
  model?: string;
  rate?: number;
  pitch?: number;
}

// Audio instance management for handling playback
let currentAudio: HTMLAudioElement | null = null;
let currentMessageId: string | null = null;
let speechSynthInstance: SpeechSynthesisUtterance | null = null;

// Cache voices after initial load to improve performance
let cachedVoices: SpeechSynthesisVoice[] = [];

/**
 * Safely load voices with enhanced error handling
 */
const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    // First, try immediate retrieval
    let voices = window.speechSynthesis.getVoices();
    
    if (voices.length > 0) {
      console.log(`Loaded ${voices.length} voices immediately`);
      cachedVoices = voices;
      resolve(voices);
    } else {
      // If no voices, wait for voiceschanged event
      const voicesChangedHandler = () => {
        voices = window.speechSynthesis.getVoices();
        console.log(`Loaded ${voices.length} voices after event`);
        
        if (voices.length > 0) {
          cachedVoices = voices;
          resolve(voices);
          window.speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
        }
      };
      
      window.speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
      
      // Fallback timeout in case event doesn't fire
      setTimeout(() => {
        voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          resolve(voices);
        } else {
          console.warn('Could not load any voices');
          resolve([]);
        }
      }, 1000);
    }
  });
};

/**
 * Select the most appropriate voice
 */
const selectAppropriateVoice = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
  const preferredVoicePatterns = [
    'Samantha', 'female', 'woman', 'girl', 
    'karen', 'melina', 'alex', 'victoria', 
    'lisa', 'monica', 'Google UK English Female'
  ];

  // First pass: match preferred voice names
  let siriLikeVoice = voices.find(voice => 
    preferredVoicePatterns.some(pattern => 
      voice.name.toLowerCase().includes(pattern.toLowerCase())
    )
  );

  // Second pass: English female voices
  if (!siriLikeVoice) {
    siriLikeVoice = voices.find(voice => 
      (voice.name.includes('Female') || voice.name.includes('f ')) &&
      (voice.lang && voice.lang.includes('en'))
    );
  }

  // Final fallback: default or first voice
  return siriLikeVoice || 
         voices.find(voice => voice.default) || 
         (voices.length > 0 ? voices[0] : null);
};

/**
 * Convert text to speech using browser's SpeechSynthesis API
 */
export const speak = async (
  text: string, 
  options: SpeakOptions = {}
): Promise<void> => {
  if (!text || text.trim() === '') {
    console.log('Empty text provided, nothing to speak');
    return;
  }

  // Stop any current speech
  stopSpeaking();
  
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configure speech parameters
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.1;
    utterance.volume = 1.0;

    // Load and select voices
    const voices = await loadVoices();
    console.log(`${voices.length} voices available`);

    const selectedVoice = selectAppropriateVoice(voices);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log('Using voice:', selectedVoice.name);
    }

    // Enhanced error and lifecycle tracking
    return new Promise<void>((resolve, reject) => {
      utterance.onstart = () => {
        console.log('Speech started');
        speechSynthInstance = utterance;
      };
      
      utterance.onend = () => {
        console.log('Speech ended');
        speechSynthInstance = null;
        currentAudio = null;
        resolve();
      };
      
      utterance.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        speechSynthInstance = null;
        currentAudio = null;
        reject(e);
      };

      // Attempt to speak with fallback
      try {
        window.speechSynthesis.speak(utterance);
      } catch (speakError) {
        console.error('Failed to start speech:', speakError);
        reject(speakError);
      }
    });
    
  } catch (error) {
    console.error('Text-to-speech error:', error);
    // Reset state if error occurs
    speechSynthInstance = null;
    currentAudio = null;
    throw error;
  }
};

/**
 * Stop any currently playing speech
 */
export const stopSpeaking = (): void => {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }
  
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  
  speechSynthInstance = null;
};

/**
 * Check if speech is currently playing
 */
export const isSpeaking = (): boolean => {
  return window.speechSynthesis.speaking || (speechSynthInstance !== null);
};

/**
 * Initialize the speech synthesis to load available voices
 */
export const initSpeechSynthesis = (): void => {
  // This forces the browser to load the available voices
  if (typeof speechSynthesis !== 'undefined') {
    try {
      // Try to load voices immediately
      const voices = speechSynthesis.getVoices();
      console.log(`${voices.length} voices loaded`);
      cachedVoices = voices;
      
      // Also set up an event listener for when voices change
      speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = speechSynthesis.getVoices();
        console.log(`${updatedVoices.length} voices loaded`);
        cachedVoices = updatedVoices;
      };
    } catch (error) {
      console.error('Error initializing speech synthesis:', error);
    }
  }
};

// Immediate voice initialization
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', initSpeechSynthesis);
}
