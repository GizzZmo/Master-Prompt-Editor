import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePromptManagement } from '../../hooks/usePromptManagement';
import { PromptInputArea } from './components/PromptInputArea';
import { PromptVersioningPanel } from './components/PromptVersioningPanel';
import { PromptPlayground } from './components/PromptPlayground';

export function PromptEditorPage() {
  const { promptId } = useParams<{ promptId: string }>();
  const { activePrompt, isLoading, error } = usePromptManagement(promptId || null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentContent, setCurrentContent] = useState<string>('');

  // Update current content when activePrompt changes
  React.useEffect(() => {
    if (activePrompt) {
      setCurrentContent(activePrompt.content);
    }
  }, [activePrompt]);

  const handleSave = async (newContent: string) => {
    if (!activePrompt) return;
    setIsSaving(true);
    // Add save logic here
    console.log('Saving content:', newContent);
    setIsSaving(false);
  };

  const handleContentChange = (content: string) => {
    setCurrentContent(content);
  };

  if (isLoading) {
    return <div>Loading prompt...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!activePrompt) {
    return <div>Select a prompt to begin.</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100%' }}>
      {/* Left Column - Prompt Editor */}
      <div>
        <h2>{activePrompt.name}</h2>
        <p>{activePrompt.description}</p>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>Prompt Content</h3>
          <PromptInputArea 
            promptContent={currentContent}
            onPromptContentChange={handleContentChange} 
          />
          <button 
            onClick={() => handleSave(currentContent)} 
            disabled={isSaving}
            style={{ 
              marginTop: '10px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '4px',
              cursor: isSaving ? 'not-allowed' : 'pointer'
            }}
          >
            {isSaving ? 'Saving...' : 'Save Prompt'}
          </button>
        </div>
        
        <PromptVersioningPanel 
          currentVersion={activePrompt.version}
          versionHistory={activePrompt.versions.map(v => ({
            version: v.version,
            date: v.createdAt,
            rationale: v.metadata?.rationale as string || 'No rationale provided'
          }))}
          onRollback={(version) => console.log('Rollback to version:', version)}
        />
      </div>
      
      {/* Right Column - Chat Playground */}
      <div>
        <h3>Chat Playground</h3>
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
          Test your prompt by having a conversation with the AI. Your chat history will be saved and restored when you return.
        </p>
        <PromptPlayground promptContent={currentContent} />
      </div>
    </div>
  );
}
