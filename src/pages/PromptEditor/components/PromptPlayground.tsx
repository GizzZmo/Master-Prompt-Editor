import React, { useState } from 'react';
import { generateAIContent } from '../../../utils/api'; // Use the specific API function

interface PromptPlaygroundProps {
  promptContent: string; // The prompt text from the editor
}

interface PlaygroundResult {
  text: string; // Assuming the AI generate content returns a 'text' field
}

export function PromptPlayground({ promptContent }: PromptPlaygroundProps) {
  const [userInput, setUserInput] = useState<string>(''); // User's input to feed into the prompt
  const [result, setResult] = useState<PlaygroundResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!promptContent.trim()) {
      alert('Please provide prompt content in the editor area.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    const fullPrompt = `${promptContent}\n\nUser Input: ${userInput}`.trim();

    try {
      // Use the general AI generation endpoint, passing the combined prompt and a mock config
      const apiResponse = await generateAIContent(fullPrompt, { model: 'GPT-4', temperature: 0.7 });
      if (apiResponse.success && apiResponse.data) {
        setResult({ text: apiResponse.data.text || JSON.stringify(apiResponse.data, null, 2) });
      } else {
        setError(apiResponse.error || 'Failed to get a valid response from AI.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h4>Prompt Content (from Editor):</h4>
      <div style={{ border: '1px dashed #ddd', padding: '10px', borderRadius: '5px', minHeight: '80px', maxHeight: '200px', overflowY: 'auto', backgroundColor: '#f9f9f9', marginBottom: '15px', whiteSpace: 'pre-wrap' }}>
        {promptContent || <span style={{color: '#888'}}>No prompt content loaded. Select or create a prompt.</span>}
      </div>

      <h4>User Input for Playground:</h4>
      <textarea
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Enter user input for the prompt (e.g., 'Draft an email for a new feature')..."
        rows={4}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <button onClick={handleRun} disabled={isLoading || !promptContent.trim()}>
        {isLoading ? 'Running...' : 'Run Prompt in Playground'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h4>Error:</h4>
          <pre>{error}</pre>
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h4>AI Output:</h4>
          <pre style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result.text}</pre>
        </div>
      )}
    </div>
  );
}
