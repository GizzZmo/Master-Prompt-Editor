import { Router, Request, Response } from 'express';
import { PromptService } from '../services/PromptService';
import { Prompt, PromptVersion, PromptCategory } from '../../../src/types/prompt'; // Corrected import path and types

const router = Router();
const promptService = new PromptService();

type NewPromptRequest = Omit<Prompt, 'id' | 'currentVersion' | 'versions'> & {initialContent: string};

router.get('/', async (_req: Request, res: Response) => {
  try {
    const prompts = await promptService.getAllPrompts();
    res.status(200).json(prompts);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to retrieve prompts', details: errorMessage });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const prompt = await promptService.getPromptById(req.params.id);
    if (prompt) {
      res.status(200).json(prompt);
    } else {
      res.status(404).json({ message: 'Prompt not found' });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to retrieve prompt', details: errorMessage });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    // Expecting name, category, domain, and initialContent for a brand new prompt
    const newPromptData: NewPromptRequest = req.body;
    const createdPrompt = await promptService.createPrompt(newPromptData);
    res.status(201).json(createdPrompt);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to create prompt', details: errorMessage });
  }
});

// New endpoint to add a new version to an existing prompt
router.post('/:id/versions', async (req: Request, res: Response) => {
  try {
    const { content, metadata } = req.body;
    if (!content || !metadata) {
      return res.status(400).json({ error: 'Content and metadata are required for a new version.' });
    }
    const updatedPrompt = await promptService.addPromptVersion(req.params.id, content, metadata);
    if (updatedPrompt) {
      res.status(200).json(updatedPrompt);
    } else {
      res.status(404).json({ message: 'Prompt not found or failed to add version.' });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to add prompt version', details: errorMessage });
  }
});

// New endpoint to rollback to a specific version
router.post('/:id/rollback', async (req: Request, res: Response) => {
  try {
    const { version } = req.body;
    if (!version) {
      return res.status(400).json({ error: 'Version to rollback to is required.' });
    }
    const updatedPrompt = await promptService.rollbackPromptToVersion(req.params.id, version);
    if (updatedPrompt) {
      res.status(200).json(updatedPrompt);
    } else {
      res.status(404).json({ message: 'Prompt not found or version not found.' });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to rollback prompt', details: errorMessage });
  }
});

// New endpoint to update an existing prompt's metadata (excluding content and versions)
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const updatedPrompt = await promptService.updatePromptMetadata(req.params.id, updates);
    if (updatedPrompt) {
      res.status(200).json(updatedPrompt);
    } else {
      res.status(404).json({ message: 'Prompt not found or failed to update.' });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to update prompt', details: errorMessage });
  }
});

// New endpoint to delete a prompt
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const success = await promptService.deletePrompt(req.params.id);
    if (success) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Prompt not found' });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to delete prompt', details: errorMessage });
  }
});

// Placeholder for prompt evaluation endpoint
router.post('/:id/evaluate', async (req: Request, res: Response) => {
  try {
    const evaluationResult = req.body;
    // In a real app, this would trigger an evaluation process and store results
    console.log(`Received evaluation for prompt ${req.params.id}:`, evaluationResult);
    res.status(200).json({ success: true, message: 'Evaluation received' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to process evaluation', details: errorMessage });
  }
});

// Placeholder for prompt optimization endpoint
router.post('/:id/optimize', async (req: Request, res: Response) => {
  try {
    const optimizationStrategy = req.body.strategy;
    // In a real app, this would trigger an optimization process
    console.log(`Received optimization request for prompt ${req.params.id} with strategy:`, optimizationStrategy);
    res.status(200).json({ success: true, message: 'Optimization request received' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to process optimization', details: errorMessage });
  }
});

export default router;
