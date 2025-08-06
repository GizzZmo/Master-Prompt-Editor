// API routes for Mirascope-inspired evaluation and versioning
import { Router, Request, Response } from 'express';
import { MirascopeService } from '../services/MirascopeService';

const router = Router();
const mirascopeService = new MirascopeService();

// Evaluation endpoints
router.post('/prompts/:promptId/evaluate', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.params;
    const { version, content, evaluationType, testDataset, costModel } = req.body;

    if (!version || !content || !evaluationType) {
      return res.status(400).json({ error: 'Version, content, and evaluation type are required' });
    }

    const config = {
      evaluationType,
      testDataset,
      costModel,
    };

    const evaluation = await mirascopeService.evaluatePrompt(promptId, version, content, config);
    res.json(evaluation);
  } catch (error) {
    console.error('Error evaluating prompt:', error);
    res.status(500).json({ error: 'Failed to evaluate prompt' });
  }
});

router.get('/prompts/:promptId/evaluations', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.params;
    const evaluations = await mirascopeService.getPromptEvaluations(promptId);
    res.json(evaluations);
  } catch (error) {
    console.error('Error fetching evaluations:', error);
    res.status(500).json({ error: 'Failed to fetch evaluations' });
  }
});

// Cost analytics endpoints
router.post('/prompts/:promptId/cost-analytics', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.params;
    const { calls, inputTokens, outputTokens } = req.body;

    if (typeof calls !== 'number' || typeof inputTokens !== 'number' || typeof outputTokens !== 'number') {
      return res.status(400).json({ error: 'Calls, input tokens, and output tokens must be numbers' });
    }

    const analytics = await mirascopeService.calculateCostAnalytics(promptId, calls, inputTokens, outputTokens);
    res.json(analytics);
  } catch (error) {
    console.error('Error calculating cost analytics:', error);
    res.status(500).json({ error: 'Failed to calculate cost analytics' });
  }
});

router.get('/prompts/:promptId/cost-analytics', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.params;
    const analytics = await mirascopeService.getCostAnalytics(promptId);
    
    if (!analytics) {
      return res.status(404).json({ error: 'Cost analytics not found for this prompt' });
    }
    
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching cost analytics:', error);
    res.status(500).json({ error: 'Failed to fetch cost analytics' });
  }
});

// Version comparison endpoint
router.post('/prompts/:promptId/compare-versions', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.params;
    const { version1, version2 } = req.body;

    if (!version1 || !version2) {
      return res.status(400).json({ error: 'Both version1 and version2 are required' });
    }

    const comparison = await mirascopeService.comparePromptVersions(promptId, version1, version2);
    res.json(comparison);
  } catch (error) {
    console.error('Error comparing versions:', error);
    res.status(500).json({ error: 'Failed to compare versions' });
  }
});

// A/B testing endpoint
router.post('/prompts/:promptId/ab-test', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.params;
    const { versionA, versionB, evaluationType, testDataset, costModel } = req.body;

    if (!versionA || !versionB || !evaluationType) {
      return res.status(400).json({ error: 'Version A, Version B, and evaluation type are required' });
    }

    const testConfig = {
      evaluationType,
      testDataset,
      costModel,
    };

    const abTestResult = await mirascopeService.runABTest(promptId, versionA, versionB, testConfig);
    res.json(abTestResult);
  } catch (error) {
    console.error('Error running A/B test:', error);
    res.status(500).json({ error: 'Failed to run A/B test' });
  }
});

// Batch evaluation endpoint for multiple prompts
router.post('/batch-evaluate', async (req: Request, res: Response) => {
  try {
    const { prompts, evaluationType } = req.body;

    if (!Array.isArray(prompts) || !evaluationType) {
      return res.status(400).json({ error: 'Prompts array and evaluation type are required' });
    }

    const results = await Promise.all(
      prompts.map(async (prompt: any) => {
        const config = { evaluationType };
        return await mirascopeService.evaluatePrompt(prompt.id, prompt.version, prompt.content, config);
      })
    );

    res.json({ results, summary: { total: results.length, averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length }});
  } catch (error) {
    console.error('Error running batch evaluation:', error);
    res.status(500).json({ error: 'Failed to run batch evaluation' });
  }
});

// Performance dashboard data endpoint
router.get('/dashboard/performance', async (req: Request, res: Response) => {
  try {
    // This would aggregate performance data across all prompts in a real implementation
    const dashboardData = {
      totalEvaluations: 0, // Would be calculated from stored data
      averageScore: 0.85,
      topPerformingPrompts: [],
      recentEvaluations: [],
      costTrends: {
        thisMonth: 0,
        lastMonth: 0,
        trend: 'stable',
      },
    };

    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;