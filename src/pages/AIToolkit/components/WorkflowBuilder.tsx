import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { AIWorkflow, AIWorkflowStep } from '../../../types/ai';
import { createWorkflow, executeWorkflow } from '../../../utils/api';

// Dummy component for a workflow node (visual representation)
const WorkflowNode: React.FC<{ step: AIWorkflowStep }> = ({ step }) => {
  return (
    <div style={{ border: '1px solid #007bff', padding: '10px', margin: '5px', borderRadius: '5px', backgroundColor: '#e6f3ff', textAlign: 'center' }}>
      <strong>{step.name}</strong><br/>
      <small>({step.taskType})</small>
    </div>
  );
};

const WorkflowBuilder: React.FC = () => {
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<AIWorkflowStep[]>([]);
  const [newStepName, setNewStepName] = useState('');
  const [newStepType, setNewStepType] = useState<AIWorkflowStep['taskType']>('text-generation');

  const handleAddStep = () => {
    if (newStepName.trim() && newStepType) {
      setWorkflowSteps(prev => [
        ...prev,
        { id: `step-${prev.length + 1}`, name: newStepName, taskType: newStepType, inputMapping: {}, outputMapping: {} }
      ]);
      setNewStepName('');
    }
  };

  const handleSaveWorkflow = async () => {
    if (workflowName.trim() && workflowSteps.length > 0) {
      const newWorkflow: Partial<AIWorkflow> = {
        name: workflowName,
        description: workflowDescription,
        steps: workflowSteps,
        createdBy: 'user_id_mock',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        status: 'draft',
      };
      // TODO: Call API to save workflow (3.2)
      const response = await createWorkflow(newWorkflow);
      if (response.success) {
        alert('Workflow saved successfully!');
        console.log('Saved Workflow:', response.data);
      } else {
        alert(`Failed to save workflow: ${response.error}`);
      }
    } else {
      alert('Please provide a workflow name and add at least one step.');
    }
  };

  const handleExecuteWorkflow = async () => {
    if (!workflowName) {
      alert('Please save or load a workflow first.');
      return;
    }
    // TODO: A real execution would require initial inputs and potentially prompt mapping (3.2)
    alert('Executing workflow (conceptual)... Check console for mock output.');
    const response = await executeWorkflow('mock-workflow-id', { text: 'Initial workflow input.' });
    if (response.success) {
      console.log('Workflow execution log:', response.data);
      alert('Workflow execution initiated successfully!');
    } else {
      alert(`Workflow execution failed: ${response.error}`);
    }
  };

  return (
    <div>
      <h4>Design AI Workflow</h4>
      <Input
        label="Workflow Name:"
        value={workflowName}
        onChange={(e) => setWorkflowName(e.target.value)}
        placeholder="e.g., 'Content Creation Pipeline'"
      />
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="workflow-description">Description:</label>
        <textarea
          id="workflow-description"
          value={workflowDescription}
          onChange={(e) => setWorkflowDescription(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
          placeholder="Describe the purpose of this workflow..."
        />
      </div>

      <div style={{ border: '1px dashed #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h5>Add New Step</h5>
        <Input
          label="Step Name:"
          value={newStepName}
          onChange={(e) => setNewStepName(e.target.value)}
          placeholder="e.g., 'Summarize Text', 'Generate Image'"
        />
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="step-type">Step Type:</label>
          <select
            id="step-type"
            value={newStepType}
            onChange={(e) => setNewStepType(e.target.value as AIWorkflowStep['taskType'])}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }}
          >
            <option value="text-generation">Text Generation</option>
            <option value="image-generation">Image Generation</option>
            <option value="audio-generation">Audio Generation</option>
            <option value="code-generation">Code Generation</option>
            <option value="multimodal-analysis">Multimodal Analysis</option>
          </select>
        </div>
        <Button onClick={handleAddStep}>Add Step to Workflow</Button>
      </div>

      {workflowSteps.length > 0 && (
        <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white', marginBottom: '20px' }}>
          <h4>Workflow Visualization (Conceptual Graph Orchestration)</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', border: '1px solid #eee', padding: '10px', borderRadius: '5px' }}>
            {workflowSteps.map(step => (
              <WorkflowNode key={step.id} step={step} />
            ))}
            <p style={{ fontSize: '0.8em', color: '#666', width: '100%', marginTop: '10px' }}>
              This visual representation allows users to orchestrate executable flows with LLMs, prompts, and Python tools. (Section 3.2)
            </p>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <Button onClick={handleSaveWorkflow}>Save Workflow</Button>
        <Button onClick={handleExecuteWorkflow} variant="primary" disabled={workflowSteps.length === 0}>Execute Workflow</Button>
      </div>

      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '20px' }}>
        Empowers users to automate complex processes through sophisticated AI task chaining and workflow automation. Includes no-code/low-code capabilities. (Section 3.2)
      </p>
    </div>
  );
};

export default WorkflowBuilder;
