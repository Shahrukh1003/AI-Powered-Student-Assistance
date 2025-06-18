
/**
 * Live Data Integration Service
 * 
 * This service provides utilities for fetching real-time data
 * from various sources and integrating it with the application.
 */

// Types for data sources and responses
export interface DataSource {
  id: string;
  name: string;
  endpoint: string;
  type: 'rest' | 'graphql' | 'websocket' | 'sse';
  headers?: Record<string, string>;
  pollingInterval?: number;
}

export interface DataFetchResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errorType?: 'network' | 'server' | 'timeout' | 'parse' | 'unknown';
  timestamp: Date;
}

/**
 * Live Data Service - Integration Point
 * 
 * This class provides methods for integrating live data fetching
 * with your own custom functionality.
 */
class LiveDataService {
  private dataSources: Map<string, DataSource> = new Map();
  private activePolling: Map<string, number> = new Map();
  
  /**
   * Register a data source for later use
   */
  registerDataSource(source: DataSource): void {
    this.dataSources.set(source.id, source);
  }
  
  /**
   * Get a registered data source
   */
  getDataSource(id: string): DataSource | undefined {
    return this.dataSources.get(id);
  }
  
  /**
   * List all registered data sources
   */
  listDataSources(): DataSource[] {
    return Array.from(this.dataSources.values());
  }
  
  /**
   * Fetch data from a registered source once
   */
  async fetchData<T = any>(sourceId: string, params?: any): Promise<DataFetchResponse<T>> {
    try {
      const source = this.dataSources.get(sourceId);
      if (!source) {
        return {
          success: false,
          error: `Data source '${sourceId}' not found`,
          errorType: 'unknown',
          timestamp: new Date()
        };
      }
      
      // Add timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      console.log(`Fetching data from source: ${source.name}`);
      
      const response = await fetch(source.endpoint, {
        method: 'GET',
        headers: source.headers || {
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      // Clear timeout since request completed
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return this.handleFetchError(response);
      }
      
      const data = await response.json();
      
      return {
        success: true,
        data: data as T,
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Error fetching from '${sourceId}':`, error);
      return this.handleFetchException(error);
    }
  }
  
  /**
   * Start polling a data source at specified interval
   */
  startPolling<T = any>(
    sourceId: string, 
    callback: (response: DataFetchResponse<T>) => void, 
    interval?: number
  ): boolean {
    const source = this.dataSources.get(sourceId);
    if (!source) {
      console.error(`Cannot start polling: Data source '${sourceId}' not found`);
      return false;
    }
    
    // Stop any existing polling for this source
    this.stopPolling(sourceId);
    
    // Use provided interval or the one from the data source or default to 30 seconds
    const pollingInterval = interval || source.pollingInterval || 30000;
    
    // Initial fetch
    this.fetchData<T>(sourceId).then(callback);
    
    // Set up interval
    const intervalId = window.setInterval(async () => {
      const response = await this.fetchData<T>(sourceId);
      callback(response);
    }, pollingInterval);
    
    // Store the interval ID
    this.activePolling.set(sourceId, intervalId);
    return true;
  }
  
  /**
   * Stop polling a data source
   */
  stopPolling(sourceId: string): void {
    const intervalId = this.activePolling.get(sourceId);
    if (intervalId) {
      clearInterval(intervalId);
      this.activePolling.delete(sourceId);
    }
  }
  
  /**
   * Setup a server-sent events (SSE) connection
   */
  setupSSEConnection<T = any>(
    sourceId: string,
    callback: (data: T) => void,
    errorCallback?: (error: any) => void
  ): () => void {
    const source = this.dataSources.get(sourceId);
    if (!source || source.type !== 'sse') {
      console.error(`Cannot setup SSE: Data source '${sourceId}' not found or not SSE type`);
      return () => {};
    }
    
    const eventSource = new EventSource(source.endpoint);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
        if (errorCallback) errorCallback(error);
      }
    };
    
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      if (errorCallback) errorCallback(error);
    };
    
    // Return cleanup function
    return () => {
      eventSource.close();
    };
  }
  
  /**
   * Connect to custom data source (integration point)
   * 
   * This is a placeholder function for connecting to external 
   * data sources with custom authentication or handling
   */
  connectToCustomDataSource(config: any): Promise<boolean> {
    // Placeholder for custom implementation
    return Promise.resolve(true);
  }
  
  /**
   * Helper method to handle fetch errors
   */
  private handleFetchError(response: Response): DataFetchResponse {
    if (response.status >= 500) {
      return {
        success: false,
        error: `Server error (${response.status}): The server is currently unavailable.`,
        errorType: 'server',
        timestamp: new Date()
      };
    } else if (response.status === 404) {
      return {
        success: false,
        error: 'The API endpoint was not found.',
        errorType: 'server',
        timestamp: new Date()
      };
    } else if (response.status === 429) {
      return {
        success: false,
        error: 'Too many requests. Please try again later.',
        errorType: 'server',
        timestamp: new Date()
      };
    } else {
      return {
        success: false,
        error: `API request failed with status ${response.status}`,
        errorType: 'server',
        timestamp: new Date()
      };
    }
  }
  
  /**
   * Helper method to handle fetch exceptions
   */
  private handleFetchException(error: any): DataFetchResponse {
    let errorMessage = 'Unknown error occurred';
    let errorType: 'network' | 'timeout' | 'parse' | 'unknown' = 'unknown';
    
    if (error instanceof TypeError && error.message.includes('NetworkError')) {
      errorMessage = 'Network error: Unable to connect to the server';
      errorType = 'network';
    } else if (error instanceof DOMException && error.name === 'AbortError') {
      errorMessage = 'Request timeout: The server took too long to respond';
      errorType = 'timeout';
    } else if (error instanceof SyntaxError) {
      errorMessage = 'Invalid response: Could not parse data';
      errorType = 'parse';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
      errorType,
      timestamp: new Date()
    };
  }
}

// Export a singleton instance
export const liveData = new LiveDataService();

// Export types for convenience
export type { LiveDataService };
// Types are already exported above
