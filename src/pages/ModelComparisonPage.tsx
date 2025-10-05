import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { useToast } from '../context/toastContextHelpers';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  contextWindow: string;
  costPer1kTokens: string;
  speed: string;
  quality: string;
  description: string;
}

const MODELS: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    contextWindow: '8K / 32K',
    costPer1kTokens: '$0.03 / $0.06',
    speed: 'Medium',
    quality: 'Excellent',
    description: 'Most capable GPT-4 model, best for complex tasks requiring high accuracy'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    contextWindow: '128K',
    costPer1kTokens: '$0.01 / $0.03',
    speed: 'Fast',
    quality: 'Excellent',
    description: 'Faster and more cost-effective GPT-4 variant with extended context'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    contextWindow: '200K',
    costPer1kTokens: '$0.015 / $0.075',
    speed: 'Medium',
    quality: 'Excellent',
    description: 'Most powerful Claude model, excels at complex analysis and creative tasks'
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    contextWindow: '200K',
    costPer1kTokens: '$0.003 / $0.015',
    speed: 'Fast',
    quality: 'Very Good',
    description: 'Balanced performance and cost, ideal for most use cases'
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    contextWindow: '32K',
    costPer1kTokens: '$0.00025 / $0.0005',
    speed: 'Very Fast',
    quality: 'Good',
    description: 'Cost-effective option with good performance for general tasks'
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta',
    contextWindow: '8K',
    costPer1kTokens: 'Free / Self-hosted',
    speed: 'Medium',
    quality: 'Good',
    description: 'Open-source model, great for self-hosting and customization'
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral AI',
    contextWindow: '32K',
    costPer1kTokens: '$0.004 / $0.012',
    speed: 'Fast',
    quality: 'Very Good',
    description: 'European alternative with strong multilingual capabilities'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'OpenAI',
    contextWindow: '16K',
    costPer1kTokens: '$0.0005 / $0.0015',
    speed: 'Very Fast',
    quality: 'Good',
    description: 'Fast and cost-effective for simple tasks and high-volume applications'
  }
];

const ModelComparisonPage: React.FC = () => {
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [testPrompt, setTestPrompt] = useState('');
  const [showTestResults, setShowTestResults] = useState(false);
  const { showToast } = useToast();

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels(prev => {
      if (prev.includes(modelId)) {
        return prev.filter(id => id !== modelId);
      } else {
        if (prev.length >= 4) {
          showToast('Maximum 4 models can be compared at once', 'warning');
          return prev;
        }
        return [...prev, modelId];
      }
    });
  };

  const runComparison = () => {
    if (selectedModels.length < 2) {
      showToast('Please select at least 2 models to compare', 'warning');
      return;
    }
    if (!testPrompt.trim()) {
      showToast('Please enter a test prompt', 'warning');
      return;
    }
    setShowTestResults(true);
    showToast('Comparison started! (Mock results)', 'info');
  };

  const selectedModelData = MODELS.filter(m => selectedModels.includes(m.id));

  return (
    <div>
      <h2>🔍 Model Comparison</h2>
      <p>Compare AI models side-by-side to find the best fit for your needs</p>

      {/* Model Selection */}
      <div style={{ marginTop: '30px' }}>
        <h3>Select Models to Compare (up to 4)</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '15px',
          marginTop: '15px'
        }}>
          {MODELS.map(model => (
            <div
              key={model.id}
              onClick={() => toggleModelSelection(model.id)}
              style={{
                border: selectedModels.includes(model.id) ? '2px solid #007bff' : '1px solid #dee2e6',
                borderRadius: '8px',
                padding: '15px',
                cursor: 'pointer',
                backgroundColor: selectedModels.includes(model.id) ? '#e7f3ff' : 'white',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{model.name}</h4>
                  <p style={{ margin: '0', fontSize: '13px', color: '#6c757d' }}>{model.provider}</p>
                </div>
                {selectedModels.includes(model.id) && (
                  <span style={{ color: '#007bff', fontSize: '20px' }}>✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison Table */}
      {selectedModels.length > 0 && (
        <div style={{ marginTop: '30px', overflowX: 'auto' }}>
          <h3>Comparison ({selectedModels.length} models selected)</h3>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            marginTop: '15px',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>Feature</th>
                {selectedModelData.map(model => (
                  <th key={model.id} style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6' }}>
                    {model.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '12px', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Provider</td>
                {selectedModelData.map(model => (
                  <td key={model.id} style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{model.provider}</td>
                ))}
              </tr>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <td style={{ padding: '12px', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Context Window</td>
                {selectedModelData.map(model => (
                  <td key={model.id} style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{model.contextWindow}</td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Cost per 1K Tokens</td>
                {selectedModelData.map(model => (
                  <td key={model.id} style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{model.costPer1kTokens}</td>
                ))}
              </tr>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <td style={{ padding: '12px', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Speed</td>
                {selectedModelData.map(model => (
                  <td key={model.id} style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{model.speed}</td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '12px', fontWeight: '500', borderBottom: '1px solid #dee2e6' }}>Quality</td>
                {selectedModelData.map(model => (
                  <td key={model.id} style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{model.quality}</td>
                ))}
              </tr>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <td style={{ padding: '12px', fontWeight: '500' }}>Description</td>
                {selectedModelData.map(model => (
                  <td key={model.id} style={{ padding: '12px', fontSize: '13px', color: '#6c757d' }}>{model.description}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Test Prompt Section */}
      {selectedModels.length >= 2 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Test with Prompt (Optional)</h3>
          <textarea
            value={testPrompt}
            onChange={(e) => setTestPrompt(e.target.value)}
            placeholder="Enter a test prompt to compare responses..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #dee2e6',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          <Button
            onClick={runComparison}
            variant="primary"
            style={{ marginTop: '10px' }}
          >
            🚀 Run Comparison
          </Button>

          {showTestResults && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
              <p style={{ margin: 0, color: '#856404' }}>
                ℹ️ Test comparison feature coming soon! This will send your prompt to selected models and compare their responses.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelComparisonPage;
