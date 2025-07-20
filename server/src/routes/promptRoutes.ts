import { Router, Request, Response } from 'express';
import { PromptService } from '../services/PromptService';

const router = Router();
const promptService = new PromptService();

interface Prompt {
  id: string;
  name: string;
  content: string;
}

router.get('/', async (_req: Request, res: Response) => { // FIX: Renamed unused 'req' to '_req'
  try {
    const prompts = await promptService.getAllPrompts();
    res.status(200).json(prompts);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to retrieve prompts', details: errorMessage });
  }
});

// ... rest of the file
export default router;
