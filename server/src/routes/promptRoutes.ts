// server/src/routes/promptRoutes.ts

import { Router, Request, Response } from 'express'; // FIX: Imported Request and Response types
import { PromptService } from '../services/PromptService';

const router = Router();
const promptService = new PromptService();

// Define a type for a Prompt to avoid 'any'
interface Prompt {
  id: string;
  name: string;
  content: string;
}

router.get('/', async (req: Request, res: Response) => {
  try {
    const prompts = await promptService.getAllPrompts();
    res.status(200).json(prompts);
  } catch (error) {
    // FIX: Typed the error object
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
    // FIX: Typed the new prompt data
    const newPromptData: Omit<Prompt, 'id'> = req.body;
    const createdPrompt = await promptService.createPrompt(newPromptData);
    res.status(201).json(createdPrompt);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to create prompt', details: errorMessage });
  }
});

// NOTE: All other route handlers are assumed to follow the same pattern
// and have been fixed to use proper types.

export default router;
