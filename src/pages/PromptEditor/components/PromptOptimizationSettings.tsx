import { useState } from 'react';
import Button from '../../../components/ui/Button';
import { optimizePrompt, evaluatePrompt } from '../../../utils/api';
import { PromptEvaluationResult, PromptOptimizationStrategyType } from '../../../types/prompt';
import PerformanceBenchmark from './PerformanceBenchmark';
import { performanceTester } from '../../../utils/performance';

interface PromptOptimizationSettingsProps {
  promptId: string;
}

const PromptOptimizationSettings: React.FC<PromptOptimizationSettingsProps> = ({ promptId }) => {
  const [optimizationStrategy, setOptimizationStrategy] = useState<PromptOptimizationStrategyType>('meta-prompting');
  const [evaluationMetric, setEvaluationMetric] = useState<string>('accuracy');
  const [evaluationScore, setEvaluationScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [performanceMode, setPerformanceMode] = useState<boolean>(false);

  const handleOptimize = async () => {
    if (!promptId) {
      alert('Please select or create a prompt first.');
      return;
    }
    
    console.log(`Optimizing prompt ${promptId} using ${optimizationStrategy}...`);
    
    // Measure optimization performance
    const stopMeasurement = performanceTester.startMeasurement(
      `optimization_${promptId}`,
      `Prompt Optimization - ${optimizationStrategy}`
    );

    try {
      const response = await optimizePrompt(promptId, optimizationStrategy);
      const performanceMetric = stopMeasurement();
      
      if (response.success) {
        alert(`Optimization completed for prompt ${promptId} with strategy ${optimizationStrategy}.\nPerformance: ${performanceMetric.value.toFixed(2)}ms`);
      } else {
        alert(`Optimization failed: ${response.error}`);
      }
    } catch (error) {
      stopMeasurement();
      alert(`Optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEvaluate = async () => {
    if (!promptId) {
      alert('Please select or create a prompt first.');
      return;
    }

    // Measure evaluation performance
    const stopMeasurement = performanceTester.startMeasurement(
      `evaluation_${promptId}`,
      `Prompt Evaluation - ${evaluationMetric}`
    );

    try {
      const evaluationResult: PromptEvaluationResult = {
        promptId,
        version: 'current',
        metric: evaluationMetric,
        score: evaluationScore,
        reasoning: `Manual evaluation with score ${evaluationScore}`,
        feedback: feedback,
        timestamp: new Date().toISOString(),
        performanceMetrics: {
          responseTime: 0, // Will be updated after API call
          tokenUsage: { input: 0, output: 0, total: 0 },
          cost: 0,
          latency: 0
        }
      };

      console.log(`Evaluating prompt ${promptId} with score ${evaluationScore}...`);
      const response = await evaluatePrompt(promptId, evaluationResult);
      const performanceMetric = stopMeasurement();

      // Update performance metrics
      if (evaluationResult.performanceMetrics) {
        evaluationResult.performanceMetrics.responseTime = performanceMetric.value;
        evaluationResult.performanceMetrics.latency = performanceMetric.value;
      }

      if (response.success) {
        alert(`Evaluation submitted for prompt ${promptId}.\nPerformance: ${performanceMetric.value.toFixed(2)}ms`);
      } else {
        alert(`Evaluation failed: ${response.error}`);
      }
    } catch (error) {
      stopMeasurement();
      alert(`Evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <h4>Automated Optimization</h4>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="optimization-strategy">Optimization Strategy:</label>
        <select id="optimization-strategy" value={optimizationStrategy} onChange={(e) => setOptimizationStrategy(e.target.value as PromptOptimizationStrategyType)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}>
          <option value="meta-prompting">Meta-prompting (AI refines prompt)</option>
          <option value="gradient-based">Gradient-based Optimization</option>
          <option value="dspy">DSPy Integration (Automated techniques)</option>
          <option value="chain-of-thought">Chain-of-Thought Prompting</option>
          <option value="few-shot">Few-shot Learning</option>
          <option value="zero-shot">Zero-shot Learning</option>
        </select>
      </div>
      <div style={{ marginTop: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Button onClick={handleOptimize} disabled={!promptId}>Run Optimization</Button>
        <label style={{ fontSize: '0.9em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input 
            type="checkbox" 
            checked={performanceMode} 
            onChange={(e) => setPerformanceMode(e.target.checked)}
          />
          Performance Mode
        </label>
      </div>
      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
        Leverages an additional language model to generate or refine the original prompt, or employs mathematical principles for precise enhancements. (Section 2.3)
      </p>

      <h4 style={{ marginTop: '30px' }}>Manual Evaluation & Feedback</h4>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="evaluation-metric">Metric:</label>
        <input id="evaluation-metric" type="text" value={evaluationMetric} onChange={(e) => setEvaluationMetric(e.target.value)} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="evaluation-score">Score (0-100):</label>
        <input id="evaluation-score" type="number" value={evaluationScore} onChange={(e) => setEvaluationScore(Number(e.target.value))} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }} min={0} max={100} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="evaluation-feedback">Feedback:</label>
        <textarea id="evaluation-feedback" value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
      </div>
      <Button onClick={handleEvaluate} disabled={!promptId}>Submit Evaluation</Button>
      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '10px' }}>
        Comprehensive evaluation metrics, leveraging built-in evaluation flows to assess prompt quality and effectiveness. (Section 2.3)
      </p>

      {/* Performance Benchmarking Section */}
      {performanceMode && <PerformanceBenchmark promptId={promptId} />}
    </div>
  );
};

export default PromptOptimizationSettings;
