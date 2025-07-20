import React, { useState } from 'react';
import { api } from '../../../utils/api';

interface PlaygroundResult {
  outputText: string;
}

export function PromptPlayground() {
  const [result, setResult] = useState<PlaygroundResult | null>(null);
  const [prompt, setPrompt] = useState('');

  const handleRun = async () => {
    if (!prompt) return;
    const apiResult = await api.post<PlaygroundResult, { content: string }>(
      '/prompts/run',
      { content: prompt }
    );
    setResult(apiResult);
  };

  return (
    <div>
      <h3>Playground</h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        rows={5}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <button onClick={handleRun}>Run</button>
      {result && (
        <div style={{ marginTop: '20px' }}>
          <h4>Result:</h4>
          <pre>{result.outputText}</pre>
        </div>
      )}
    </div>
  );
}
