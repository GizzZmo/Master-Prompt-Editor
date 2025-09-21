import React, { useState, useCallback } from 'react';
import Button from '../../../components/ui/Button';
import { performanceTester, BenchmarkResult, LoadTestResult, LoadTestConfig } from '../../../utils/performance';
import { PromptOptimizationStrategyType } from '../../../types/prompt';
import { useToast } from '../../../context/toastContextHelpers';

interface PerformanceBenchmarkProps {
  promptId: string;
}

const PerformanceBenchmark: React.FC<PerformanceBenchmarkProps> = ({ promptId }) => {
  const { showToast } = useToast();
  const [benchmarkResults, setBenchmarkResults] = useState<BenchmarkResult[]>([]);
  const [loadTestResults, setLoadTestResults] = useState<LoadTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<PromptOptimizationStrategyType>('meta-prompting');
  const [iterations, setIterations] = useState(10);
  const [concurrentUsers, setConcurrentUsers] = useState(5);
  const [testDuration, setTestDuration] = useState(30);

  const runBenchmark = useCallback(async () => {
    if (!promptId) {
      showToast('Please select a prompt first.', 'warning');
    }

    setIsRunning(true);
    try {
      // Simulate prompt optimization benchmark
      const result = await performanceTester.benchmark(
        `benchmark_${Date.now()}`,
        `Prompt Optimization - ${selectedStrategy}`,
        async () => {
          // Simulate optimization API call
          await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
          return `Optimized prompt result for ${selectedStrategy}`;
        },
        iterations
      );

      setBenchmarkResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results
    } catch (error) {
      console.error('Benchmark failed:', error);
      alert('Benchmark failed. Please try again.');
    } finally {
      setIsRunning(false);
    }
  }, [promptId, selectedStrategy, iterations, showToast]);

  const runLoadTest = useCallback(async () => {
    if (!promptId) {
      alert('Please select a prompt first.');
      return;
    }

    setIsRunning(true);
    try {
      const config: LoadTestConfig = {
        concurrentUsers,
        duration: testDuration,
        promptId,
        strategy: selectedStrategy,
        rampUpTime: 5
      };

      const result = await performanceTester.loadTest(config);
      setLoadTestResults(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 results
    } catch (error) {
      console.error('Load test failed:', error);
      alert('Load test failed. Please try again.');
    } finally {
      setIsRunning(false);
    }
  }, [promptId, selectedStrategy, concurrentUsers, testDuration]);

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatNumber = (num: number): string => {
    return num.toFixed(2);
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <h4>Performance Benchmarking</h4>
      
      {/* Configuration Section */}
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #e9ecef', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
        <h5 style={{ marginTop: 0, marginBottom: '15px' }}>Test Configuration</h5>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <label htmlFor="benchmark-strategy">Strategy:</label>
            <select 
              id="benchmark-strategy" 
              value={selectedStrategy} 
              onChange={(e) => setSelectedStrategy(e.target.value as PromptOptimizationStrategyType)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            >
              <option value="meta-prompting">Meta-prompting</option>
              <option value="gradient-based">Gradient-based</option>
              <option value="dspy">DSPy Integration</option>
              <option value="chain-of-thought">Chain-of-Thought</option>
              <option value="few-shot">Few-shot</option>
              <option value="zero-shot">Zero-shot</option>
            </select>
          </div>

          <div>
            <label htmlFor="benchmark-iterations">Benchmark Iterations:</label>
            <input 
              id="benchmark-iterations"
              type="number" 
              value={iterations} 
              onChange={(e) => setIterations(Number(e.target.value))}
              min={1}
              max={100}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            />
          </div>

          <div>
            <label htmlFor="load-test-users">Concurrent Users:</label>
            <input 
              id="load-test-users"
              type="number" 
              value={concurrentUsers} 
              onChange={(e) => setConcurrentUsers(Number(e.target.value))}
              min={1}
              max={50}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            />
          </div>

          <div>
            <label htmlFor="load-test-duration">Duration (seconds):</label>
            <input 
              id="load-test-duration"
              type="number" 
              value={testDuration} 
              onChange={(e) => setTestDuration(Number(e.target.value))}
              min={10}
              max={300}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
          <Button onClick={runBenchmark} disabled={!promptId || isRunning}>
            {isRunning ? 'Running...' : 'Run Benchmark'}
          </Button>
          <Button onClick={runLoadTest} disabled={!promptId || isRunning}>
            {isRunning ? 'Running...' : 'Run Load Test'}
          </Button>
        </div>
      </div>

      {/* Benchmark Results */}
      {benchmarkResults.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h5>Benchmark Results</h5>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e9ecef', borderRadius: '8px' }}>
            {benchmarkResults.map((result, index) => {
              const stats = performanceTester.calculateStats(result.metrics);
              return (
                <div key={result.id} style={{ 
                  padding: '15px', 
                  borderBottom: index < benchmarkResults.length - 1 ? '1px solid #e9ecef' : 'none',
                  backgroundColor: result.status === 'success' ? '#f8fff8' : '#fff8f8'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <strong>{result.testName}</strong>
                    <span style={{ 
                      color: result.status === 'success' ? 'green' : 'red',
                      fontSize: '0.9em',
                      fontWeight: 'bold'
                    }}>
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {result.status === 'success' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', fontSize: '0.9em' }}>
                      <div>
                        <strong>Avg:</strong> {formatDuration(stats.average)}
                      </div>
                      <div>
                        <strong>Min:</strong> {formatDuration(stats.min)}
                      </div>
                      <div>
                        <strong>Max:</strong> {formatDuration(stats.max)}
                      </div>
                      <div>
                        <strong>Std Dev:</strong> {formatDuration(stats.standardDeviation)}
                      </div>
                      <div>
                        <strong>Iterations:</strong> {result.metrics.length}
                      </div>
                      <div>
                        <strong>Total:</strong> {formatDuration(result.duration)}
                      </div>
                    </div>
                  )}
                  
                  {result.error && (
                    <div style={{ color: 'red', fontSize: '0.9em', marginTop: '8px' }}>
                      Error: {result.error}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Load Test Results */}
      {loadTestResults.length > 0 && (
        <div>
          <h5>Load Test Results</h5>
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e9ecef', borderRadius: '8px' }}>
            {loadTestResults.map((result, index) => (
              <div key={result.id} style={{ 
                padding: '15px', 
                borderBottom: index < loadTestResults.length - 1 ? '1px solid #e9ecef' : 'none',
                backgroundColor: '#f8f9ff'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Load Test - {result.config.concurrentUsers} users, {result.config.duration}s</strong>
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    Strategy: {result.config.strategy} | Started: {new Date(result.startTime).toLocaleString()}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', fontSize: '0.9em' }}>
                  <div>
                    <strong>Total Requests:</strong><br />
                    {result.metrics.totalRequests}
                  </div>
                  <div>
                    <strong>Success Rate:</strong><br />
                    {formatNumber((result.metrics.successfulRequests / result.metrics.totalRequests) * 100)}%
                  </div>
                  <div>
                    <strong>Avg Response:</strong><br />
                    {formatDuration(result.metrics.averageResponseTime)}
                  </div>
                  <div>
                    <strong>Min/Max:</strong><br />
                    {formatDuration(result.metrics.minResponseTime)} / {formatDuration(result.metrics.maxResponseTime)}
                  </div>
                  <div>
                    <strong>Requests/sec:</strong><br />
                    {formatNumber(result.metrics.requestsPerSecond)}
                  </div>
                  <div>
                    <strong>Error Rate:</strong><br />
                    {formatNumber(result.metrics.errorRate)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '15px' }}>
        Performance benchmarking helps identify optimization opportunities and ensures consistent performance across different strategies. 
        Load testing simulates real-world usage patterns to evaluate system capacity and reliability.
      </p>
    </div>
  );
};

export default PerformanceBenchmark;