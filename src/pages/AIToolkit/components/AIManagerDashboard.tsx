import { useState, useEffect } from 'react';
import { getAIModels, getExecutionLogs } from '../../../utils/api';
import { AIModelType, AITaskExecutionLog } from '../../../types/ai';

const AIManagerDashboard: React.FC = () => {
  const [availableModels, setAvailableModels] = useState<AIModelType[]>([]);
  const [executionLogs, setExecutionLogs] = useState<AITaskExecutionLog[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [errorModels, setErrorModels] = useState<string | null>(null);
  const [errorLogs, setErrorLogs] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      const response = await getAIModels();
      if (response.success && response.data) {
        setAvailableModels(response.data);
      } else {
        setErrorModels(response.error || 'Failed to fetch models.');
      }
      setLoadingModels(false);
    };

    const fetchLogs = async () => {
      setLoadingLogs(true);
      const response = await getExecutionLogs();
      if (response.success && response.data) {
        setExecutionLogs(response.data);
      } else {
        setErrorLogs(response.error || 'Failed to fetch execution logs.');
      }
      setLoadingLogs(false);
    };

    fetchModels();
    fetchLogs();
  }, []);

  return (
    <div>
      <h3>AI Model Status (Conceptual)</h3>
      {loadingModels ? <p>Loading models...</p> : errorModels ? <p style={{ color: 'red' }}>Error: {errorModels}</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {availableModels.length > 0 ? availableModels.map(model => (
            <li key={model} style={{ padding: '8px 0', borderBottom: '1px dashed #eee' }}>
              <strong>{model}</strong>: <span style={{ color: 'green' }}>Operational</span> (Latency: ~50ms, Cost/1k tokens: $0.02)
              {/* TODO: Display real-time stats for each model (3.3) */}
            </li>
          )) : <p>No AI models found.</p>}
        </ul>
      )}
      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
        Capable of communicating with various LLMs, taking into account factors such as model specialization, context window size, cost, latency, and fine-tuning capabilities. (Section 3.3)
      </p>

      <h3 style={{ marginTop: '30px' }}>Recent AI Task Execution Logs (Conceptual)</h3>
      {loadingLogs ? <p>Loading logs...</p> : errorLogs ? <p style={{ color: 'red' }}>Error: {errorLogs}</p> : (
        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e9ecef', borderRadius: '8px', backgroundColor: '#fdfdfd' }}>
          {executionLogs.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f1f1' }}>
                  <th style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>Timestamp</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>Task ID</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>Duration (ms)</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {executionLogs.map(log => (
                  <tr key={log.taskId} style={{ borderBottom: '1px dashed #eee' }}>
                    <td style={{ padding: '10px' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>{log.taskId.substring(0, 8)}...</td>
                    <td style={{ padding: '10px', color: log.success ? 'green' : 'red' }}>{log.success ? 'Success' : 'Failed'}</td>
                    <td style={{ padding: '10px' }}>{log.durationMs}</td>
                    <td style={{ padding: '10px' }}>${log.cost.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p style={{ padding: '10px' }}>No execution logs found.</p>}
        </div>
      )}
      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
        Robust tools are required to track how different modalities interact and influence overall system performance. Continuous monitoring of various generation, retrieval, system, and product metrics is essential. (Section 5.3)
        Automated alerts will be configured to provide early warnings for unexpected changes. (Section 6.2)
      </p>
    </div>
  );
};

export default AIManagerDashboard;
