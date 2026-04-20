import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePromptManagement } from '../../hooks/usePromptManagement';
import { PromptInputArea } from './components/PromptInputArea';
import { PromptVersioningPanel } from './components/PromptVersioningPanel';
import { PromptPlayground } from './components/PromptPlayground';
import { useToast } from '../../context/toastContextHelpers';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { exportSinglePrompt } from '../../utils/exportImport';
import { PromptVersion, Prompt } from '../../types/prompt';

/**
 * PromptEditorPage provides a comprehensive prompt editing experience.
 * Layout:
 * - Left panel: Prompt browser (list of prompts + "New Prompt" form)
 * - Center: Prompt editor with versioning controls and diff view
 * - Right: Interactive chat playground for testing prompts
 */
export function PromptEditorPage() {
  const { prompts, activePrompt, isLoading, error, selectPrompt, createPrompt } = usePromptManagement(null);
  const { showToast } = useToast();

  // Local state for save operations
  const [isSaving, setIsSaving] = useState(false);
  const [currentContent, setCurrentContent] = useState<string>('');
  const [workingVersions, setWorkingVersions] = useState<PromptVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<string>('');
  const [diffTarget, setDiffTarget] = useState<PromptVersion | null>(null);

  // New prompt creation form state
  const [showNewPromptForm, setShowNewPromptForm] = useState(false);
  const [newPromptName, setNewPromptName] = useState('');
  const [newPromptDescription, setNewPromptDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Search in prompt list
  const [listSearch, setListSearch] = useState('');

  /** Synchronize local content state with the active prompt when it changes. */
  useEffect(() => {
    if (activePrompt) {
      setCurrentContent(activePrompt.content);
      setWorkingVersions(activePrompt.versions);
      setCurrentVersion(activePrompt.version);
      setDiffTarget(null);
      setShowNewPromptForm(false);
    }
  }, [activePrompt]);

  /** Handles saving prompt content changes. */
  const handleSave = useCallback(async (newContent: string) => {
    if (!activePrompt) return;
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
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
    } catch {
      showToast('Failed to save prompt', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [activePrompt, showToast, currentVersion]);

  const handleContentChange = (content: string) => {
    setCurrentContent(content);
  };

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

  const handleExport = () => {
    if (!activePrompt) return;
    try {
      exportSinglePrompt(activePrompt);
      showToast('Prompt exported successfully!', 'success');
    } catch {
      showToast('Failed to export prompt', 'error');
    }
  };

  const handleCreatePrompt = async () => {
    if (!newPromptName.trim()) {
      showToast('Please enter a prompt name', 'warning');
      return;
    }
    setIsCreating(true);
    try {
      const created = await createPrompt({
        name: newPromptName.trim(),
        description: newPromptDescription.trim() || 'New prompt',
        content: '',
        tags: [],
      });
      setNewPromptName('');
      setNewPromptDescription('');
      setShowNewPromptForm(false);
      showToast(`Created prompt: ${created.name}`, 'success');
    } catch {
      showToast('Failed to create prompt', 'error');
    } finally {
      setIsCreating(false);
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

  /** Keyboard shortcuts handler */
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

  const filteredPrompts = useMemo(() => {
    if (!listSearch.trim()) return prompts;
    const q = listSearch.toLowerCase();
    return prompts.filter(
      (p: Prompt) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }, [prompts, listSearch]);

  return (
    <div style={{ display: 'flex', gap: '0', height: 'calc(100vh - 120px)' }}>
      {/* Left Panel – Prompt Browser */}
      <div style={{
        width: '240px',
        minWidth: '200px',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f9fa',
        overflowY: 'auto',
        flexShrink: 0,
      }}>
        <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
          <button
            onClick={() => { setShowNewPromptForm(v => !v); }}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '13px',
              marginBottom: '8px',
            }}
          >
            + New Prompt
          </button>
          <input
            type="text"
            value={listSearch}
            onChange={e => setListSearch(e.target.value)}
            placeholder="Search prompts…"
            style={{
              width: '100%',
              padding: '6px 8px',
              border: '1px solid #dee2e6',
              borderRadius: '4px',
              fontSize: '13px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* New Prompt Form */}
        {showNewPromptForm && (
          <div style={{ padding: '12px', borderBottom: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
            <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '13px' }}>Create New Prompt</p>
            <input
              type="text"
              value={newPromptName}
              onChange={e => setNewPromptName(e.target.value)}
              placeholder="Name *"
              style={{ width: '100%', padding: '6px', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '13px', marginBottom: '6px', boxSizing: 'border-box' }}
            />
            <input
              type="text"
              value={newPromptDescription}
              onChange={e => setNewPromptDescription(e.target.value)}
              placeholder="Description (optional)"
              style={{ width: '100%', padding: '6px', border: '1px solid #dee2e6', borderRadius: '4px', fontSize: '13px', marginBottom: '8px', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={handleCreatePrompt}
                disabled={isCreating}
                style={{ flex: 1, padding: '6px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: isCreating ? 'not-allowed' : 'pointer', fontSize: '12px' }}
              >
                {isCreating ? 'Creating…' : 'Create'}
              </button>
              <button
                onClick={() => { setShowNewPromptForm(false); setNewPromptName(''); setNewPromptDescription(''); }}
                style={{ flex: 1, padding: '6px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Prompt List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {isLoading && (
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <LoadingSpinner size="small" text="Loading…" />
            </div>
          )}
          {!isLoading && filteredPrompts.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d', fontSize: '13px' }}>
              {prompts.length === 0 ? 'No prompts yet. Create one!' : 'No prompts match your search.'}
            </div>
          )}
          {filteredPrompts.map((prompt: Prompt) => (
            <div
              key={prompt.id}
              onClick={() => selectPrompt(prompt)}
              style={{
                padding: '10px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid #e9ecef',
                backgroundColor: activePrompt?.id === prompt.id ? '#e3f2fd' : 'transparent',
                borderLeft: activePrompt?.id === prompt.id ? '3px solid #007bff' : '3px solid transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (activePrompt?.id !== prompt.id) e.currentTarget.style.backgroundColor = '#f0f0f0'; }}
              onMouseLeave={e => { if (activePrompt?.id !== prompt.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <div style={{ fontWeight: '600', fontSize: '13px', color: '#212529', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {prompt.name}
              </div>
              <div style={{ fontSize: '11px', color: '#6c757d', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {prompt.description}
              </div>
              <div style={{ fontSize: '10px', color: '#adb5bd', marginTop: '2px' }}>v{prompt.version}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor Area */}
      {!activePrompt ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d', flexDirection: 'column', gap: '12px' }}>
          {isLoading ? (
            <LoadingSpinner size="large" text="Loading prompts…" />
          ) : error ? (
            <div style={{ textAlign: 'center', color: '#dc3545' }}>
              <p>⚠️ {error}</p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '48px' }}>📝</div>
              <h3 style={{ margin: 0 }}>Select a Prompt</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>Choose a prompt from the list or create a new one.</p>
            </>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '20px' }}>
          {/* Header with actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <div>
              <h2 style={{ margin: '0 0 4px 0', color: '#333' }}>{activePrompt.name}</h2>
              <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>{activePrompt.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleExport}
                style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
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

          {/* Two-column grid layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', flex: 1, minHeight: 0 }}>
            {/* Left Column – Prompt Editor and Version Management */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Prompt Content</h3>
                <div style={{ flex: 1 }}>
                  <PromptInputArea
                    promptContent={currentContent}
                    onPromptContentChange={handleContentChange}
                  />
                </div>
              </div>

              {/* Version Management */}
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

            {/* Right Column – Chat Playground */}
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <h3 style={{ margin: '0 0 10px 0' }}>Chat Playground</h3>
              <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '15px', margin: '0 0 15px 0' }}>
                Test your prompt by having a conversation with the AI. Changes are reflected in real-time.
              </p>
              <div style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
                <PromptPlayground promptContent={currentContent} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


