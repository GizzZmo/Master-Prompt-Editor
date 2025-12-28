import { useEffect, useMemo, useState } from 'react';
import { generateAIContent } from '../../../utils/api';
import { ChatMessage } from '../../../types/ai';
import { estimateCostForModel, getPricingTable } from '../../../utils/providers';

/**
 * Props for the PromptPlayground component
 */
interface PromptPlaygroundProps {
  /** The prompt text from the editor that will be used as context for AI interactions */
  promptContent: string;
}

/**
 * PromptPlayground provides a chat interface for testing prompts with AI models.
 * Features include:
 * - Persistent chat history using localStorage
 * - Real-time conversation with AI
 * - Message threading (user, assistant, system messages)
 * - Keyboard shortcuts for improved UX
 * - Error handling and loading states
 */
export function PromptPlayground({ promptContent }: PromptPlaygroundProps) {
  // User's current message input
  const [userInput, setUserInput] = useState<string>('');
  // Loading state during AI response generation
  const [isLoading, setIsLoading] = useState(false);
  // Error state for API failures
  const [error, setError] = useState<string | null>(null);
  // Complete chat conversation history
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  // Model + token/cost tracking
  const [selectedModel, setSelectedModel] = useState<string>('gpt-4');
  const [temperature, setTemperature] = useState<number>(0.7);
  const [tokenUsage, setTokenUsage] = useState<{ input: number; output: number; total: number }>({
    input: 0,
    output: 0,
    total: 0,
  });
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const pricingTable = useMemo(() => getPricingTable(), []);

  /**
   * Load chat history from localStorage when component mounts.
   * This implements the "bring back last chat" feature by restoring
   * previous conversation state from browser storage.
   */
  useEffect(() => {
    const savedChat = localStorage.getItem('promptPlaygroundChat');
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat);
        setChatHistory(parsedChat);
      } catch (error) {
        console.error('Failed to parse saved chat history:', error);
        // If parsing fails, we'll start with empty history
      }
    }
  }, []);

  /**
   * Automatically save chat history to localStorage whenever it changes.
   * This ensures conversation persistence without requiring manual save actions.
   */
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('promptPlaygroundChat', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  /**
   * Adds a new message to the chat history with automatic ID and timestamp generation.
   * @param type - The type of message: 'user', 'assistant', or 'system'
   * @param content - The message content
   */
  const addMessageToHistory = (type: 'user' | 'assistant' | 'system', content: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(), // Simple timestamp-based ID generation
      type,
      content,
      timestamp: new Date().toISOString(),
    };
    setChatHistory(prev => [...prev, message]);
  };

  /**
   * Clears all chat history from both component state and localStorage.
   * This provides users with a fresh start for new conversations.
   */
  const clearChatHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('promptPlaygroundChat');
    setError(null); // Also clear any existing errors
  };

  const estimateTokens = (text: string): number => {
    const trimmed = text.trim();
    if (!trimmed) return 0;
    // Lightweight approximation: ~4 characters per token on average
    return Math.max(1, Math.ceil(trimmed.length / 4));
  };

  useEffect(() => {
    const inputTokens = estimateTokens(`${promptContent}\n\n${userInput}`);
    const cost = estimateCostForModel(selectedModel, { input: inputTokens, output: tokenUsage.output });
    setTokenUsage((prev) => ({
      ...prev,
      input: inputTokens,
      total: inputTokens + (prev.output ?? 0),
    }));
    setEstimatedCost(cost);
  }, [promptContent, userInput, selectedModel, tokenUsage.output]);

  /**
   * Handles sending a message to the AI and managing the conversation flow.
   * This function:
   * 1. Validates inputs (prompt content and user message)
   * 2. Adds user message to chat history
   * 3. Combines prompt content with user input
   * 4. Calls AI API and handles response/errors
   * 5. Updates chat history with AI response or error messages
   */
  const handleRun = async () => {
    // Input validation
    if (!promptContent.trim()) {
      alert('Please provide prompt content in the editor area.');
      return;
    }
    
    if (!userInput.trim()) {
      alert('Please enter some input to send to the AI.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Add user message to chat history immediately
    addMessageToHistory('user', userInput);

    // Combine the prompt template with user input for AI processing
    const fullPrompt = `${promptContent}\n\nUser Input: ${userInput}`.trim();
    const inputTokens = estimateTokens(fullPrompt);
    setTokenUsage((prev) => ({
      ...prev,
      input: inputTokens,
      total: inputTokens + (prev.output ?? 0),
    }));

    try {
      // Call AI generation API with combined prompt and default configuration
      const apiResponse = await generateAIContent(fullPrompt, { model: selectedModel, temperature });
      
      if (apiResponse.success && apiResponse.data) {
        // Extract AI response text or fallback to full JSON representation
        const aiResponse = apiResponse.data.text || JSON.stringify(apiResponse.data, null, 2);
        const outputTokens = estimateTokens(aiResponse);
        setTokenUsage({ input: inputTokens, output: outputTokens, total: inputTokens + outputTokens });
        setEstimatedCost(estimateCostForModel(selectedModel, { input: inputTokens, output: outputTokens }));
        addMessageToHistory('assistant', aiResponse);
      } else {
        // Handle API errors by adding system message to chat
        const errorMessage = apiResponse.error || 'Failed to get a valid response from AI.';
        setError(errorMessage);
        addMessageToHistory('system', `Error: ${errorMessage}`);
      }
    } catch (err) {
      // Handle network/unexpected errors
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      addMessageToHistory('system', `Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setUserInput(''); // Clear input field for next message
    }
  };

  return (
    <div>
      {/* Display current prompt content for context */}
      <h4>Prompt Content (from Editor):</h4>
      <div style={{ border: '1px dashed #ddd', padding: '10px', borderRadius: '5px', minHeight: '80px', maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f9f9f9', marginBottom: '15px', whiteSpace: 'pre-wrap' }}>
        {promptContent || <span style={{color: '#888'}}>No prompt content loaded. Select or create a prompt.</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontWeight: 600 }}>Model</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{ padding: '6px', borderRadius: '6px', border: '1px solid #ccc' }}
          >
            {pricingTable.map((pricing) => (
              <option key={pricing.model} value={pricing.model}>
                {pricing.model} ({pricing.provider})
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span style={{ fontWeight: 600 }}>Temperature: {temperature.toFixed(2)}</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
          />
        </label>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <div style={{ padding: '8px 10px', background: '#eef6ff', borderRadius: '8px' }}>
          <strong>Input tokens:</strong> {tokenUsage.input}
        </div>
        <div style={{ padding: '8px 10px', background: '#eef6ff', borderRadius: '8px' }}>
          <strong>Output tokens:</strong> {tokenUsage.output}
        </div>
        <div style={{ padding: '8px 10px', background: '#e8f5e9', borderRadius: '8px' }}>
          <strong>Total:</strong> {tokenUsage.total}
        </div>
        <div style={{ padding: '8px 10px', background: '#fff3cd', borderRadius: '8px' }}>
          <strong>Est. cost:</strong> ${estimatedCost.toFixed(4)}
        </div>
      </div>

      {/* Chat History Section - Only displayed when there are messages */}
      {chatHistory.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4>Chat History:</h4>
            {/* Clear chat button for starting fresh conversations */}
            <button 
              onClick={clearChatHistory}
              style={{ 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '4px', 
                fontSize: '0.8em',
                cursor: 'pointer'
              }}
            >
              Clear Chat
            </button>
          </div>
          {/* Scrollable chat container with message bubbles */}
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            maxHeight: '300px', 
            overflowY: 'auto', 
            backgroundColor: '#f8f9fa',
            padding: '10px'
          }}>
            {chatHistory.map((message) => (
              <div
                key={message.id}
                style={{
                  marginBottom: '15px',
                  padding: '10px',
                  borderRadius: '8px',
                  // Color-coded message bubbles: blue for user, green for AI, orange for system
                  backgroundColor: message.type === 'user' ? '#e3f2fd' : message.type === 'assistant' ? '#f1f8e9' : '#fff3e0',
                  border: `1px solid ${message.type === 'user' ? '#2196f3' : message.type === 'assistant' ? '#4caf50' : '#ff9800'}`,
                }}
              >
                {/* Message header with sender type and timestamp */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <strong style={{ 
                    color: message.type === 'user' ? '#1976d2' : message.type === 'assistant' ? '#388e3c' : '#f57c00',
                    textTransform: 'capitalize'
                  }}>
                    {message.type === 'assistant' ? 'AI Assistant' : message.type}
                  </strong>
                  <small style={{ color: '#666' }}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </small>
                </div>
                {/* Message content with proper text wrapping */}
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message input section */}
      <h4>Send Message to AI:</h4>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter your message (e.g., 'Draft an email for a new feature')..."
        rows={4}
        style={{ width: '100%', marginBottom: '10px' }}
        onKeyDown={(e) => {
          // Keyboard shortcut: Ctrl+Enter to send message
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleRun();
          }
        }}
      />

      {/* Send button with loading state and validation */}
      <button onClick={handleRun} disabled={isLoading || !promptContent.trim() || !userInput.trim()}>
        {isLoading ? 'Sending...' : 'Send Message (Ctrl+Enter)'}
      </button>

      {/* Error display section */}
      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h4>Error:</h4>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}
