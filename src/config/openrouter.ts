export const OPENROUTER_CONFIG = {
  API_URL: 'https://openrouter.ai/api/v1/chat/completions',
  // Using a free model available on OpenRouter's free tier. Subject to change.
  MODEL: 'mistralai/mistral-7b-instruct:free', // Example of a free model
  API_KEY: import.meta.env.VITE_OPENROUTER_API_KEY,
}; 