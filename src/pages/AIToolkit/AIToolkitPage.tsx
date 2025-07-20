import React, { useState } from 'react';
import MultimodalInput from './components/MultimodalInput';
import WorkflowBuilder from './components/WorkflowBuilder';
import AIManagerDashboard from './components/AIManagerDashboard';
import Button from '../../components/ui/Button';
import { AITaskType, MultimodalInput as MultimodalInputType, MultimodalOutput } from '../../types/ai';
import { executeAITask } from '../../utils/api';

const AIToolkitPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'single-task' | 'workflows' | 'dashboard'>('single-task');
  const [multimodalInput, setMultimodalInput] = useState<MultimodalInputType>({});
  const [selectedTaskType, setSelectedTaskType] = useState<AITaskType>('text-generation');
  const [singleTaskOutput, setSingleTaskOutput] = useState<MultimodalOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleExecuteSingleTask = async () => {
    setLoading(true);
    setError(null);
    setSingleTaskOutput(null);
    try {
      const response = await executeAITask(selectedTaskType, multimodalInput);
      if (response.success && response.data) {
        setSingleTaskOutput(response.data);
      } else {
        setError(response.error || 'Failed to execute AI task.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-toolkit-page">
      <h2>Advanced AI Toolkit</h2>
      <p>The "Swiss Army Knife" vision, integrating a wide array of AI capabilities into a unified, versatile platform. (Section 3)</p>

      <div style={{ marginBottom: '20px' }}>
        <Button onClick={() => setActiveTab('single-task')} style={{ marginRight: '10px' }} variant={activeTab === 'single-task' ? 'primary' : 'secondary'}>Single AI Task</Button>
        <Button onClick={() => setActiveTab('workflows')} style={{ marginRight: '10px' }} variant={activeTab === 'workflows' ? 'primary' : 'secondary'}>AI Workflows</Button>
        <Button onClick={() => setActiveTab('dashboard')} variant={activeTab === 'dashboard' ? 'primary' : 'secondary'}>AI Manager Dashboard</Button>
      </div>

      {activeTab === 'single-task' && (
        <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3>Multimodal AI Integration</h3>
          <p>Process diverse inputs simultaneously (text, images, audio, video) and generate contextually aware outputs. (Section 3.1)</p>
          <MultimodalInput onInputChange={setMultimodalInput} currentInput={multimodalInput} />
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="task-type">Select AI Task Type:</label>
            <select
              id="task-type"
              value={selectedTaskType}
              onChange={(e) => setSelectedTaskType(e.target.value as AITaskType)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
            >
              <option value="text-generation">Text Generation</option>
              <option value="image-generation">Image Generation & Editing</option>
              <option value="audio-generation">Audio Generation & Editing</option>
              <option value="code-generation">Code Generation</option>
              <option value="multimodal-analysis">Multimodal Analysis</option>
            </select>
          </div>
          <Button onClick={handleExecuteSingleTask} disabled={loading}>{loading ? 'Executing...' : 'Execute AI Task'}</Button>

          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {singleTaskOutput && (
            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #d4edda', backgroundColor: '#e2f7e4', borderRadius: '5px' }}>
              <h4>AI Output:</h4>
              {singleTaskOutput.text && <p>Text: {singleTaskOutput.text}</p>}
              {singleTaskOutput.image && <p>Image: <img src={singleTaskOutput.image} alt="Generated" style={{ maxWidth: '100%', height: 'auto' }} /></p>}
              {singleTaskOutput.audio && <p>Audio: <audio controls src={singleTaskOutput.audio}></audio></p>}
              {singleTaskOutput.video && <p>Video: <video controls src={singleTaskOutput.video} style={{ maxWidth: '100%', height: 'auto' }}></video></p>}
              {singleTaskOutput.metadata?.aiGenerated && (
                <p style={{ fontSize: '0.8em', color: '#3c763d' }}>
                  This content is AI-generated. (Responsible AI - Section 4.2)
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'workflows' && (
        <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3>AI Task Chaining & Workflow Automation</h3>
          <p>Automate complex processes through sophisticated AI task chaining and workflow automation with a visualized graph orchestration. (Section 3.2)</p>
          <WorkflowBuilder />
        </div>
      )}

      {activeTab === 'dashboard' && (
        <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3>Unified AI Framework & Architecture Dashboard</h3>
          <p>Monitor and manage your AI models and executions, reflecting the modular architecture. (Section 3.3, 6.2)</p>
          <AIManagerDashboard />
        </div>
      )}
    </div>
  );
};

export default AIToolkitPage;
