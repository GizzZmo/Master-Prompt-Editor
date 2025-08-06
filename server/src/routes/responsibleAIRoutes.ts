// API routes for Responsible AI features
import { Router, Request, Response } from 'express';
import { ResponsibleAIService } from '../services/ResponsibleAIService';

const router = Router();
const responsibleAIService = new ResponsibleAIService();

// Bias detection endpoints
router.post('/detect-bias', async (req: Request, res: Response) => {
  try {
    const { promptContent } = req.body;

    if (!promptContent || typeof promptContent !== 'string') {
      return res.status(400).json({ error: 'Prompt content is required and must be a string' });
    }

    const biasResult = await responsibleAIService.detectBias(promptContent);
    res.json(biasResult);
  } catch (error) {
    console.error('Error detecting bias:', error);
    res.status(500).json({ error: 'Failed to detect bias' });
  }
});

// Ethical validation endpoints
router.post('/validate-ethics', async (req: Request, res: Response) => {
  try {
    const { promptContent, templateId } = req.body;

    if (!promptContent || typeof promptContent !== 'string') {
      return res.status(400).json({ error: 'Prompt content is required and must be a string' });
    }

    const validation = await responsibleAIService.validatePromptEthics(promptContent, templateId);
    res.json(validation);
  } catch (error) {
    console.error('Error validating ethics:', error);
    res.status(500).json({ error: 'Failed to validate ethics' });
  }
});

// Ethical template endpoints
router.get('/ethical-templates', async (req: Request, res: Response) => {
  try {
    const templates = await responsibleAIService.getEthicalTemplates();
    res.json(templates);
  } catch (error) {
    console.error('Error fetching ethical templates:', error);
    res.status(500).json({ error: 'Failed to fetch ethical templates' });
  }
});

router.get('/ethical-templates/:templateId', async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const template = await responsibleAIService.getEthicalTemplate(templateId);
    
    if (!template) {
      return res.status(404).json({ error: 'Ethical template not found' });
    }
    
    res.json(template);
  } catch (error) {
    console.error('Error fetching ethical template:', error);
    res.status(500).json({ error: 'Failed to fetch ethical template' });
  }
});

router.post('/ethical-templates', async (req: Request, res: Response) => {
  try {
    const { name, description, template, ethicalGuidelines, tags } = req.body;

    if (!name || !description || !template || !Array.isArray(ethicalGuidelines)) {
      return res.status(400).json({ 
        error: 'Name, description, template, and ethical guidelines are required' 
      });
    }

    const ethicalTemplate = await responsibleAIService.createEthicalTemplate(
      name, description, template, ethicalGuidelines, tags || []
    );
    
    res.json(ethicalTemplate);
  } catch (error) {
    console.error('Error creating ethical template:', error);
    res.status(500).json({ error: 'Failed to create ethical template' });
  }
});

// Template application endpoint
router.post('/ethical-templates/:templateId/apply', async (req: Request, res: Response) => {
  try {
    const { templateId } = req.params;
    const { variables } = req.body;

    if (!variables || typeof variables !== 'object') {
      return res.status(400).json({ error: 'Variables object is required' });
    }

    const appliedTemplate = await responsibleAIService.applyEthicalTemplate(templateId, variables);
    res.json({ appliedTemplate });
  } catch (error) {
    console.error('Error applying ethical template:', error);
    const message = error instanceof Error ? error.message : 'Failed to apply ethical template';
    res.status(500).json({ error: message });
  }
});

// Comprehensive prompt analysis endpoint
router.post('/analyze-prompt', async (req: Request, res: Response) => {
  try {
    const { promptContent, templateId } = req.body;

    if (!promptContent || typeof promptContent !== 'string') {
      return res.status(400).json({ error: 'Prompt content is required and must be a string' });
    }

    // Run both bias detection and ethical validation
    const [biasResult, ethicsValidation] = await Promise.all([
      responsibleAIService.detectBias(promptContent),
      responsibleAIService.validatePromptEthics(promptContent, templateId)
    ]);

    const analysis = {
      biasDetection: biasResult,
      ethicsValidation,
      overallAssessment: {
        score: (ethicsValidation.score + (1 - biasResult.overallScore)) / 2,
        isRecommended: ethicsValidation.isEthical && biasResult.overallScore < 0.3,
        summary: ethicsValidation.isEthical && biasResult.overallScore < 0.3
          ? 'Prompt meets ethical guidelines and shows low bias'
          : 'Prompt may need revision to improve ethical compliance and reduce bias'
      }
    };

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing prompt:', error);
    res.status(500).json({ error: 'Failed to analyze prompt' });
  }
});

// Bias detection history endpoint
router.get('/prompts/:promptId/bias-history', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.params;
    const history = await responsibleAIService.getBiasDetectionHistory(promptId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching bias detection history:', error);
    res.status(500).json({ error: 'Failed to fetch bias detection history' });
  }
});

// Responsible AI dashboard endpoint
router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    // This would aggregate responsible AI metrics across all prompts
    const dashboardData = {
      totalAnalyses: 0, // Would be calculated from stored data
      averageBiasScore: 0.15, // Lower is better
      ethicalComplianceRate: 0.85,
      topEthicalConcerns: [
        'Gender bias in language',
        'Cultural assumptions',
        'Stereotyping in examples'
      ],
      recentAnalyses: [],
      trendData: {
        biasScoreImprovement: '+12%',
        ethicalComplianceImprovement: '+8%'
      }
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching responsible AI dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch responsible AI dashboard' });
  }
});

export default router;