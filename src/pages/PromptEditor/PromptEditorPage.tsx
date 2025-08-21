import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePromptManagement } from '../../hooks/usePromptManagement';
import { PromptInputArea } from './components/PromptInputArea';
import { PromptVersioningPanel } from './components/PromptVersioningPanel';
import { PromptPlayground } from './components/PromptPlayground';

/**
 * PromptEditorPage provides a comprehensive prompt editing experience with integrated testing.
 * Features a two-column layout:
 * - Left: Prompt editor with versioning controls
 * - Right: Interactive chat playground for testing prompts
 * 
 * This design allows users to iteratively develop and test prompts in real-time.
 */
export function PromptEditorPage() {
  const { promptId } = useParams<{ promptId: string }>();
  const { activePrompt, isLoading, error } = usePromptManagement(promptId || null);
  
  // Local state for save operations
  const [isSaving, setIsSaving] = useState(false);
  // Current content being edited (may differ from saved activePrompt.content)
  const [currentContent, setCurrentContent] = useState<string>('');

  /**
   * Synchronize local content state with the active prompt when it changes.
   * This ensures the editor displays the latest saved content.
   */
  React.useEffect(() => {
    if (activePrompt) {
      setCurrentContent(activePrompt.content);
    }
  }, [activePrompt]);

  /**
   * Handles saving prompt content changes.
   * TODO: Implement actual API call to persist changes to backend
   */
  const handleSave = async (newContent: string) => {
    if (!activePrompt) return;
    setIsSaving(true);
    // Add save logic here
    console.log('Saving content:', newContent);
    setIsSaving(false);
  };

  /**
   * Updates the current content state when user edits the prompt.
   * This allows real-time testing in the playground without saving.
   */
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
    <div>
      {/* Two-column grid layout for integrated prompt editing and testing */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: '100%' }}>
      {/* Left Column - Prompt Editor and Version Management */}
      <div>
        <h2>{activePrompt.name}</h2>
        <p>{activePrompt.description}</p>
        
        {/* Prompt Content Editor Section */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Prompt Content</h3>
          <PromptInputArea 
            promptContent={currentContent}
            onPromptContentChange={handleContentChange} 
          />
          {/* Save button with loading state */}
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
        
        {/* Version History and Management */}
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
      
      {/* Right Column - Interactive Chat Playground */}
      <div>
        <h3>Chat Playground</h3>
        {/* Explanatory text for the playground feature */}
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
          Test your prompt by having a conversation with the AI. Your chat history will be saved and restored when you return.
        </p>
        {/* Pass current content to playground for real-time testing */}
        <PromptPlayground promptContent={currentContent} />
      </div>
    </div>
    </div>
  );
}
