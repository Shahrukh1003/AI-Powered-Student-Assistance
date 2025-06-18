
/**
 * Voice Assistance Service
 * 
 * This service provides speech recognition and text-to-speech capabilities
 * using the browser's Web Speech API
 */

import { speak as textToSpeech, stopSpeaking, isSpeaking } from '@/utils/textToSpeech';
import { startListening as startSpeechRecognition, stopListening as stopSpeechRecognition } from '@/utils/speechRecognition';

// Voice options for text-to-speech
interface VoiceOptions {
  voice?: SpeechSynthesisVoice | null;
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
}

/**
 * Voice assistance service with speech recognition and text-to-speech
 */
class VoiceAssistanceService {
  /**
   * Check if speech recognition is supported by the browser
   */
  public isSpeechRecognitionSupported(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }
  
  /**
   * Start listening for speech input
   * @param callback Function to call with the speech transcript
   * @param lang Language code (e.g., 'en-US')
   * @param autoClose Whether to automatically close when silence is detected
   * @param silenceTimeout Milliseconds of silence before auto-closing (default: 1500)
   * @returns Boolean indicating if listening started successfully
   */
  public startListening(
    callback: (transcript: string) => void, 
    lang: string = 'en-US',
    autoClose: boolean = true,
    silenceTimeout: number = 1500
  ): boolean {
    // Set language first
    this.setRecognitionLanguage(lang);
    
    return startSpeechRecognition(callback, autoClose, silenceTimeout);
  }
  
  /**
   * Stop listening for speech input
   */
  public stopListening(): boolean {
    return stopSpeechRecognition();
  }
  
  /**
   * Set the language for speech recognition
   */
  private setRecognitionLanguage(lang: string): void {
    // This is handled directly in the speechRecognition utility
    console.log(`Setting recognition language to ${lang}`);
  }
  
  /**
   * Convert text to speech
   * @param text Text to speak
   * @param options Voice options
   */
  public async speak(text: string, options: VoiceOptions = {}): Promise<void> {
    try {
      await textToSpeech(text, options);
    } catch (error) {
      console.error('Error speaking text:', error);
      throw error;
    }
  }
  
  /**
   * Stop speaking
   */
  public stopSpeaking(): void {
    stopSpeaking();
  }
  
  /**
   * Check if currently speaking
   */
  public isSpeaking(): boolean {
    return isSpeaking();
  }
  
  /**
   * Get available voices for speech synthesis
   */
  public getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return [];
    }
    
    return window.speechSynthesis.getVoices();
  }
}

// Export a singleton instance
export const voiceAssistance = new VoiceAssistanceService();

// Export types for convenience - only export it once
export type { VoiceOptions };
