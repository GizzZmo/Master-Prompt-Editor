import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { usePromptManagement } from '../../hooks/usePromptManagement';
import { PromptInputArea } from './components/PromptInputArea';
import { PromptVersioningPanel } from './components/PromptVersioningPanel';
import { PromptPlayground } from './components/PromptPlayground';
import { useToast } from '../../context/ToastContext';
import SearchBar from '../../components/ui/SearchBar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { exportSinglePrompt } from '../../utils/exportImport';

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
  const { showToast } = useToast();
  
  // Local state for save operations
  const [isSaving, setIsSaving] = useState(false);
  // Current content being edited (may differ from saved activePrompt.content)
  const [currentContent, setCurrentContent] = useState<string>('');
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  /**
   * Synchronize local content state with the active prompt when it changes.
   * This ensures the editor displays the latest saved content.
   */
  useEffect(() => {
    if (activePrompt) {
      setCurrentContent(activePrompt.content);
    }
  }, [activePrompt]);

  /**
   * Handles saving prompt content changes with keyboard shortcut support.
   */
  const handleSave = useCallback(async (newContent: string) => {
    if (!activePrompt) return;
    setIsSaving(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving content:', newContent);
      showToast('Prompt saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save prompt', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [activePrompt, showToast]);

  /**
   * Updates the current content state when user edits the prompt.
   * This allows real-time testing in the playground without saving.
   */
  const handleContentChange = (content: string) => {
    setCurrentContent(content);
  };

  /**
   * Handle export functionality
   */
  const handleExport = () => {
    if (!activePrompt) return;
    try {
      exportSinglePrompt(activePrompt);
      showToast('Prompt exported successfully!', 'success');
    } catch (error) {
      showToast('Failed to export prompt', 'error');
    }
  };

  /**
   * Handle search functionality
   */
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // TODO: Implement actual search logic with backend
    if (query) {
      showToast(`Searching for: ${query}`, 'info');
    }
  };

  /**
   * Keyboard shortcuts handler
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        handleSave(currentContent);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentContent, handleSave]);

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading prompt..." />;
  }

  if (error) {
    return (
      <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>
        <h3>Error Loading Prompt</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!activePrompt) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>No Prompt Selected</h3>
        <p>Select a prompt to begin editing, or create a new one.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header with search and actions */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '0 0 20px 0',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ flex: 1, maxWidth: '400px' }}>
          <SearchBar
            placeholder="Search prompts..."
            onSearch={handleSearch}
            value={searchQuery}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleExport}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            title="Export this prompt (JSON)"
          >
            📤 Export
          </button>
          <button
            onClick={() => handleSave(currentContent)}
            disabled={isSaving}
            style={{
              padding: '8px 16px',
              backgroundColor: isSaving ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
            title="Save prompt (Ctrl+S)"
          >
            {isSaving && <LoadingSpinner size="small" inline />}
            💾 {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Two-column grid layout for integrated prompt editing and testing */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: 'calc(100vh - 200px)' }}>
        {/* Left Column - Prompt Editor and Version Management */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '15px' }}>
            <h2 style={{ margin: '0 0 5px 0', color: '#333' }}>{activePrompt.name}</h2>
            <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>{activePrompt.description}</p>
          </div>
          
          {/* Prompt Content Editor Section */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Prompt Content</h3>
            <div style={{ flex: 1 }}>
              <PromptInputArea 
                promptContent={currentContent}
                onPromptContentChange={handleContentChange} 
              />
            </div>
          </div>
          
          {/* Version Management Panel */}
          <div>
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
        </div>

        {/* Right Column - Interactive Chat Playground */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Chat Playground</h3>
          <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px' }}>
            Test your prompt by having a conversation with the AI. Changes are reflected in real-time.
          </p>
          <div style={{ flex: 1 }}>
            <PromptPlayground promptContent={currentContent} />
          </div>
        </div>
      </div>
    </div>
  );
}
