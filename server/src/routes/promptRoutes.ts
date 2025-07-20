import { Router } from 'express';
import { PromptService } from '../services/PromptService';
import { PromptOptimizationStrategy, PromptVersion } from '../../src/types/prompt'; // Using frontend types for consistency

const router = Router();
const promptService = new PromptService();

// Get all prompts (Conceptual based on 2.1)
router.get('/', (req, res) => {
  try {
    const prompts = promptService.getAllPrompts();
    res.json(prompts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single prompt by ID (Conceptual based on 2.1)
router.get('/:id', (req, res) => {
  try {
    const prompt = promptService.getPromptById(req.params.id);
    if (prompt) {
      res.json(prompt);
    } else {
      res.status(404).json({ message: 'Prompt not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new prompt (Conceptual based on 2.1)
router.post('/', (req, res) => {
  try {
    const newPrompt = promptService.createPrompt(req.body);
    res.status(201).json(newPrompt);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update an existing prompt (Conceptual based on 2.1)
router.put('/:id', (req, res) => {
  try {
    const updatedPrompt = promptService.updatePrompt(req.params.id, req.body);
    if (updatedPrompt) {
      res.json(updatedPrompt);
    } else {
      res.status(404).json({ message: 'Prompt not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a prompt (Conceptual based on 2.1)
router.delete('/:id', (req, res) => {
  try {
    promptService.deletePrompt(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new prompt version (Conceptual based on 2.1)
router.post('/:id/versions', (req, res) => {
  try {
    const promptId = req.params.id;
    const versionData: Partial<PromptVersion> = req.body;
    const updatedPrompt = promptService.addPromptVersion(promptId, versionData);
    if (updatedPrompt) {
      res.status(201).json(updatedPrompt);
    } else {
      res.status(404).json({ message: 'Prompt not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Rollback to a previous prompt version (Conceptual based on 2.1)
router.post('/:id/rollback/:version', (req, res) => {
  try {
    const promptId = req.params.id;
    const version = req.params.version;
    const updatedPrompt = promptService.rollbackPrompt(promptId, version);
    if (updatedPrompt) {
      res.json(updatedPrompt);
    } else {
      res.status(404).json({ message: 'Prompt or version not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Run prompt test (Conceptual based on 2.1 - Playground)
router.post('/prompt-tests', (req, res) => {
  const { promptContent, options } = req.body;
  // TODO: Integrate with actual LLM API here
  console.log(`Simulating prompt test for: ${promptContent.substring(0, 50)}...`);
  console.log('Options:', options);

  // Mock AI response
  const mockOutput = `AI generated response to: "${promptContent.substring(0, 100)}..." with input: "${options?.input || 'N/A'}"`;

  res.json({ text: mockOutput, metadata: { aiGenerated: true } });
});

// Optimize a prompt (Conceptual based on 2.3)
router.post('/:id/optimize', (req, res) => {
  try {
    const promptId = req.params.id;
    const strategy: PromptOptimizationStrategy = req.body.strategy;
    const updatedPrompt = promptService.optimizePrompt(promptId, strategy);
    if (updatedPrompt) {
      res.json({ message: `Optimization for prompt ${promptId} with ${strategy} started.` });
    } else {
      res.status(404).json({ message: 'Prompt not found' });
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Evaluate a prompt (Conceptual based on 2.3)
router.post('/:id/evaluate', (req, res) => {
  try {
    const promptId = req.params.id;
    const evaluation = req.body;
    promptService.addPromptEvaluation(promptId, evaluation);
    res.status(200).json({ message: `Evaluation for prompt ${promptId} received.` });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
