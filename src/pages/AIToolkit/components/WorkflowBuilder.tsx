import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { AIWorkflow, AIWorkflowStep } from '../../../types/ai';
import { createWorkflow, executeWorkflow } from '../../../utils/api';
import { useToast } from '../../../context/toastContextHelpers';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

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
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const { showToast } = useToast();

  const handleAddStep = () => {
    if (newStepName.trim() && newStepType) {
      setWorkflowSteps(prev => [
        ...prev,
        { id: `step-${prev.length + 1}`, name: newStepName, taskType: newStepType, inputMapping: {}, outputMapping: {} }
      ]);
      setNewStepName('');
      showToast(`Added step: ${newStepName}`, 'success');
    } else {
      showToast('Please provide a step name', 'warning');
    }
  };

  const handleSaveWorkflow = async () => {
    if (!workflowName.trim()) {
      showToast('Please provide a workflow name', 'warning');
      return;
    }
    if (workflowSteps.length === 0) {
      showToast('Please add at least one step', 'warning');
      return;
    }

    setIsSaving(true);
    try {
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
        showToast('Workflow saved successfully!', 'success');
        console.log('Saved Workflow:', response.data);
      } else {
        showToast(`Failed to save workflow: ${response.error}`, 'error');
      }
    } catch (error) {
      showToast('An error occurred while saving', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExecuteWorkflow = async () => {
    if (!workflowName) {
      showToast('Please save or load a workflow first', 'warning');
      return;
    }

    setIsExecuting(true);
    try {
      // TODO: A real execution would require initial inputs and potentially prompt mapping (3.2)
      const response = await executeWorkflow('mock-workflow-id', { text: 'Initial workflow input.' });
      if (response.success) {
        console.log('Workflow execution log:', response.data);
        showToast('Workflow execution completed successfully!', 'success');
      } else {
        showToast(`Workflow execution failed: ${response.error}`, 'error');
      }
    } catch (error) {
      showToast('An error occurred during execution', 'error');
    } finally {
      setIsExecuting(false);
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

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <Button onClick={handleSaveWorkflow} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Workflow'}
        </Button>
        {isSaving && <LoadingSpinner size="small" inline />}
        <Button onClick={handleExecuteWorkflow} variant="primary" disabled={workflowSteps.length === 0 || isExecuting}>
          {isExecuting ? 'Executing...' : 'Execute Workflow'}
        </Button>
        {isExecuting && <LoadingSpinner size="small" inline />}
      </div>

      <p style={{ fontSize: '0.9em', color: '#666', marginTop: '20px' }}>
        Empowers users to automate complex processes through sophisticated AI task chaining and workflow automation. Includes no-code/low-code capabilities. (Section 3.2)
      </p>
    </div>
  );
};

export default WorkflowBuilder;
