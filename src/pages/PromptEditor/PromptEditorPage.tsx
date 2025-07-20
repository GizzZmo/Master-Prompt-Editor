import React, { useState, useEffect } from 'react';
import PromptInputArea from './components/PromptInputArea';
import PromptVersioningPanel from './components/PromptVersioningPanel';
import { PromptPlayground } from './components/PromptPlayground'; // Named import
import PromptOptimizationSettings from './components/PromptOptimizationSettings';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Prompt, PromptCategory, PromptVersion } from '../../types/prompt'; // Import PromptCategory and PromptVersion
import { usePromptManagement } from '../../hooks/usePromptManagement';

const PromptEditorPage: React.FC = () => {
  const [promptsList, setPromptsList] = useState<Prompt[]>([]);
  const [newPromptName, setNewPromptName] = useState<string>('');
  const [newPromptCategory, setNewPromptCategory] = useState<PromptCategory>('general'); // Use PromptCategory type
  const [newPromptDomain, setNewPromptDomain] = useState<string>('');

  const { selectedPrompt, isLoading, error, fetchAllPrompts, fetchPrompt, createPrompt, addVersion, rollbackToVersion } = usePromptManagement(); // Destructure correctly
  const [promptContent, setPromptContent] = useState<string>('');

  // Effect to fetch all prompts on initial load and when a prompt is created/updated/deleted
  useEffect(() => {
    fetchAllPrompts();
  }, [fetchAllPrompts, selectedPrompt]); // Re-fetch all prompts when selectedPrompt changes (e.g., after save/create)

  // Effect to update promptContent when selectedPrompt changes
  useEffect(() => {
    if (selectedPrompt) {
      const currentVersionData = selectedPrompt.versions.find(v => v.version === selectedPrompt.currentVersion);
      setPromptContent(currentVersionData?.content || '');
    } else {
      setPromptContent(''); // Clear content for new prompt creation
    }
  }, [selectedPrompt]);

  const handlePromptSelect = async (promptId: string) => {
    await fetchPrompt(promptId);
  };

  const handleSavePrompt = async () => {
    if (isLoading) return; // Prevent multiple saves

    if (selectedPrompt) {
      const currentVersionData = selectedPrompt.versions.find(v => v.version === selectedPrompt.currentVersion);
      const currentContent = currentVersionData?.content;

      if (promptContent === currentContent) {
          alert('No changes detected in prompt content. Not creating a new version.');
          return;
      }
      // Add a new version
      await addVersion(selectedPrompt.id, promptContent, {
        expectedOutcome: currentVersionData?.metadata.expectedOutcome || '', // Preserve previous metadata or prompt for new
        rationale: 'Manual edit from editor, new version created',
        author: 'current_user' // Replace with actual user info
      });

    } else { // Create a new prompt
      if (!newPromptName.trim() || !promptContent.trim()) {
        alert('Please provide a name, category, domain and initial content for the new prompt.');
        return;
      }
      await createPrompt(newPromptName, promptContent, newPromptCategory, newPromptDomain);
      // Reset new prompt fields after creation
      setNewPromptName('');
      setNewPromptCategory('general');
      setNewPromptDomain('');
    }
  };

  const handleRollback = async (version: string) => {
    if (selectedPrompt) {
      await rollbackToVersion(selectedPrompt.id, version);
    }
  };

  const handleCreateNewPromptClick = () => {
    // Clear selected prompt and reset form for new prompt creation
    fetchPrompt(''); // This will set selectedPrompt to null
    setNewPromptName('');
    setNewPromptCategory('general');
    setNewPromptDomain('');
    setPromptContent('');
  };

  return (
    <div className="prompt-editor-page">
      <h2>Master Prompt Editor</h2>
      <p>This is the central nervous system for sophisticated AI interactions, offering robust prompt management, advanced engineering techniques, automated optimization, and collaborative workflows. (Section 2)</p>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1, border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3>Prompt Repository</h3>
          <p>Centralized repository for all your prompts, categorized by purpose and domain. (2.1)</p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {promptsList.length === 0 && !isLoading && !error ? (
              <p>No prompts found. Create one!</p>
            ) : isLoading ? (
              <p>Loading prompts...</p>
            ) : error ? (
              <p style={{ color: 'red' }}>Error loading prompts: {error}</p>
            ) : (
              promptsList.map(p => (
                <li key={p.id} style={{ marginBottom: '5px' }}>
                  <a href="#" onClick={(e) => { e.preventDefault(); handlePromptSelect(p.id); }}>
                    {p.name} (v{p.currentVersion})
                  </a>
                </li>
              ))
            )}
            <li><Button onClick={handleCreateNewPromptClick} style={{ marginTop: '10px' }}>Create New Prompt</Button></li>
          </ul>
        </div>

        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white' }}>
            <h3>Prompt Design Area {selectedPrompt ? `(${selectedPrompt.name})` : '(New Prompt)'}</h3>
            {!selectedPrompt && (
              <>
                <Input label="New Prompt Name" value={newPromptName} onChange={(e) => setNewPromptName(e.target.value)} placeholder="e.g., 'marketing-email-draft'" />
                <div style={{marginBottom: '15px'}}>
                  <label htmlFor="new-prompt-category">Category:</label>
                  <select id="new-prompt-category" value={newPromptCategory} onChange={(e) => setNewPromptCategory(e.target.value as PromptCategory)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}>
                    <option value="general">General</option>
                    <option value="marketing">Marketing</option>
                    <option value="human-resources">Human Resources</option>
                    <option value="software-development">Software Development</option>
                  </select>
                </div>
                <Input label="Domain" value={newPromptDomain} onChange={(e) => setNewPromptDomain(e.target.value)} placeholder="e.g., 'customer-support'" />
              </>
            )}
            <PromptInputArea
              promptContent={promptContent}
              onPromptContentChange={setPromptContent}
            />
            {isLoading && <p>Processing...</p>}
            {error && <p style={{color: 'red'}}>Error: {error}</p>}
            <Button onClick={handleSavePrompt} style={{ marginTop: '10px' }}>
              {selectedPrompt ? 'Save New Version' : 'Create Prompt'}
            </Button>
          </div>

          <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white' }}>
            <h3>Prompt Playground</h3>
            <PromptPlayground promptContent={promptContent} />
            <p>Intuitive graphical user interfaces allow non-technical users to interact with, modify, and test prompts in a safe, controlled environment. (2.1)</p>
          </div>

          <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white' }}>
            <h3>Automated Optimization & Evaluation</h3>
            <PromptOptimizationSettings promptId={selectedPrompt?.id || ''} />
            <p>Systematically test different prompt variations and compare their outputs and performance, leveraging meta-learning, gradient-based optimization, and DSPy integration. (2.3)</p>
          </div>
        </div>

        <div style={{ flex: 1, border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3>Prompt Versioning & History</h3>
          {selectedPrompt ? (
            <PromptVersioningPanel
              currentVersion={selectedPrompt.currentVersion}
              versionHistory={selectedPrompt.versions.map(v => ({ version: v.version, date: v.metadata.lastModified, rationale: v.metadata.rationale }))}
              onRollback={handleRollback}
            />
          ) : (
            <p>Select a prompt to view its version history.</p>
          )}
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
            Robust prompt management and versioning system with semantic versioning and rollback capabilities. (2.1)
          </p>
          <p style={{ fontSize: '0.9em', color: '#666' }}>
            Comprehensive metadata and documentation tracked for each prompt version. (2.1)
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromptEditorPage;
