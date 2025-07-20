import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { runPromptTest } from '../../../utils/api';
import { MultimodalOutput } from '../../../types/ai';

interface PromptPlaygroundProps {
  promptContent: string;
}

const PromptPlayground: React.FC<PromptPlaygroundProps> = ({ promptContent }) => {
  const [testInput, setTestInput] = useState<string>('');
  const [aiOutput, setAiOutput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunTest = async () => {
    setLoading(true);
    setError(null);
    setAiOutput('');
    try {
      // This mocks a basic text-to-text prompt test.
      // A real playground would involve more complex input types and model configurations.
      const response = await runPromptTest(promptContent, { input: testInput });
      if (response.success && response.data?.text) {
        setAiOutput(response.data.text);
      } else {
        setError(response.error || 'Failed to get AI output.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Input
        label="Test Input (for Prompt):"
        value={testInput}
        onChange={(e) => setTestInput(e.target.value)}
        placeholder="Enter test input for your prompt..."
      />
      <Button onClick={handleRunTest} disabled={loading || !promptContent} style={{ marginBottom: '15px' }}>
        {loading ? 'Running...' : 'Run Prompt Test'}
      </Button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {aiOutput && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #d4edda', backgroundColor: '#e2f7e4', borderRadius: '5px' }}>
          <h4>AI Output:</h4>
          <p>{aiOutput}</p>
          <p style={{ fontSize: '0.8em', color: '#3c763d' }}>
            This content is AI-generated. (Responsible AI - Section 4.2)
          </p>
          {/* TODO: Add options for users to give feedback on output (2.1) */}
          <Button variant="secondary" style={{ marginRight: '10px' }}>Good Result</Button>
          <Button variant="secondary">Bad Result</Button>
        </div>
      )}
      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
        Allows non-technical users to interact with, modify, and test prompts in a safe, controlled environment. (Section 2.1)
      </p>
    </div>
  );
};

export default PromptPlayground;
