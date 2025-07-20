export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
// In a real application, you would load these from environment variables
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your_openai_api_key';
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'your_anthropic_api_key';
// Add other API keys or configuration settings as needed
