import { Router, Request, Response } from 'express';
import { PromptService } from '../services/PromptService';
import { ResponsibleAIService } from '../services/ResponsibleAIService';
import { CollaborationService } from '../services/CollaborationService';
import { Prompt } from '../../../src/types/prompt';

const router = Router();
const promptService = new PromptService();
const responsibleAIService = new ResponsibleAIService();
const collaborationService = new CollaborationService();

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

// GET /api/prompts/:id/enhanced - includes collaboration and AI analysis
router.get('/:id/enhanced', async (req: Request, res: Response) => {
  try {
    const prompt = await promptService.getPromptById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    // Get collaboration summary and responsible AI analysis
    const [collaborationSummary, biasResult] = await Promise.all([
      collaborationService.getCollaborationSummary(req.params.id),
      responsibleAIService.detectBias(prompt.content)
    ]);

    const enhancedPrompt = {
      ...prompt,
      collaboration: collaborationSummary,
      biasDetectionResult: biasResult,
    };

    res.json(enhancedPrompt);
  } catch (error) {
    console.error('Error fetching enhanced prompt:', error);
    res.status(500).json({ error: 'Failed to fetch enhanced prompt data' });
  }
});

// POST /api/prompts
router.post('/', async (req: Request, res: Response) => {
  try {
    const newPromptData: Omit<Prompt, 'id' | 'version'> = req.body;
    
    // Run responsible AI analysis on new prompt
    if (newPromptData.content) {
      const biasResult = await responsibleAIService.detectBias(newPromptData.content);
      newPromptData.biasDetectionResult = biasResult;
      
      // Add ethical tags if bias detected
      if (biasResult.overallScore > 0.3) {
        newPromptData.ethicalTags = ['needs-review', 'bias-detected'];
      }
    }

    const createdPrompt = await promptService.createPrompt(newPromptData);
    res.status(201).json(createdPrompt);
  } catch (error) {
    console.error('Error creating prompt:', error);
    res.status(500).json({ error: 'Failed to create prompt' });
  }
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
