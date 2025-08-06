// Collaborative features service
import { v4 as uuidv4 } from 'uuid';
import { 
  PromptVote, 
  PromptComment, 
  PromptAnnotation,
  SharedPromptLibrary 
} from '../../../src/types/prompt';

export class CollaborationService {
  private votes: Map<string, PromptVote> = new Map();
  private comments: Map<string, PromptComment> = new Map();
  private libraries: Map<string, SharedPromptLibrary> = new Map();
  private annotations: Map<string, PromptAnnotation> = new Map();

  // Voting functionality
  public async voteOnPrompt(promptId: string, userId: string, voteType: 'up' | 'down'): Promise<PromptVote> {
    // Check if user already voted, update if exists
    const existingVote = Array.from(this.votes.values()).find(
      vote => vote.promptId === promptId && vote.userId === userId
    );

    if (existingVote) {
      existingVote.voteType = voteType;
      this.votes.set(existingVote.id, existingVote);
      return existingVote;
    }

    const vote: PromptVote = {
      id: uuidv4(),
      promptId,
      userId,
      voteType,
      createdAt: new Date().toISOString(),
    };

    this.votes.set(vote.id, vote);
    return vote;
  }

  public async getPromptVotes(promptId: string): Promise<PromptVote[]> {
    return Array.from(this.votes.values()).filter(vote => vote.promptId === promptId);
  }

  public async getVoteSummary(promptId: string): Promise<{ upVotes: number; downVotes: number; score: number }> {
    const votes = await this.getPromptVotes(promptId);
    const upVotes = votes.filter(vote => vote.voteType === 'up').length;
    const downVotes = votes.filter(vote => vote.voteType === 'down').length;
    const score = upVotes - downVotes;

    return { upVotes, downVotes, score };
  }

  // Commenting functionality
  public async addComment(
    promptId: string, 
    userId: string, 
    content: string, 
    parentCommentId?: string
  ): Promise<PromptComment> {
    const comment: PromptComment = {
      id: uuidv4(),
      promptId,
      userId,
      content,
      createdAt: new Date().toISOString(),
      parentCommentId,
      annotations: [],
    };

    this.comments.set(comment.id, comment);
    return comment;
  }

  public async getPromptComments(promptId: string): Promise<PromptComment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.promptId === promptId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  public async getCommentReplies(commentId: string): Promise<PromptComment[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.parentCommentId === commentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  // Annotation functionality
  public async addAnnotation(
    commentId: string,
    startPosition: number,
    endPosition: number,
    annotationType: 'suggestion' | 'highlight' | 'concern',
    content: string
  ): Promise<PromptAnnotation> {
    const annotation: PromptAnnotation = {
      id: uuidv4(),
      commentId,
      startPosition,
      endPosition,
      annotationType,
      content,
    };

    this.annotations.set(annotation.id, annotation);

    // Add annotation to the comment
    const comment = this.comments.get(commentId);
    if (comment) {
      if (!comment.annotations) comment.annotations = [];
      comment.annotations.push(annotation);
      this.comments.set(commentId, comment);
    }

    return annotation;
  }

  // Shared Library functionality
  public async createSharedLibrary(
    name: string,
    description: string,
    ownerId: string,
    isPublic: boolean = false
  ): Promise<SharedPromptLibrary> {
    const library: SharedPromptLibrary = {
      id: uuidv4(),
      name,
      description,
      ownerId,
      collaborators: [],
      prompts: [],
      isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.libraries.set(library.id, library);
    return library;
  }

  public async getSharedLibraries(userId?: string): Promise<SharedPromptLibrary[]> {
    return Array.from(this.libraries.values()).filter(library => 
      library.isPublic || 
      library.ownerId === userId || 
      library.collaborators.includes(userId || '')
    );
  }

  public async addPromptToLibrary(libraryId: string, promptId: string, userId: string): Promise<boolean> {
    const library = this.libraries.get(libraryId);
    if (!library) return false;

    // Check if user has permission to add to this library
    if (library.ownerId !== userId && !library.collaborators.includes(userId)) {
      return false;
    }

    if (!library.prompts.includes(promptId)) {
      library.prompts.push(promptId);
      library.updatedAt = new Date().toISOString();
      this.libraries.set(libraryId, library);
    }

    return true;
  }

  public async addCollaborator(libraryId: string, collaboratorId: string, ownerId: string): Promise<boolean> {
    const library = this.libraries.get(libraryId);
    if (!library || library.ownerId !== ownerId) return false;

    if (!library.collaborators.includes(collaboratorId)) {
      library.collaborators.push(collaboratorId);
      library.updatedAt = new Date().toISOString();
      this.libraries.set(libraryId, library);
    }

    return true;
  }

  public async getLibraryPrompts(libraryId: string, userId?: string): Promise<string[]> {
    const library = this.libraries.get(libraryId);
    if (!library) return [];

    // Check if user has access to this library
    if (!library.isPublic && 
        library.ownerId !== userId && 
        !library.collaborators.includes(userId || '')) {
      return [];
    }

    return library.prompts;
  }

  // Utility methods for UI components
  public async getCollaborationSummary(promptId: string): Promise<{
    voteSummary: { upVotes: number; downVotes: number; score: number };
    commentCount: number;
    annotationCount: number;
    sharedLibraries: string[];
  }> {
    const voteSummary = await this.getVoteSummary(promptId);
    const comments = await this.getPromptComments(promptId);
    const commentCount = comments.length;
    const annotationCount = comments.reduce((total, comment) => total + (comment.annotations?.length || 0), 0);
    
    // Find libraries containing this prompt
    const sharedLibraries = Array.from(this.libraries.values())
      .filter(library => library.prompts.includes(promptId))
      .map(library => library.id);

    return {
      voteSummary,
      commentCount,
      annotationCount,
      sharedLibraries,
    };
  }
}