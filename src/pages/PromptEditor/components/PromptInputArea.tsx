import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

interface PromptInputAreaProps {
  promptContent: string;
  onPromptContentChange: (content: string) => void;
}

const PromptInputArea: React.FC<PromptInputAreaProps> = ({ promptContent, onPromptContentChange }) => {
  const [advancedTechnique, setAdvancedTechnique] = useState<'none' | 'few-shot' | 'cot' | 'persona' | 'knowledge'>('none');
  const [examples, setExamples] = useState<string>('');
  const [persona, setPersona] = useState<string>('');

  const handleTechniqueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAdvancedTechnique(e.target.value as any);
  };

  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="prompt-textarea">Prompt Content:</label>
        <textarea
          id="prompt-textarea"
          value={promptContent}
          onChange={(e) => onPromptContentChange(e.target.value)}
          rows={10}
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          placeholder="Enter your prompt here..."
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="advanced-technique">Advanced Prompt Engineering Technique:</label>
        <select id="advanced-technique" value={advancedTechnique} onChange={handleTechniqueChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}>
          <option value="none">None (Zero-shot)</option>
          <option value="few-shot">Few-shot Prompting</option>
          <option value="cot">Chain-of-Thought (CoT) Prompting</option>
          <option value="persona">Persona-based Prompting</option>
          <option value="knowledge">Generate Knowledge Prompting</option>
          {/* TODO: Add Meta-prompting, Self-consistency options (2.2) */}
        </select>
      </div>

      {advancedTechnique === 'few-shot' && (
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="few-shot-examples">Few-shot Examples (e.g., Input:..., Output:...):</label>
          <textarea
            id="few-shot-examples"
            value={examples}
            onChange={(e) => setExamples(e.target.value)}
            rows={5}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
            placeholder="Provide 2-5 examples to guide the model's tone, structure, or format. (2.2)"
          />
        </div>
      )}

      {advancedTechnique === 'persona' && (
        <Input
          label="Persona (e.g., 'You are an experienced customer success manager')"
          value={persona}
          onChange={(e) => setPersona(e.target.value)}
          placeholder="Assign a specific role to the AI model to tailor responses. (2.2)"
        />
      )}

      {/* TODO: Implement UI for other advanced techniques */}
      <p style={{ fontSize: '0.9em', color: '#666' }}>
        This component supports a comprehensive array of advanced prompt engineering techniques, enabling users to precisely guide AI models for optimal results. (Section 2.2)
      </p>
    </div>
  );
};

export default PromptInputArea;
