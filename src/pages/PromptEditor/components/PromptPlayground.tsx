import React, { useState, useEffect } from 'react';
import { generateAIContent } from '../../../utils/api'; // Use the specific API function
import { ChatMessage } from '../../../types/ai';

interface PromptPlaygroundProps {
  promptContent: string; // The prompt text from the editor
}

export function PromptPlayground({ promptContent }: PromptPlaygroundProps) {
  const [userInput, setUserInput] = useState<string>(''); // User's input to feed into the prompt
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedChat = localStorage.getItem('promptPlaygroundChat');
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat);
        setChatHistory(parsedChat);
      } catch (error) {
        console.error('Failed to parse saved chat history:', error);
      }
    }
  }, []);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0) {
      localStorage.setItem('promptPlaygroundChat', JSON.stringify(chatHistory));
    }
  }, [chatHistory]);

  const addMessageToHistory = (type: 'user' | 'assistant' | 'system', content: string) => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date().toISOString(),
    };
    setChatHistory(prev => [...prev, message]);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('promptPlaygroundChat');
    setError(null);
  };

  const handleRun = async () => {
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

    // Add user message to chat history
    addMessageToHistory('user', userInput);

    const fullPrompt = `${promptContent}\n\nUser Input: ${userInput}`.trim();

    try {
      // Use the general AI generation endpoint, passing the combined prompt and a mock config
      const apiResponse = await generateAIContent(fullPrompt, { model: 'GPT-4', temperature: 0.7 });
      if (apiResponse.success && apiResponse.data) {
        const aiResponse = apiResponse.data.text || JSON.stringify(apiResponse.data, null, 2);
        // Add AI response to chat history
        addMessageToHistory('assistant', aiResponse);
      } else {
        const errorMessage = apiResponse.error || 'Failed to get a valid response from AI.';
        setError(errorMessage);
        addMessageToHistory('system', `Error: ${errorMessage}`);
      }
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      addMessageToHistory('system', `Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      // Clear user input after sending
      setUserInput('');
    }
  };

  return (
    <div>
      <h4>Prompt Content (from Editor):</h4>
      <div style={{ border: '1px dashed #ddd', padding: '10px', borderRadius: '5px', minHeight: '80px', maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f9f9f9', marginBottom: '15px', whiteSpace: 'pre-wrap' }}>
        {promptContent || <span style={{color: '#888'}}>No prompt content loaded. Select or create a prompt.</span>}
      </div>

      {/* Chat History Section */}
      {chatHistory.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h4>Chat History:</h4>
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
                  backgroundColor: message.type === 'user' ? '#e3f2fd' : message.type === 'assistant' ? '#f1f8e9' : '#fff3e0',
                  border: `1px solid ${message.type === 'user' ? '#2196f3' : message.type === 'assistant' ? '#4caf50' : '#ff9800'}`,
                }}
              >
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
                <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h4>Send Message to AI:</h4>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter your message (e.g., 'Draft an email for a new feature')..."
        rows={4}
        style={{ width: '100%', marginBottom: '10px' }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleRun();
          }
        }}
      />

      <button onClick={handleRun} disabled={isLoading || !promptContent.trim() || !userInput.trim()}>
        {isLoading ? 'Sending...' : 'Send Message (Ctrl+Enter)'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h4>Error:</h4>
          <pre>{error}</pre>
        </div>
      )}
    </div>
  );
}
