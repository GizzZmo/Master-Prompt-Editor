import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePromptManagement } from '../../hooks/usePromptManagement';
import { PromptInputArea } from './components/PromptInputArea';
import { PromptVersioningPanel } from './components/PromptVersioningPanel';

export function PromptEditorPage() {
  const { promptId } = useParams<{ promptId: string }>();
  const { activePrompt, isLoading, error } = usePromptManagement(promptId || null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (newContent: string) => {
    if (!activePrompt) return;
    setIsSaving(true);
    // Add save logic here
    console.log('Saving content:', newContent);
    setIsSaving(false);
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
      <h2>{activePrompt.name}</h2>
      <p>{activePrompt.description}</p>
      <div>
        <PromptInputArea onSave={handleSave} initialContent={activePrompt.content} />
        <PromptVersioningPanel versions={activePrompt.versions} />
      </div>
    </div>
  );
}
