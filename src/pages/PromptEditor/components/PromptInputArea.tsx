// FIX: Removed unused 'Button' import
import React, { useState } from 'react';

interface PromptInputAreaProps {
  // FIX: Replaced 'any' with a specific function type
  onSave: (content: string) => void;
  initialContent?: string;
}

export function PromptInputArea({ onSave, initialContent = '' }: PromptInputAreaProps) {
  const [content, setContent] = useState(initialContent);

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        style={{ width: '100%' }}
      />
      <button onClick={() => onSave(content)}>Save</button>
    </div>
  );
}
