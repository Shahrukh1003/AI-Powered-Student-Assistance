import { generateOpenRouterResponse, formatPrompt } from './openrouterService';
import { fetchDataFromREVA } from './revaDataService';

interface ChatbotResponse {
  success: boolean;
  response: string;
  error?: string;
}

export const getChatbotResponse = async (query: string): Promise<ChatbotResponse> => {
  try {
    console.log('Processing query:', query);

    // First, try to get specific REVA data
    let revaData;
    try {
      revaData = await fetchDataFromREVA(query);
      console.log('REVA data fetched:', revaData ? 'Yes' : 'No');
    } catch (error) {
      console.error('Error fetching REVA data:', error);
      // Continue without REVA data
    }

    let aiResponse;
    let finalErrorMessage = "I apologize, but I'm having trouble processing your request right now.";

    // If we have specific REVA data, use it as context for the AI
    if (revaData) {
      console.log('Using REVA data as context for OpenRouter');
      aiResponse = await generateOpenRouterResponse(
        formatPrompt(query, revaData)
      );

      if (aiResponse.success && aiResponse.response) {
        return {
          success: true,
          response: aiResponse.response
        };
      }
      console.error('OpenRouter response with REVA data context failed:', aiResponse.error);
      finalErrorMessage = `I found some information about your query, but I couldn't generate a clear response right now. ${aiResponse.error || ''}`.trim();
    }

    // If no specific REVA data or AI failed with context, try direct AI response
    // Only attempt this if we didn't already get a specific data error.
    if (!aiResponse || !aiResponse.success) {
      console.log('Attempting direct OpenRouter response');
       aiResponse = await generateOpenRouterResponse(
        formatPrompt(query)
      );

      if (aiResponse.success && aiResponse.response) {
        return {
          success: true,
          response: aiResponse.response
        };
      }
      console.error('Direct OpenRouter response failed:', aiResponse.error);
      finalErrorMessage = `I couldn't generate a response for your query right now. ${aiResponse.error || ''}`.trim();
    }


    // If we get here, both attempts failed or an initial data fetch error occurred
    console.error('Both REVA data and OpenRouter responses failed, or data fetch failed.', finalErrorMessage);
    return {
      success: false,
      response: finalErrorMessage + " Please try again later or contact REVA University directly for assistance.",
      error: aiResponse?.error // Use optional chaining in case aiResponse is undefined
    };

  } catch (error) {
    console.error('Critical error in chatbot service:', error);
    return {
      success: false,
      response: "I apologize, but I'm experiencing critical technical difficulties and cannot respond right now. Please try again later.",
      error: error instanceof Error ? error.message : 'Unknown critical error occurred'
    };
  }
}; 