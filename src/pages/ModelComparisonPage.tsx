import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useToast } from '../context/toastContextHelpers';

interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  strengths: string[];
  contextWindow: string;
  costPerMToken: string;
  speed: 'Fast' | 'Medium' | 'Slow';
  quality: 'High' | 'Medium' | 'Standard';
}

const ModelComparisonPage: React.FC = () => {
  const { showToast } = useToast();
  const [testPrompt, setTestPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const models: ModelInfo[] = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      description: 'Most capable model, best for complex reasoning tasks',
      strengths: ['Complex reasoning', 'Code generation', 'Long context understanding'],
      contextWindow: '8K-32K tokens',
      costPerMToken: '$30-60',
      speed: 'Medium',
      quality: 'High'
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      description: 'Fast and cost-effective for most tasks',
      strengths: ['Fast responses', 'Cost-effective', 'General purpose'],
      contextWindow: '4K-16K tokens',
      costPerMToken: '$0.50-1.50',
      speed: 'Fast',
      quality: 'Medium'
    },
    {
      id: 'claude-3-opus',
      name: 'Claude 3 Opus',
      provider: 'Anthropic',
      description: 'Excellent for analysis and long documents',
      strengths: ['Long context', 'Analysis', 'Nuanced responses'],
      contextWindow: '200K tokens',
      costPerMToken: '$15-75',
      speed: 'Medium',
      quality: 'High'
    },
    {
      id: 'claude-3-sonnet',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      description: 'Balanced performance and cost',
      strengths: ['Balanced', 'Reliable', 'Good reasoning'],
      contextWindow: '200K tokens',
      costPerMToken: '$3-15',
      speed: 'Medium',
      quality: 'High'
    },
    {
      id: 'llama-3-70b',
      name: 'Llama 3 70B',
      provider: 'Meta',
      description: 'Open-source model for flexible deployment',
      strengths: ['Open-source', 'Customizable', 'Privacy-focused'],
      contextWindow: '8K tokens',
      costPerMToken: 'Self-hosted',
      speed: 'Medium',
      quality: 'Medium'
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      description: 'Multimodal capabilities with strong reasoning',
      strengths: ['Multimodal', 'Fast', 'Good reasoning'],
      contextWindow: '32K tokens',
      costPerMToken: '$0.50-1.50',
      speed: 'Fast',
      quality: 'High'
    }
  ];

  const toggleModelSelection = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    );
  };

  const handleCompare = () => {
    if (selectedModels.length < 2) {
      showToast('Please select at least 2 models to compare', 'warning');
      return;
    }
    if (!testPrompt.trim()) {
      showToast('Please enter a test prompt', 'warning');
      return;
    }
    showToast(`Comparing ${selectedModels.length} models (conceptual)`, 'info');
  };

  const getSpeedColor = (speed: string) => {
    switch(speed) {
      case 'Fast': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'Slow': return '#dc3545';
      default: return '#666';
    }
  };

  const getQualityColor = (quality: string) => {
    switch(quality) {
      case 'High': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'Standard': return '#6c757d';
      default: return '#666';
    }
  };

  return (
    <div>
      <h2>Model Comparison</h2>
      <p>Compare different AI models to choose the best one for your use case.</p>

      <div style={{ 
        border: '1px solid #e9ecef', 
        padding: '20px', 
        borderRadius: '8px', 
        backgroundColor: 'white',
        marginBottom: '20px'
      }}>
        <h3>Test Prompt (Optional)</h3>
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          Enter a prompt to test with selected models and compare their responses.
        </p>
        <Input
          label="Test Prompt:"
          value={testPrompt}
          onChange={(e) => setTestPrompt(e.target.value)}
          placeholder="Enter a prompt to test across models..."
        />
        <div style={{ marginTop: '10px' }}>
          <Button 
            onClick={handleCompare}
            disabled={selectedModels.length < 2}
          >
            Compare Selected Models ({selectedModels.length})
          </Button>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '20px' 
      }}>
        {models.map(model => (
          <div 
            key={model.id}
            style={{ 
              border: selectedModels.includes(model.id) ? '2px solid #007bff' : '1px solid #e9ecef',
              padding: '20px', 
              borderRadius: '8px', 
              backgroundColor: selectedModels.includes(model.id) ? '#f0f8ff' : 'white',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => toggleModelSelection(model.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: 0, color: '#007bff' }}>{model.name}</h3>
                <p style={{ 
                  margin: '5px 0', 
                  fontSize: '0.85em', 
                  color: '#666',
                  fontWeight: 'bold'
                }}>
                  {model.provider}
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={selectedModels.includes(model.id)}
                onChange={() => toggleModelSelection(model.id)}
                style={{ width: '20px', height: '20px' }}
              />
            </div>

            <p style={{ margin: '10px 0', fontSize: '0.9em' }}>{model.description}</p>

            <div style={{ marginTop: '15px' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9em' }}>Strengths:</p>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.85em' }}>
                {model.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>

            <div style={{ 
              marginTop: '15px', 
              paddingTop: '15px', 
              borderTop: '1px solid #e9ecef',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              fontSize: '0.85em'
            }}>
              <div>
                <strong>Context:</strong>
                <div>{model.contextWindow}</div>
              </div>
              <div>
                <strong>Cost:</strong>
                <div>{model.costPerMToken}</div>
              </div>
              <div>
                <strong>Speed:</strong>
                <div style={{ color: getSpeedColor(model.speed) }}>
                  ● {model.speed}
                </div>
              </div>
              <div>
                <strong>Quality:</strong>
                <div style={{ color: getQualityColor(model.quality) }}>
                  ● {model.quality}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedModels.length > 0 && (
        <div style={{ 
          marginTop: '30px', 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px' 
        }}>
          <h3>Selected Models ({selectedModels.length})</h3>
          <p style={{ fontSize: '0.9em' }}>
            {selectedModels.map(id => models.find(m => m.id === id)?.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ModelComparisonPage;
