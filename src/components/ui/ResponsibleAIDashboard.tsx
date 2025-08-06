import React, { useState, useEffect } from 'react';

interface BiasDetectionResult {
  overallScore: number;
  categories: Array<{
    type: string;
    score: number;
  }>;
  suggestions: string[];
}

interface ResponsibleAIDashboardProps {
  promptContent?: string;
}

const ResponsibleAIDashboard: React.FC<ResponsibleAIDashboardProps> = ({ promptContent }) => {
  const [biasResult, setBiasResult] = useState<BiasDetectionResult | null>(null);
  const [ethicalTemplates, setEthicalTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  useEffect(() => {
    fetchEthicalTemplates();
  }, []);

  useEffect(() => {
    if (promptContent) {
      analyzeBias(promptContent);
    }
  }, [promptContent]);

  const fetchEthicalTemplates = async () => {
    try {
      const response = await fetch('/api/responsible-ai/ethical-templates');
      const templates = await response.json();
      setEthicalTemplates(templates);
    } catch (error) {
      console.error('Error fetching ethical templates:', error);
    }
  };

  const analyzeBias = async (content: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/responsible-ai/detect-bias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promptContent: content }),
      });
      const result = await response.json();
      setBiasResult(result);
    } catch (error) {
      console.error('Error analyzing bias:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBiasScoreColor = (score: number) => {
    if (score < 0.2) return '#4CAF50'; // Green - low bias
    if (score < 0.5) return '#FF9800'; // Orange - moderate bias  
    return '#f44336'; // Red - high bias
  };

  const getBiasScoreText = (score: number) => {
    if (score < 0.2) return 'Low Bias';
    if (score < 0.5) return 'Moderate Bias';
    return 'High Bias';
  };

  return (
    <div className="responsible-ai-dashboard" style={{ padding: '20px', background: '#f8f9fa', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '20px', color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🛡️ Responsible AI Dashboard
      </h3>

      {/* Bias Detection Results */}
      {biasResult && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ color: '#333', marginBottom: '12px' }}>🔍 Bias Detection Results</h4>
          <div 
            style={{
              padding: '16px',
              background: 'white',
              borderRadius: '8px',
              border: `2px solid ${getBiasScoreColor(biasResult.overallScore)}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 'bold' }}>Overall Bias Score:</span>
              <span 
                style={{ 
                  color: getBiasScoreColor(biasResult.overallScore),
                  fontWeight: 'bold',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  background: `${getBiasScoreColor(biasResult.overallScore)}20`,
                }}
              >
                {(biasResult.overallScore * 100).toFixed(1)}% - {getBiasScoreText(biasResult.overallScore)}
              </span>
            </div>

            {biasResult.categories.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <strong>Categories Detected:</strong>
                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {biasResult.categories.map((category, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 12px',
                        background: getBiasScoreColor(category.score),
                        color: 'white',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                      }}
                    >
                      {category.type}: {(category.score * 100).toFixed(0)}%
                    </span>
                  ))}
                </div>
              </div>
            )}

            {biasResult.suggestions.length > 0 && (
              <div>
                <strong>💡 Suggestions:</strong>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  {biasResult.suggestions.map((suggestion, index) => (
                    <li key={index} style={{ marginBottom: '4px', color: '#666' }}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ethical Templates */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ color: '#333', marginBottom: '12px' }}>📋 Ethical Prompt Templates</h4>
        <div style={{ background: 'white', borderRadius: '8px', padding: '16px' }}>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '12px',
            }}
          >
            <option value="">Select an ethical template...</option>
            {ethicalTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name} - {template.description}
              </option>
            ))}
          </select>

          {selectedTemplate && (
            <div>
              {(() => {
                const template = ethicalTemplates.find(t => t.id === selectedTemplate);
                return template ? (
                  <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '4px' }}>
                    <h5 style={{ marginBottom: '8px', color: '#333' }}>{template.name}</h5>
                    <p style={{ marginBottom: '12px', color: '#666', fontStyle: 'italic' }}>
                      {template.description}
                    </p>
                    <div style={{ 
                      background: '#e8f5e8', 
                      padding: '12px', 
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      marginBottom: '12px'
                    }}>
                      {template.template}
                    </div>
                    <div>
                      <strong>Ethical Guidelines:</strong>
                      <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                        {template.ethicalGuidelines.map((guideline: string, index: number) => (
                          <li key={index} style={{ color: '#666', fontSize: '14px' }}>{guideline}</li>
                        ))}
                      </ul>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <strong>Tags:</strong>
                      <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {template.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            style={{
                              padding: '2px 8px',
                              background: '#007bff',
                              color: 'white',
                              borderRadius: '12px',
                              fontSize: '12px',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h4 style={{ color: '#333', marginBottom: '12px' }}>⚡ Quick Actions</h4>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {promptContent && (
            <button
              onClick={() => analyzeBias(promptContent)}
              disabled={loading}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 16px',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {loading ? '⏳' : '🔍'} {loading ? 'Analyzing...' : 'Re-analyze Bias'}
            </button>
          )}
          <button
            onClick={fetchEthicalTemplates}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            🔄 Refresh Templates
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponsibleAIDashboard;