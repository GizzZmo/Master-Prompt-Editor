

interface VersionHistoryItem {
  version: string;
  date: string;
  rationale: string; // Add rationale to display
}

interface PromptVersioningPanelProps {
  currentVersion: string;
  versionHistory: VersionHistoryItem[];
  onRollback: (version: string) => void;
}

export function PromptVersioningPanel({
  currentVersion,
  versionHistory,
  onRollback,
}: PromptVersioningPanelProps) {
  return (
    <div>
      <h4>Current Version: <span style={{ color: 'var(--primary-color)' }}>{currentVersion}</span></h4>
      <h4 style={{ marginTop: '20px' }}>Version History</h4>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e9ecef', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {versionHistory.length === 0 ? (
            <p style={{ padding: '10px', color: '#666' }}>No version history available.</p>
          ) : (
            [...versionHistory].sort((a, b) => b.date.localeCompare(a.date)).map((v) => (
              <li
                key={v.version}
                style={{
                  padding: '10px',
                  borderBottom: '1px dashed #eee',
                  backgroundColor: v.version === currentVersion ? '#e6f3ff' : 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '5px'
                }}
              >
                <strong>Version: {v.version}</strong>
                <small>Date: {new Date(v.date).toLocaleString()}</small>
                <small>Rationale: {v.rationale}</small>
                {v.version !== currentVersion && (
                  <button
                    onClick={() => onRollback(v.version)}
                    style={{ backgroundColor: 'var(--secondary-color)', padding: '5px 10px', fontSize: '0.8em' }}
                  >
                    Rollback to This Version
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
