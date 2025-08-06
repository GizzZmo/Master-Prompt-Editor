// API routes for collaborative features
import { Router, Request, Response } from 'express';
import { CollaborationService } from '../services/CollaborationService';

const router = Router();
const collaborationService = new CollaborationService();

// Voting endpoints
router.post('/prompts/:promptId/vote', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.params;
    const { userId, voteType } = req.body;

    if (!userId || !voteType || !['up', 'down'].includes(voteType)) {
      return res.status(400).json({ error: 'Invalid vote data' });
    }

    const vote = await collaborationService.voteOnPrompt(promptId, userId, voteType);
    const summary = await collaborationService.getVoteSummary(promptId);
    
    res.json({ vote, summary });
  } catch (error) {
    console.error('Error voting on prompt:', error);
    res.status(500).json({ error: 'Failed to vote on prompt' });
  }
});

router.get('/prompts/:promptId/votes', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.params;
    const votes = await collaborationService.getPromptVotes(promptId);
    const summary = await collaborationService.getVoteSummary(promptId);
    
    res.json({ votes, summary });
  } catch (error) {
    console.error('Error fetching votes:', error);
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
});

// Commenting endpoints
router.post('/prompts/:promptId/comments', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.params;
    const { userId, content, parentCommentId } = req.body;

    if (!userId || !content) {
      return res.status(400).json({ error: 'User ID and content are required' });
    }

    const comment = await collaborationService.addComment(promptId, userId, content, parentCommentId);
    res.json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

router.get('/prompts/:promptId/comments', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.params;
    const comments = await collaborationService.getPromptComments(promptId);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

router.get('/comments/:commentId/replies', async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const replies = await collaborationService.getCommentReplies(commentId);
    res.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

// Annotation endpoints
router.post('/comments/:commentId/annotations', async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const { startPosition, endPosition, annotationType, content } = req.body;

    if (typeof startPosition !== 'number' || typeof endPosition !== 'number' || 
        !['suggestion', 'highlight', 'concern'].includes(annotationType) || !content) {
      return res.status(400).json({ error: 'Invalid annotation data' });
    }

    const annotation = await collaborationService.addAnnotation(
      commentId, startPosition, endPosition, annotationType, content
    );
    res.json(annotation);
  } catch (error) {
    console.error('Error adding annotation:', error);
    res.status(500).json({ error: 'Failed to add annotation' });
  }
});

// Shared Library endpoints
router.post('/libraries', async (req: Request, res: Response) => {
  try {
    const { name, description, ownerId, isPublic } = req.body;

    if (!name || !description || !ownerId) {
      return res.status(400).json({ error: 'Name, description, and owner ID are required' });
    }

    const library = await collaborationService.createSharedLibrary(name, description, ownerId, isPublic);
    res.json(library);
  } catch (error) {
    console.error('Error creating shared library:', error);
    res.status(500).json({ error: 'Failed to create shared library' });
  }
});

router.get('/libraries', async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    const libraries = await collaborationService.getSharedLibraries(userId as string);
    res.json(libraries);
  } catch (error) {
    console.error('Error fetching shared libraries:', error);
    res.status(500).json({ error: 'Failed to fetch shared libraries' });
  }
});

router.post('/libraries/:libraryId/prompts', async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;
    const { promptId, userId } = req.body;

    if (!promptId || !userId) {
      return res.status(400).json({ error: 'Prompt ID and user ID are required' });
    }

    const success = await collaborationService.addPromptToLibrary(libraryId, promptId, userId);
    
    if (!success) {
      return res.status(403).json({ error: 'Access denied or library not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding prompt to library:', error);
    res.status(500).json({ error: 'Failed to add prompt to library' });
  }
});

router.get('/libraries/:libraryId/prompts', async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;
    const { userId } = req.query;
    
    const prompts = await collaborationService.getLibraryPrompts(libraryId, userId as string);
    res.json(prompts);
  } catch (error) {
    console.error('Error fetching library prompts:', error);
    res.status(500).json({ error: 'Failed to fetch library prompts' });
  }
});

router.post('/libraries/:libraryId/collaborators', async (req: Request, res: Response) => {
  try {
    const { libraryId } = req.params;
    const { collaboratorId, ownerId } = req.body;

    if (!collaboratorId || !ownerId) {
      return res.status(400).json({ error: 'Collaborator ID and owner ID are required' });
    }

    const success = await collaborationService.addCollaborator(libraryId, collaboratorId, ownerId);
    
    if (!success) {
      return res.status(403).json({ error: 'Access denied or library not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error adding collaborator:', error);
    res.status(500).json({ error: 'Failed to add collaborator' });
  }
});

// Collaboration summary endpoint
router.get('/prompts/:promptId/collaboration-summary', async (req: Request, res: Response) => {
  try {
    const { promptId } = req.params;
    const summary = await collaborationService.getCollaborationSummary(promptId);
    res.json(summary);
  } catch (error) {
    console.error('Error fetching collaboration summary:', error);
    res.status(500).json({ error: 'Failed to fetch collaboration summary' });
  }
});

export default router;