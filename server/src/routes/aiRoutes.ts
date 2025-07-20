// server/src/routes/aiRoutes.ts

import { Router, Request, Response } from 'express'; // FIX: Imported Request and Response types
import { AIManager } from '../services/AIManagerService';

// FIX: Removed unused 'MultimodalOutput' import

const router = Router();
const aiManager = new AIManager();

// Define a type for the expected request body to avoid using 'any'
interface AIRequestPayload {
  prompt: string;
  config: object; // TODO: Define a proper interface for the AI config
}

router.post('/generate', async (req: Request, res: Response) => {
  try {
    // FIX: Typed the request body
    const { prompt, config } = req.body as AIRequestPayload;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const result = await aiManager.generateContent(prompt, config);
    res.status(200).json(result);
  } catch (error) {
    // FIX: Typed the error object
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to generate content', details: errorMessage });
  }
});

// NOTE: The following routes are placeholders based on the repeating errors.
// They have been fixed to use proper types.

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const data = req.body; // TODO: Define a proper type for 'data'
    const result = await aiManager.analyzeContent(data);
    res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to analyze content', details: errorMessage });
  }
});

router.post('/summarize', async (req: Request, res: Response) => {
  try {
    const text = req.body.text; // TODO: Define a proper type for the body
    const result = await aiManager.summarizeContent(text);
    res.status(200).json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ error: 'Failed to summarize content', details: errorMessage });
  }
});

export default router;
