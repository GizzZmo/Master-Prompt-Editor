import { useEffect, useMemo, useState } from 'react';

interface PromptInputAreaProps {
  promptContent: string;
  onPromptContentChange: (content: string) => void;
}

const extractVariables = (content: string): string[] => {
  const pattern = /{{\s*([\w.-]+)\s*}}|{\s*([\w.-]+)\s*}/g;
  const found = new Set<string>();
  let match: RegExpExecArray | null;
  // eslint-disable-next-line no-cond-assign
  while ((match = pattern.exec(content))) {
    const variable = match[1] || match[2];
    if (variable) {
      found.add(variable);
    }
  }
  return Array.from(found);
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function PromptInputArea({ promptContent, onPromptContentChange }: PromptInputAreaProps) {
  const variables = useMemo(() => extractVariables(promptContent), [promptContent]);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setVariableValues((prev) => {
      const next: Record<string, string> = {};
      variables.forEach((key) => {
        next[key] = prev[key] ?? '';
      });
      return next;
    });
  }, [variables]);

  const renderedPreview = useMemo(() => {
    let output = promptContent;
    variables.forEach((variable) => {
      const replacement = variableValues[variable] ?? '';
      const placeholderPattern = new RegExp(`{{\\s*${escapeRegExp(variable)}\\s*}}|{\\s*${escapeRegExp(variable)}\\s*}`, 'g');
      output = output.replace(placeholderPattern, replacement);
    });
    return output;
  }, [promptContent, variableValues, variables]);

  return (
    <div>
      <textarea
        value={promptContent}
        onChange={(e) => onPromptContentChange(e.target.value)}
        rows={10}
        style={{ width: '100%', minHeight: '150px' }}
        placeholder="Enter your prompt content here..."
      />

      <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #e6e6e6', borderRadius: '6px', background: '#fafafa' }}>
        <strong>Template Variables</strong>
        {variables.length === 0 ? (
          <p style={{ margin: '8px 0 0 0', color: '#666' }}>No template variables detected. Use {'{{ variable }}'} or {'{variable}'} syntax to enable templating.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            {variables.map((variable) => (
              <label key={variable} style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.9em' }}>
                <span style={{ color: '#333' }}>{variable}</span>
                <input
                  type="text"
                  value={variableValues[variable] ?? ''}
                  onChange={(e) => setVariableValues((prev) => ({ ...prev, [variable]: e.target.value }))}
                  style={{ padding: '6px 8px', border: '1px solid #ccc', borderRadius: '4px' }}
                  placeholder={`Value for ${variable}`}
                />
              </label>
            ))}
          </div>
        )}
      </div>

      {variables.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <small style={{ color: '#666' }}>Preview with variable substitution:</small>
          <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
            {renderedPreview}
          </pre>
        </div>
      )}
    </div>
  );
}
