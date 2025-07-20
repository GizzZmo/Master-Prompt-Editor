import { Router } from 'express';
import { AIManagerService } from '../services/AIManagerService';
import { MultimodalInput, MultimodalOutput, AITaskType, AIWorkflow } from '../../src/types/ai'; // Using frontend types

const router = Router();
const aiManagerService = new AIManagerService();

// Execute a single AI task (Conceptual based on 3.1)
router.post('/task/execute', async (req, res) => {
  try {
    const { taskType, input, modelConfig } = req.body as { taskType: AITaskType, input: MultimodalInput, modelConfig?: any };
    const output = await aiManagerService.executeAITask(taskType, input, modelConfig);
    res.json(output);
  } catch (error: any) {
    console.error('Error executing AI task:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new AI workflow (Conceptual based on 3.2)
router.post('/workflows', (req, res) => {
  try {
    const workflow: Partial<AIWorkflow> = req.body;
    const newWorkflow = aiManagerService.createWorkflow(workflow);
    res.status(201).json(newWorkflow);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get all AI workflows (Conceptual based on 3.2)
router.get('/workflows', (req, res) => {
  try {
    const workflows = aiManagerService.getAllWorkflows();
    res.json(workflows);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Execute an AI workflow (Conceptual based on 3.2)
router.post('/workflows/:id/execute', async (req, res) => {
  try {
    const workflowId = req.params.id;
    const initialInput: MultimodalInput = req.body.initialInput;
    const log = await aiManagerService.executeWorkflow(workflowId, initialInput);
    res.json(log);
  } catch (error: any) {
    console.error('Error executing AI workflow:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get available AI models (Conceptual based on 3.3)
router.get('/models', (req, res) => {
  try {
    const models = aiManagerService.getAvailableModels();
    res.json(models);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get AI task execution logs (Conceptual based on 6.2)
router.get('/logs', (req, res) => {
  try {
    const logs = aiManagerService.getExecutionLogs();
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
