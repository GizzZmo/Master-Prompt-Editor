import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { usePromptManagement } from '../../hooks/usePromptManagement';
import { PromptInputArea } from './components/PromptInputArea';
import { PromptVersioningPanel } from './components/PromptVersioningPanel';
import { PromptPlayground } from './components/PromptPlayground';
import { useToast } from '../../context/toastContextHelpers';
import SearchBar from '../../components/ui/SearchBar';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { exportSinglePrompt } from '../../utils/exportImport';
import { PromptVersion } from '../../types/prompt';

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
  const [workingVersions, setWorkingVersions] = useState<PromptVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>('');
  const [diffTarget, setDiffTarget] = useState<PromptVersion | null>(null);
  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  /**
   * Synchronize local content state with the active prompt when it changes.
   * This ensures the editor displays the latest saved content.
   */
  useEffect(() => {
    if (activePrompt) {
      setCurrentContent(activePrompt.content);
      setWorkingVersions(activePrompt.versions);
      setCurrentVersion(activePrompt.version);
      setDiffTarget(null);
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
      const bumpPatch = (version: string) => {
        const parts = version.split('.').map((part) => Number.parseInt(part, 10));
        if (parts.length === 3 && parts.every((n) => Number.isInteger(n))) {
          const [major, minor, patch] = parts;
          return `${major}.${minor}.${patch + 1}`;
        }
        return `${version}.1`;
      };
      const nextVersion = bumpPatch(currentVersion || activePrompt.version || '1.0.0');
      const newVersion: PromptVersion = {
        id: `v-${Date.now()}`,
        promptId: activePrompt.id,
        version: nextVersion,
        content: newContent,
        createdAt: new Date().toISOString(),
        metadata: { rationale: 'Manual save from editor' },
      };
      setWorkingVersions((prev) => [newVersion, ...prev]);
      setCurrentVersion(nextVersion);
      setDiffTarget(newVersion);
      showToast('Prompt saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save prompt', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [activePrompt, showToast, currentVersion]);

  /**
   * Updates the current content state when user edits the prompt.
   * This allows real-time testing in the playground without saving.
   */
  const handleContentChange = (content: string) => {
    setCurrentContent(content);
  };

  /**
   * Roll back to a previous version in-memory with human confirmation.
   */
  const handleRollback = (version: string) => {
    const targetVersion = workingVersions.find((v) => v.version === version);
    if (!targetVersion) {
      showToast('Version not found', 'error');
      return;
    }
    if (window.confirm(`Rollback to version ${version}? Unsaved changes will be replaced.`)) {
      setCurrentContent(targetVersion.content);
      setCurrentVersion(version);
      setDiffTarget(targetVersion);
      showToast(`Rolled back to version ${version}`, 'info');
    }
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

  const diffRows = useMemo(() => {
    if (!diffTarget) return [];
    const currentLines = currentContent.split('\n');
    const targetLines = diffTarget.content.split('\n');
    const length = Math.max(currentLines.length, targetLines.length);
    return Array.from({ length }).map((_, idx) => ({
      line: idx + 1,
      current: currentLines[idx] ?? '',
      target: targetLines[idx] ?? '',
      changed: (currentLines[idx] ?? '') !== (targetLines[idx] ?? ''),
    }));
  }, [currentContent, diffTarget]);

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
              currentVersion={currentVersion || activePrompt.version}
              versionHistory={workingVersions.map(v => ({
                version: v.version,
                date: v.createdAt,
                rationale: (v.metadata?.rationale as string) || 'No rationale provided'
              }))}
              onRollback={handleRollback}
              onViewDiff={(version) => {
                const target = workingVersions.find((v) => v.version === version) ?? null;
                setDiffTarget(target);
              }}
            />
            {diffTarget && (
              <div style={{ marginTop: '15px', padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px', background: '#fafafa' }}>
                <h4 style={{ marginTop: 0 }}>Diff vs. version {diffTarget.version}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontFamily: 'monospace', fontSize: '0.85em' }}>
                  <div>
                    <strong>Current</strong>
                    <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                      {diffRows.map((row) => (
                        <div key={`curr-${row.line}`} style={{ background: row.changed ? '#fff8e1' : 'transparent' }}>
                          <span style={{ color: '#999' }}>{row.line.toString().padStart(3, ' ')} </span>
                          <span>{row.current}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Selected ({diffTarget.version})</strong>
                    <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                      {diffRows.map((row) => (
                        <div key={`old-${row.line}`} style={{ background: row.changed ? '#ffeceb' : 'transparent' }}>
                          <span style={{ color: '#999' }}>{row.line.toString().padStart(3, ' ')} </span>
                          <span>{row.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
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
