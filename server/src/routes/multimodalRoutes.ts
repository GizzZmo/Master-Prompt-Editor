// API routes for multimodal features
import { Router, Request, Response } from 'express';
import { MultimodalService } from '../services/MultimodalService';

const router = Router();
const multimodalService = new MultimodalService();

// Media upload endpoint (mock - in real implementation would handle file uploads)
router.post('/media/upload', async (req: Request, res: Response) => {
  try {
    const { type, mimeType, metadata } = req.body;

    if (!type || !mimeType || !['image', 'audio', 'video'].includes(type)) {
      return res.status(400).json({ error: 'Valid type and mimeType are required' });
    }

    // Mock file buffer - in real implementation, this would come from multer or similar
    const mockBuffer = Buffer.from('mock file content');
    
    const mediaInput = await multimodalService.uploadMediaInput(
      type as 'image' | 'audio' | 'video',
      mockBuffer,
      mimeType,
      metadata
    );

    res.json(mediaInput);
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
});

// Multimodal processing endpoint
router.post('/process', async (req: Request, res: Response) => {
  try {
    const { textContent, mediaInputs, processingOptions } = req.body;

    if (!textContent || !Array.isArray(mediaInputs)) {
      return res.status(400).json({ error: 'Text content and media inputs array are required' });
    }

    const request = {
      textContent,
      mediaInputs,
      processingOptions: processingOptions || {
        imageAnalysis: true,
        audioTranscription: true,
        multimodalFusion: true,
      },
    };

    const result = await multimodalService.processMultimodalPrompt(request);
    res.json(result);
  } catch (error) {
    console.error('Error processing multimodal prompt:', error);
    res.status(500).json({ error: 'Failed to process multimodal prompt' });
  }
});

// Template generation endpoint
router.post('/templates/generate', async (req: Request, res: Response) => {
  try {
    const { modalityTypes, useCase } = req.body;

    if (!Array.isArray(modalityTypes) || modalityTypes.length === 0) {
      return res.status(400).json({ error: 'Modality types array is required' });
    }

    const template = await multimodalService.generateMultimodalTemplate(
      modalityTypes,
      useCase || 'general'
    );

    res.json(template);
  } catch (error) {
    console.error('Error generating multimodal template:', error);
    res.status(500).json({ error: 'Failed to generate multimodal template' });
  }
});

// Input validation endpoint
router.post('/validate-inputs', async (req: Request, res: Response) => {
  try {
    const { mediaInputs } = req.body;

    if (!Array.isArray(mediaInputs)) {
      return res.status(400).json({ error: 'Media inputs array is required' });
    }

    const validation = await multimodalService.validateMultimodalInputs(mediaInputs);
    res.json(validation);
  } catch (error) {
    console.error('Error validating multimodal inputs:', error);
    res.status(500).json({ error: 'Failed to validate multimodal inputs' });
  }
});

// Capabilities endpoint
router.get('/capabilities', async (req: Request, res: Response) => {
  try {
    const capabilities = await multimodalService.getProcessingCapabilities();
    res.json(capabilities);
  } catch (error) {
    console.error('Error fetching capabilities:', error);
    res.status(500).json({ error: 'Failed to fetch capabilities' });
  }
});

// Batch processing endpoint for multiple multimodal prompts
router.post('/batch-process', async (req: Request, res: Response) => {
  try {
    const { prompts } = req.body;

    if (!Array.isArray(prompts) || prompts.length === 0) {
      return res.status(400).json({ error: 'Prompts array is required' });
    }

    const results = await Promise.all(
      prompts.map(async (prompt: any) => {
        try {
          return await multimodalService.processMultimodalPrompt(prompt);
        } catch (error) {
          return { error: `Failed to process prompt: ${error}`, promptIndex: prompts.indexOf(prompt) };
        }
      })
    );

    const successfulResults = results.filter(result => !('error' in result));
    const errors = results.filter(result => 'error' in result);

    res.json({
      results: successfulResults,
      errors,
      summary: {
        total: prompts.length,
        successful: successfulResults.length,
        failed: errors.length,
      }
    });
  } catch (error) {
    console.error('Error processing batch multimodal prompts:', error);
    res.status(500).json({ error: 'Failed to process batch multimodal prompts' });
  }
});

// Analysis endpoint for specific media types
router.post('/analyze/:mediaType', async (req: Request, res: Response) => {
  try {
    const { mediaType } = req.params;
    const { mediaInputs } = req.body;

    if (!['image', 'audio', 'video'].includes(mediaType)) {
      return res.status(400).json({ error: 'Invalid media type. Must be image, audio, or video' });
    }

    if (!Array.isArray(mediaInputs)) {
      return res.status(400).json({ error: 'Media inputs array is required' });
    }

    // Filter inputs by media type
    const filteredInputs = mediaInputs.filter((input: any) => input.type === mediaType);

    if (filteredInputs.length === 0) {
      return res.status(400).json({ error: `No ${mediaType} inputs found` });
    }

    // Create a simple processing request for analysis only
    const request = {
      textContent: `Analyze the provided ${mediaType} content`,
      mediaInputs: filteredInputs,
      processingOptions: {
        imageAnalysis: mediaType === 'image',
        audioTranscription: mediaType === 'audio',
        multimodalFusion: false,
      },
    };

    const result = await multimodalService.processMultimodalPrompt(request);
    res.json({
      mediaType,
      analysisCount: filteredInputs.length,
      analysis: result.mediaAnalysis,
    });
  } catch (error) {
    console.error(`Error analyzing ${req.params.mediaType}:`, error);
    res.status(500).json({ error: `Failed to analyze ${req.params.mediaType}` });
  }
});

export default router;