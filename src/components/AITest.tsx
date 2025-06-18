import { useState } from 'react';
import { generateOpenRouterResponse, formatPrompt } from '@/services/openrouterService';

export default function AITest() {
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      // Log the API key (first few characters only for security)
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      console.log('API Key available:', apiKey ? 'Yes' : 'No');
      if (apiKey) {
        console.log('API Key starts with:', apiKey.substring(0, 4) + '...');
      }

      const result = await generateOpenRouterResponse(
        formatPrompt('What is the capital of France?')
      );

      if (result.success && result.response) {
        setResponse(result.response);
      } else {
        setError(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI API Test</h2>
      
      <button
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test AI API'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {response && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p className="font-bold">Response:</p>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
} 