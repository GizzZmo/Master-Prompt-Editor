import React, { useState } from 'react';
import VotingComponent from '../components/ui/VotingComponent';
import CommentsSection from '../components/ui/CommentsSection';
import ResponsibleAIDashboard from '../components/ui/ResponsibleAIDashboard';
import MultimodalInputStub from '../components/ui/MultimodalInputStub';

const DemoPage: React.FC = () => {
  const [currentPromptContent, setCurrentPromptContent] = useState(
    "Write a creative story about a young programmer who discovers they can debug reality like code. The story should be inspiring and show how technology can be used to solve real-world problems."
  );
  const [activeTab, setActiveTab] = useState<'voting' | 'comments' | 'responsible-ai' | 'multimodal'>('voting');

  const mockPromptId = 'demo-prompt-123';
  const mockUserId = 'demo-user-1';

  const tabs = [
    { id: 'voting', label: '🗳️ Voting', component: 'voting' },
    { id: 'comments', label: '💬 Comments', component: 'comments' },
    { id: 'responsible-ai', label: '🛡️ Responsible AI', component: 'responsible-ai' },
    { id: 'multimodal', label: '🎭 Multimodal', component: 'multimodal' },
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(90deg, #4CAF50, #45a049)',
          color: 'white',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>
            🤖 Master Prompt Editor Demo
          </h1>
          <p style={{ margin: '8px 0 0', fontSize: '1.1rem', opacity: 0.9 }}>
            Showcasing collaborative, responsible AI, and multimodal features
          </p>
        </div>

        {/* Sample Prompt Display */}
        <div style={{ padding: '24px', background: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
          <h3 style={{ marginTop: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📝 Sample Prompt
          </h3>
          <div style={{
            background: 'white',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontFamily: 'monospace',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            {currentPromptContent}
          </div>
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', color: '#666' }}>Prompt ID:</span>
            <code style={{ background: '#e3f2fd', padding: '2px 8px', borderRadius: '4px' }}>
              {mockPromptId}
            </code>
            <span style={{ fontWeight: 'bold', color: '#666', marginLeft: '16px' }}>User ID:</span>
            <code style={{ background: '#e8f5e8', padding: '2px 8px', borderRadius: '4px' }}>
              {mockUserId}
            </code>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          background: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0'
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '16px',
                border: 'none',
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? '#4CAF50' : '#666',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                fontSize: '14px',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '3px solid #4CAF50' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: '24px' }}>
          {activeTab === 'voting' && (
            <div>
              <h3 style={{ marginTop: 0, color: '#333', marginBottom: '20px' }}>
                🗳️ Community Voting System
              </h3>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Vote on prompts to help the community identify high-quality content. 
                Your votes contribute to the overall prompt rating.
              </p>
              <VotingComponent 
                promptId={mockPromptId}
                currentUserId={mockUserId}
                onVoteChanged={(summary) => {
                  console.log('Vote changed:', summary);
                }}
              />
              <div style={{ 
                marginTop: '24px', 
                padding: '16px', 
                background: '#e3f2fd', 
                borderRadius: '8px',
                border: '1px solid #2196F3'
              }}>
                <strong style={{ color: '#1976D2' }}>💡 Demo Note:</strong>
                <span style={{ color: '#1976D2', marginLeft: '8px' }}>
                  This voting system connects to the collaboration API. In a real implementation, 
                  votes would be persistent and tied to user authentication.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div>
              <h3 style={{ marginTop: 0, color: '#333', marginBottom: '20px' }}>
                💬 Collaborative Comments & Annotations
              </h3>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Add comments and engage in discussions about prompts. Support for threaded replies and annotations.
              </p>
              <CommentsSection 
                promptId={mockPromptId}
                currentUserId={mockUserId}
              />
            </div>
          )}

          {activeTab === 'responsible-ai' && (
            <div>
              <h3 style={{ marginTop: 0, color: '#333', marginBottom: '20px' }}>
                🛡️ Responsible AI Analysis
              </h3>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Automated bias detection, ethical compliance checking, and responsible AI templates 
                to ensure your prompts follow best practices.
              </p>
              <ResponsibleAIDashboard promptContent={currentPromptContent} />
            </div>
          )}

          {activeTab === 'multimodal' && (
            <div>
              <h3 style={{ marginTop: 0, color: '#333', marginBottom: '20px' }}>
                🎭 Multimodal Input Processing
              </h3>
              <p style={{ color: '#666', marginBottom: '24px' }}>
                Handle text, image, audio, and video inputs in your prompts. Generate templates 
                and validate inputs for multimodal AI processing.
              </p>
              <MultimodalInputStub 
                onInputsChange={(inputs) => {
                  console.log('Multimodal inputs changed:', inputs);
                }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '24px',
          background: '#f8f9fa',
          borderTop: '1px solid #e0e0e0',
          textAlign: 'center',
          color: '#666'
        }}>
          <p style={{ margin: 0 }}>
            🚀 <strong>Master Prompt Editor</strong> - Building the future of AI collaboration
          </p>
          <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
            This demo showcases the key features. Full implementation would include authentication, 
            persistence, real file uploads, and production-ready AI integrations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;