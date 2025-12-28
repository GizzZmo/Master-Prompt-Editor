// server/src/routes/chatRoutes.ts

import { Router, Request, Response } from 'express';
import { OrchestratorService } from '../services/OrchestratorService';
import { auditAction } from '../middleware/auditLogging';

const router = Router();
const orchestrator = new OrchestratorService();

/**
 * POST /api/chat/send
 * Send a message and get a response from the orchestrator
 */
router.post(
  '/send',
  auditAction('chat_send', 'chat'),
  async (req: Request, res: Response) => {
    try {
      const { message, sessionId, agentId, context } = req.body;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const response = await orchestrator.chat({
        message,
        sessionId,
        agentId,
        context,
      });

      res.status(200).json(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Chat error:', errorMessage);
      res.status(500).json({ error: 'Failed to process chat message', details: errorMessage });
    }
  }
);

/**
 * GET /api/chat/agents
 * Get all available AI agents
 */
router.get(
  '/agents',
  auditAction('chat_agents_list', 'chat'),
  (_req: Request, res: Response) => {
    try {
      const agents = orchestrator.getAgents();
      res.status(200).json(agents);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching agents:', errorMessage);
      res.status(500).json({ error: 'Failed to fetch agents', details: errorMessage });
    }
  }
);

/**
 * GET /api/chat/agents/:agentId
 * Get details of a specific agent
 */
router.get(
  '/agents/:agentId',
  auditAction('chat_agent_details', 'chat'),
  (req: Request, res: Response) => {
    try {
      const { agentId } = req.params;
      const agent = orchestrator.getAgent(agentId);

      if (!agent) {
        return res.status(404).json({ error: 'Agent not found' });
      }

      res.status(200).json(agent);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching agent:', errorMessage);
      res.status(500).json({ error: 'Failed to fetch agent', details: errorMessage });
    }
  }
);

/**
 * GET /api/chat/sessions
 * Get all active chat sessions
 */
router.get(
  '/sessions',
  auditAction('chat_sessions_list', 'chat'),
  (_req: Request, res: Response) => {
    try {
      const sessions = orchestrator.getSessions();
      res.status(200).json(sessions);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching sessions:', errorMessage);
      res.status(500).json({ error: 'Failed to fetch sessions', details: errorMessage });
    }
  }
);

/**
 * GET /api/chat/sessions/:sessionId
 * Get a specific chat session
 */
router.get(
  '/sessions/:sessionId',
  auditAction('chat_session_details', 'chat'),
  (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const session = orchestrator.getSession(sessionId);

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.status(200).json(session);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching session:', errorMessage);
      res.status(500).json({ error: 'Failed to fetch session', details: errorMessage });
    }
  }
);

/**
 * DELETE /api/chat/sessions/:sessionId
 * Clear a chat session
 */
router.delete(
  '/sessions/:sessionId',
  auditAction('chat_session_clear', 'chat'),
  (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const success = orchestrator.clearSession(sessionId);

      if (!success) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.status(200).json({ message: 'Session cleared successfully' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error clearing session:', errorMessage);
      res.status(500).json({ error: 'Failed to clear session', details: errorMessage });
    }
  }
);

/**
 * POST /api/chat/sessions/:sessionId/switch-agent
 * Switch the agent in an existing session
 */
router.post(
  '/sessions/:sessionId/switch-agent',
  auditAction('chat_switch_agent', 'chat'),
  (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const { agentId } = req.body;

      if (!agentId || typeof agentId !== 'string') {
        return res.status(400).json({ error: 'Agent ID is required' });
      }

      const success = orchestrator.switchAgent(sessionId, agentId);

      if (!success) {
        return res.status(404).json({ error: 'Session or agent not found' });
      }

      res.status(200).json({ message: 'Agent switched successfully' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error switching agent:', errorMessage);
      res.status(500).json({ error: 'Failed to switch agent', details: errorMessage });
    }
  }
);

export default router;
