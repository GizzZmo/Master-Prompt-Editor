

interface Version {
  id: string;
  name: string;
  createdAt: string;
}

interface PromptVersionPanelProps {
  versions: Version[];
}

export function PromptVersionPanel({ versions }: PromptVersionPanelProps) {
  return (
    <div>
      <h3>Version History</h3>
      <ul>
        {/* FIX: Renamed unused 'index' to '_index' to satisfy the linter */}
        {versions.map((version, _index) => (
          <li key={version.id}>
            {version.name} - {new Date(version.createdAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
