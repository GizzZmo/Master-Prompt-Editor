// FIX: Removed unused 'Button' import
import React from 'react';

interface PromptInputAreaProps {
  // FIX: Replaced 'any' with a specific function type
  promptContent: string;
  onPromptContentChange: (content: string) => void;
}

export function PromptInputArea({ promptContent, onPromptContentChange }: PromptInputAreaProps) {
  return (
    <div>
      <textarea
        value={promptContent}
        onChange={(e) => onPromptContentChange(e.target.value)}
        rows={10}
        style={{ width: '100%', minHeight: '150px' }}
        placeholder="Enter your prompt content here..."
      />
      {/* Save button moved to parent PromptEditorPage for logic centralization */}
    </div>
  );
}
