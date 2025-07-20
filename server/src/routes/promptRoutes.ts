import { Router, Request, Response } from 'express';
import { PromptService } from '../services/PromptService';

const router = Router();
const promptService = new PromptService();

interface Prompt {
  id: string;
  name: string;
  content: string;
}

type NewPromptData = Omit<Prompt, 'id'>;

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
    const newPromptData: NewPromptData = req.body;
    const createdPrompt = await promptService.createPrompt(newPromptData);
    res.status(201).json(createdPrompt);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to create prompt', details: errorMessage });
  }
});

export default router;
