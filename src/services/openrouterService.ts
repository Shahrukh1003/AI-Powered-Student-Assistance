import { OPENROUTER_CONFIG } from '@/config/openrouter';

interface OpenRouterResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export const generateOpenRouterResponse = async (prompt: string): Promise<OpenRouterResponse> => {
  try {
    if (!OPENROUTER_CONFIG.API_KEY) {
      console.error('OpenRouter API key is not set.');
      return { success: false, error: 'OpenRouter API key is not set.' };
    }

    const response = await fetch(OPENROUTER_CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
        // Optional: set a site URL for better analytics on OpenRouter
        'HTTP-Referer': window.location.href, 
        'X-Title': 'REVA Assistant', // Optional: set a title for better analytics
      },
      body: JSON.stringify({
        model: OPENROUTER_CONFIG.MODEL,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error response:', errorText);
      return { success: false, error: `OpenRouter API error: ${response.status} - ${errorText}` };
    }

    const data = await response.json();
    console.log('OpenRouter response data:', data);
    const text = data.choices?.[0]?.message?.content || 'No response generated.';
    return { success: true, response: text };
  } catch (error) {
    console.error('Error in generateOpenRouterResponse:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
};

export const formatPrompt = (query: string, context?: string): string => {
  const baseInstruction = "You are a helpful assistant for REVA University. Provide information about REVA University, its programs, facilities, and policies. Format your response using Markdown, including headings, bullet points for lists, and hyperlinks where appropriate (e.g., for website links). If you don't know the answer, state that you are not sure.\n\n";

  if (context) {
    return `${baseInstruction}Context: ${context}\n\nQuestion: ${query}`; 
  }
  return `${baseInstruction}Question: ${query}`; 
}; 