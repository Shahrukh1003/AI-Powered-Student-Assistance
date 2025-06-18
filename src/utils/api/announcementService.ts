import { API_CONFIG } from '@/config/api';

/**
 * Service for fetching university announcements from the API
 */

/**
 * Fetch announcements from the REVA University API with improved error handling
 */
export const fetchRevaAnnouncements = async (): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
  errorType?: 'network' | 'server' | 'timeout' | 'parse' | 'unknown';
}> => {
  try {
    // Add timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const apiUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REVA_ABOUT}`;
    console.log('Attempting to fetch from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // Clear timeout since request completed
    clearTimeout(timeoutId);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      // More specific error handling based on status codes
      if (response.status >= 500) {
        return {
          success: false,
          error: `Server error (${response.status}): The announcement server is currently unavailable. Details: ${errorText}`,
          errorType: 'server'
        };
      } else if (response.status === 404) {
        return {
          success: false,
          error: 'The announcements API endpoint was not found.',
          errorType: 'server'
        };
      } else if (response.status === 429) {
        return {
          success: false,
          error: 'Too many requests. Please try again later.',
          errorType: 'server'
        };
      } else {
        return {
          success: false,
          error: `API request failed with status ${response.status}. Details: ${errorText}`,
          errorType: 'server'
        };
      }
    }
    
    const data = await response.json();
    console.log('Raw API response:', data);
    
    // Transform the data to match our expected format
    const formattedData = Object.entries(data).map(([url, info]: [string, any]) => ({
      title: info.title || 'No Title',
      description: info.content || 'No Content',
      date: new Date().toISOString(),
      category: 'Academic',
      url: url
    }));
    
    console.log('Transformed data:', formattedData);
    
    return {
      success: true,
      data: formattedData
    };
  } catch (error) {
    console.error('Error fetching REVA announcements:', error);
    
    // Improved error categorization
    let errorMessage = 'Unknown error occurred';
    let errorType: 'network' | 'timeout' | 'parse' | 'unknown' = 'unknown';
    
    if (error instanceof TypeError && error.message.includes('NetworkError')) {
      errorMessage = 'Network error: Unable to connect to the announcements server';
      errorType = 'network';
    } else if (error instanceof DOMException && error.name === 'AbortError') {
      errorMessage = 'Request timeout: The announcements server took too long to respond';
      errorType = 'timeout';
    } else if (error instanceof SyntaxError) {
      errorMessage = 'Invalid response: Could not parse announcement data';
      errorType = 'parse';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
      errorType
    };
  }
};
