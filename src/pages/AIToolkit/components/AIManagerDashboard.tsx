import { useState, useEffect } from 'react';
import { getAIModels, getExecutionLogs } from '../../../utils/api';
import { AIModelType, AITaskExecutionLog } from '../../../types/ai';
import { performanceTester, PerformanceMetric } from '../../../utils/performance';

const AIManagerDashboard: React.FC = () => {
  const [availableModels, setAvailableModels] = useState<AIModelType[]>([]);
  const [executionLogs, setExecutionLogs] = useState<AITaskExecutionLog[]>([]);
  const [loadingModels, setLoadingModels] = useState(true);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [errorModels, setErrorModels] = useState<string | null>(null);
  const [errorLogs, setErrorLogs] = useState<string | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<PerformanceMetric[]>([]);

  useEffect(() => {
    const fetchModels = async () => {
      setLoadingModels(true);
      try {
        const models = await getAIModels();
        setAvailableModels(models);
      } catch (error) {
        setErrorModels(error instanceof Error ? error.message : 'Failed to fetch models.');
      }
      setLoadingModels(false);
    };

    const fetchLogs = async () => {
      setLoadingLogs(true);
      try {
        const logs = await getExecutionLogs();
        setExecutionLogs(logs);
      } catch (error) {
        setErrorLogs(error instanceof Error ? error.message : 'Failed to fetch execution logs.');
      }
      setLoadingLogs(false);
    };

    const collectSystemMetrics = () => {
      // Collect system performance metrics
      const memoryMetric = performanceTester.measureMemory('system_memory');
      setSystemMetrics(prev => [memoryMetric, ...prev.slice(0, 9)]); // Keep last 10 metrics
    };

    fetchModels();
    fetchLogs();
    collectSystemMetrics();

    // Set up periodic metrics collection, only if not paused
    if (!metricsPaused) {
      const intervalId = setInterval(collectSystemMetrics, metricsIntervalMs);
      return () => clearInterval(intervalId);
    }
    // If paused, no interval
    return undefined;
  }, [metricsIntervalMs, metricsPaused]);
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateAverageMetrics = () => {
    if (executionLogs.length === 0) return { avgDuration: 0, avgCost: 0, successRate: 0 };
    
    const totalDuration = executionLogs.reduce((sum, log) => sum + (log.durationMs || 0), 0);
    const totalCost = executionLogs.reduce((sum, log) => sum + (log.cost || 0), 0);
    const successCount = executionLogs.filter(log => log.success).length;
    
    return {
      avgDuration: totalDuration / executionLogs.length,
      avgCost: totalCost / executionLogs.length,
      successRate: (successCount / executionLogs.length) * 100
    };
  };

  const avgMetrics = calculateAverageMetrics();

  return (
    <div>
      {/* System Performance Overview */}
      <h3>System Performance Overview</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px',
        padding: '15px',
        border: '1px solid #e9ecef',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#495057' }}>Avg Response Time</h4>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#28a745' }}>
            {avgMetrics.avgDuration.toFixed(1)}ms
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#495057' }}>Success Rate</h4>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: avgMetrics.successRate > 90 ? '#28a745' : '#ffc107' }}>
            {avgMetrics.successRate.toFixed(1)}%
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#495057' }}>Avg Cost</h4>
          <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#17a2b8' }}>
            ${avgMetrics.avgCost.toFixed(4)}
          </div>
        </div>
        {systemMetrics.length > 0 && (
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#495057' }}>Memory Usage</h4>
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#6c757d' }}>
              {formatBytes(systemMetrics[0].value)}
            </div>
          </div>
        )}
      </div>
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
                  <tr key={log.taskId || log.id} style={{ borderBottom: '1px dashed #eee' }}>
                    <td style={{ padding: '10px' }}>{new Date(log.timestamp || log.startTime).toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>{(log.taskId || log.id).substring(0, 8)}...</td>
                    <td style={{ padding: '10px', color: log.success ? 'green' : 'red' }}>{log.success ? 'Success' : 'Failed'}</td>
                    <td style={{ padding: '10px' }}>{log.durationMs || 'N/A'}</td>
                    <td style={{ padding: '10px' }}>${(log.cost || 0).toFixed(4)}</td>
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

      {/* Performance Metrics Timeline */}
      {systemMetrics.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Performance Metrics Timeline</h3>
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto', 
            border: '1px solid #e9ecef', 
            borderRadius: '8px',
            backgroundColor: '#f8fff8'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#e9f7ef' }}>
                  <th style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>Timestamp</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>Metric</th>
                  <th style={{ padding: '10px', borderBottom: '1px solid #e9ecef', textAlign: 'left' }}>Value</th>
                </tr>
              </thead>
              <tbody>
                {systemMetrics.map(metric => (
                  <tr key={metric.id} style={{ borderBottom: '1px dashed #eee' }}>
                    <td style={{ padding: '10px' }}>{new Date(metric.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>{metric.name}</td>
                    <td style={{ padding: '10px' }}>
                      {metric.name === 'Memory Usage' ? formatBytes(metric.value) : `${metric.value.toFixed(2)} ${metric.unit}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
            Real-time system performance metrics help identify potential bottlenecks and optimization opportunities.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIManagerDashboard;
