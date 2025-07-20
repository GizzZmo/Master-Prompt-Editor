import React from 'react';
import Button from '../../../components/ui/Button';

interface PromptVersioningPanelProps {
  currentVersion: string;
  versionHistory: { version: string; date: string }[];
  onRollback: (version: string) => void;
}

const PromptVersioningPanel: React.FC<PromptVersioningPanelProps> = ({ currentVersion, versionHistory, onRollback }) => {
  return (
    <div>
      <h4>Current Version: <span style={{ color: 'var(--primary-color)' }}>{currentVersion}</span></h4>
      <h4 style={{ marginTop: '20px' }}>Version History:</h4>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {versionHistory.map((v, index) => (
          <li key={v.version} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: '1px dashed #eee' }}>
            <span>
              <strong>{v.version}</strong> (on {new Date(v.date).toLocaleDateString()})
            </span>
            {v.version !== currentVersion && (
              <Button onClick={() => onRollback(v.version)} variant="secondary" style={{ padding: '5px 10px', fontSize: '0.8em' }}>
                Rollback
              </Button>
            )}
          </li>
        ))}
      </ul>
      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
        Automatically tracks every change to prompts and logs all LLM calls, allowing easy rollback to previous stable versions. (Section 2.1)
      </p>
    </div>
  );
};

export default PromptVersioningPanel;
