import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { optimizePrompt, evaluatePrompt } from '../../../utils/api';
import { PromptEvaluationResult, PromptOptimizationStrategyType } from '../../../types/prompt';

interface PromptOptimizationSettingsProps {
  promptId: string;
}

const PromptOptimizationSettings: React.FC<PromptOptimizationSettingsProps> = ({ promptId }) => {
  const [optimizationStrategy, setOptimizationStrategy] = useState<PromptOptimizationStrategyType>('meta-prompting');
  const [evaluationMetric, setEvaluationMetric] = useState<string>('accuracy');
  const [evaluationScore, setEvaluationScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  const handleOptimize = async () => {
    if (!promptId) {
      alert('Please select or create a prompt first.');
      return;
    }
    console.log(`Optimizing prompt ${promptId} using ${optimizationStrategy}...`);
    // TODO: Call API to trigger optimization (2.3)
    const response = await optimizePrompt(promptId, optimizationStrategy);
    if (response.success) {
      alert(`Optimization triggered for prompt ${promptId} with strategy ${optimizationStrategy}.`);
    } else {
      alert(`Optimization failed: ${response.error}`);
    }
  };

  const handleEvaluate = async () => {
    if (!promptId) {
      alert('Please select or create a prompt first.');
      return;
    }
    const evaluationResult: PromptEvaluationResult = {
      promptId,
      version: 'current', // In a real scenario, this would be the actual version
      metric: evaluationMetric,
      score: evaluationScore,
      feedback: feedback,
      timestamp: new Date().toISOString(),
    };
    console.log(`Evaluating prompt ${promptId} with score ${evaluationScore}...`);
    // TODO: Call API to submit evaluation (2.3)
    const response = await evaluatePrompt(promptId, evaluationResult);
    if (response.success) {
      alert(`Evaluation submitted for prompt ${promptId}.`);
    } else {
      alert(`Evaluation failed: ${response.error}`);
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
        </select>
      </div>
      <Button onClick={handleOptimize} disabled={!promptId}>Run Optimization</Button>
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
    </div>
  );
};

export default PromptOptimizationSettings;
