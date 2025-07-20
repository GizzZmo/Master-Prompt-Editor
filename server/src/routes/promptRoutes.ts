import { Router, Request, Response } from 'express';
import { PromptService } from '../services/PromptService';
import { Prompt } from '../../../src/types/prompt';

const router = Router();
const promptService = new PromptService();

// GET /api/prompts
router.get('/', async (_req: Request, res: Response) => {
  const prompts = await promptService.getAllPrompts();
  res.json(prompts);
});

// GET /api/prompts/:id
router.get('/:id', async (req: Request, res: Response) => {
  const prompt = await promptService.getPromptById(req.params.id);
  if (prompt) {
    res.json(prompt);
  } else {
    res.status(404).json({ message: 'Prompt not found' });
  }
});

// POST /api/prompts
router.post('/', async (req: Request, res: Response) => {
  const newPromptData: Omit<Prompt, 'id' | 'version'> = req.body;
  const createdPrompt = await promptService.createPrompt(newPromptData);
  res.status(201).json(createdPrompt);
});

// POST /api/prompts/:id/versions
router.post('/:id/versions', async (req: Request, res: Response) => {
    const { content } = req.body;
    const newVersion = await promptService.addPromptVersion(req.params.id, content);
    res.status(201).json(newVersion);
});

// POST /api/prompts/:id/rollback/:versionId
router.post('/:id/rollback/:versionId', async (req: Request, res: Response) => {
    const updatedPrompt = await promptService.rollbackPromptToVersion(req.params.id, req.params.versionId);
    if(updatedPrompt) {
        res.json(updatedPrompt);
    } else {
        res.status(404).json({ message: 'Prompt or version not found' });
    }
});

// PATCH /api/prompts/:id
router.patch('/:id', async (req: Request, res: Response) => {
    const updatedPrompt = await promptService.updatePromptMetadata(req.params.id, req.body);
    if (updatedPrompt) {
        res.json(updatedPrompt);
    } else {
        res.status(404).json({ message: 'Prompt not found' });
    }
});

// DELETE /api/prompts/:id
router.delete('/:id', async (req: Request, res: Response) => {
    const result = await promptService.deletePrompt(req.params.id);
    if (result.success) {
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Prompt not found' });
    }
});

export default router;
