import { useState } from 'react';
import { generateAIContent } from '../../utils/api';
import { AIConfig } from '../../types/ai';
import AIManagerDashboard from './components/AIManagerDashboard';
import WorkflowBuilder from './components/WorkflowBuilder';
import { MultimodalInput } from './components/MultimodalInput';

type TabId = 'overview' | 'manager' | 'workflow' | 'multimodal';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: '🛠️' },
  { id: 'manager', label: 'AI Manager', icon: '🤖' },
  { id: 'workflow', label: 'Workflow Builder', icon: '⚙️' },
  { id: 'multimodal', label: 'Multimodal', icon: '🎨' },
];

interface GeneratePayload {
  prompt: string;
  config: AIConfig;
}

const OVERVIEW_CARDS = [
  { id: 'manager' as TabId, icon: '🤖', title: 'AI Manager', desc: 'Monitor model status, view execution logs, and track system performance metrics.' },
  { id: 'workflow' as TabId, icon: '⚙️', title: 'Workflow Builder', desc: 'Design and execute multi-step AI pipelines with no-code/low-code orchestration.' },
  { id: 'multimodal' as TabId, icon: '🎨', title: 'Multimodal Input', desc: 'Combine text, images, audio, and video in a unified AI generation workflow.' },
];

export function AIToolkitPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [generateResult, setGenerateResult] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredCardId, setHoveredCardId] = useState<TabId | null>(null);

  const handleGenerate = async (payload: GeneratePayload) => {
    setIsGenerating(true);
    setGenerateResult(null);
    try {
      const response = await generateAIContent(payload.prompt, payload.config);
      if (response.success && response.data) {
        setGenerateResult(response.data.text || 'Content generated successfully.');
      } else {
        setGenerateResult(`Error: ${response.error || 'Unknown error'}`);
      }
    } catch (error) {
      setGenerateResult('An error occurred during content generation.');
      console.error('Generation API call failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '8px' }}>🛠️ Advanced AI Toolkit</h1>
      <p style={{ color: '#6c757d', marginBottom: '24px' }}>
        Explore multimodal AI integration, task chaining, and workflow automation.
      </p>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '2px solid #e9ecef', marginBottom: '24px' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? '600' : '400',
              color: activeTab === tab.id ? '#007bff' : '#495057',
              borderBottom: activeTab === tab.id ? '2px solid #007bff' : '2px solid transparent',
              marginBottom: '-2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            {OVERVIEW_CARDS.map(card => (
              <div
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                style={{
                  border: `1px solid ${hoveredCardId === card.id ? '#007bff' : '#e9ecef'}`,
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  boxShadow: hoveredCardId === card.id ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'box-shadow 0.2s, border-color 0.2s',
                }}
              >
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{card.icon}</div>
                <h3 style={{ margin: '0 0 8px 0', color: '#212529' }}>{card.title}</h3>
                <p style={{ margin: 0, color: '#6c757d', fontSize: '14px', lineHeight: '1.5' }}>{card.desc}</p>
              </div>
            ))}
          </div>

          {/* Quick Generate */}
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e9ecef', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0 }}>⚡ Quick Generate</h3>
            <p style={{ color: '#6c757d', marginBottom: '16px', fontSize: '14px' }}>
              Try a quick AI content generation with GPT-4.
            </p>
            <button
              onClick={() => handleGenerate({
                prompt: 'Generate a creative headline for a tech blog post about AI orchestration.',
                config: { model: 'GPT-4', temperature: 0.7 },
              })}
              disabled={isGenerating}
              style={{
                padding: '10px 20px',
                backgroundColor: isGenerating ? '#6c757d' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              {isGenerating ? '⏳ Generating…' : '🚀 Generate Example'}
            </button>
            {generateResult && (
              <div style={{
                marginTop: '16px',
                padding: '12px 16px',
                backgroundColor: generateResult.startsWith('Error') ? '#f8d7da' : '#d4edda',
                borderRadius: '6px',
                color: generateResult.startsWith('Error') ? '#721c24' : '#155724',
                fontSize: '14px',
                lineHeight: '1.6',
              }}>
                {generateResult}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'manager' && <AIManagerDashboard />}

      {activeTab === 'workflow' && <WorkflowBuilder />}

      {activeTab === 'multimodal' && (
        <div>
          <MultimodalInput onGenerate={(prompt, config) => handleGenerate({ prompt, config: config as AIConfig })} />
          {generateResult && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: generateResult.startsWith('Error') ? '#f8d7da' : '#d4edda',
              borderRadius: '6px',
              color: generateResult.startsWith('Error') ? '#721c24' : '#155724',
              fontSize: '14px',
            }}>
              {generateResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
