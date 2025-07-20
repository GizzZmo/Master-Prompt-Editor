import React, { useState, useEffect } from 'react';
import PromptInputArea from './components/PromptInputArea';
import PromptVersioningPanel from './components/PromptVersioningPanel';
import PromptPlayground from './components/PromptPlayground';
import PromptOptimizationSettings from './components/PromptOptimizationSettings';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Prompt } from '../../types/prompt';
import { usePromptManagement } from '../../hooks/usePromptManagement';
import { getPrompts } from '../../utils/api';

const PromptEditorPage: React.FC = () => {
  const [promptsList, setPromptsList] = useState<Prompt[]>([]);
  const [newPromptName, setNewPromptName] = useState<string>('');
  const [newPromptCategory, setNewPromptCategory] = useState<Prompt['category']>('general');
  const [newPromptDomain, setNewPromptDomain] = useState<string>('');

  const { prompt: selectedPrompt, loading, error, fetchPrompt, createPrompt, addVersion, rollbackToVersion } = usePromptManagement();
  const [promptContent, setPromptContent] = useState<string>('');

  useEffect(() => {
    if (selectedPrompt) {
      setPromptContent(selectedPrompt.versions.find(v => v.version === selectedPrompt.currentVersion)?.content || '');
    } else {
      setPromptContent('');
    }
  }, [selectedPrompt]);

  useEffect(() => {
    const fetchAllPrompts = async () => {
      const response = await getPrompts();
      if (response.success && response.data) {
        setPromptsList(response.data);
      } else {
        console.error("Failed to fetch prompts list:", response.error);
      }
    };
    fetchAllPrompts();
  }, [selectedPrompt]);

  const handlePromptSelect = async (promptId: string) => {
    await fetchPrompt(promptId);
  };

  const handleSavePrompt = async () => {
    if (selectedPrompt) {
      const currentContent = selectedPrompt.versions.find(v => v.version === selectedPrompt.currentVersion)?.content;
      if (promptContent === currentContent) {
          alert('No changes detected in prompt content. Not creating a new version.');
          return;
      }

      await addVersion(selectedPrompt.id, promptContent, {
        expectedOutcome: '',
        rationale: 'Manual edit from editor',
        author: 'current_user'
      });
    } else {
      if (!newPromptName.trim() || !promptContent.trim()) {
        alert('Please provide a name and initial content for the new prompt.');
        return;
      }
      await createPrompt(newPromptName, promptContent, newPromptCategory, newPromptDomain);
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
    fetchPrompt('');
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
          <ul>
            {promptsList.map(p => (
              <li key={p.id} style={{ marginBottom: '5px' }}>
                <a href="#" onClick={(e) => { e.preventDefault(); handlePromptSelect(p.id); }}>
                  {p.name} (v{p.currentVersion})
                </a>
              </li>
            ))}
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
                  <select id="new-prompt-category" value={newPromptCategory} onChange={(e) => setNewPromptCategory(e.target.value as Prompt['category'])} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}>
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
            {loading && <p>Saving...</p>}
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
              versionHistory={selectedPrompt.versions.map(v => ({ version: v.version, date: v.metadata.lastModified }))}
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
