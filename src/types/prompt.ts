export interface Prompt {
  id: string;
  name: string;
  description: string;
  tags: string[];
  content: string;
  version: string;
  versions: PromptVersion[];
  // Collaborative features
  isShared?: boolean;
  sharedLibraryId?: string;
  votes?: PromptVote[];
  comments?: PromptComment[];
  // Responsible AI features
  ethicalTags?: string[];
  biasDetectionResult?: BiasDetectionResult;
  // Multimodal support
  modalityType: 'text' | 'text-image' | 'text-audio' | 'multimodal';
  mediaInputs?: MediaInput[];
}

export interface PromptVersion {
  id: string;
  promptId: string;
  version: string;
  content: string;
  createdAt: string;
  // FIX: Replaced 'any' with the safer 'unknown' type.
  metadata?: Record<string, unknown>;
}

export interface PromptCategory {
    id: string;
    name: string;
}

export interface LLMCallLog {
    id: string;
    timestamp: string;
    request: object;
    response: object;
}

export interface PromptEvaluationResult {
    score: number;
    reasoning: string;
    suggestions?: string[];
}

export interface PromptOptimizationStrategy {
    id: string;
    name: string;
    apply: (prompt: Prompt) => Prompt;
}

// Collaborative Features
export interface PromptVote {
  id: string;
  promptId: string;
  userId: string;
  voteType: 'up' | 'down';
  createdAt: string;
}

export interface PromptComment {
  id: string;
  promptId: string;
  userId: string;
  content: string;
  createdAt: string;
  parentCommentId?: string;
  annotations?: PromptAnnotation[];
}

export interface PromptAnnotation {
  id: string;
  commentId: string;
  startPosition: number;
  endPosition: number;
  annotationType: 'suggestion' | 'highlight' | 'concern';
  content: string;
}

export interface SharedPromptLibrary {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  collaborators: string[];
  prompts: string[]; // Prompt IDs
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Responsible AI Features
export interface BiasDetectionResult {
  overallScore: number; // 0-1, where 0 is no bias detected
  categories: BiasCategory[];
  suggestions: string[];
  detectedAt: string;
}

export interface BiasCategory {
  type: 'gender' | 'race' | 'age' | 'religion' | 'socioeconomic' | 'other';
  score: number;
  evidence: string[];
}

export interface EthicalPromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  ethicalGuidelines: string[];
  tags: string[];
}

// Multimodal Support
export interface MediaInput {
  id: string;
  type: 'image' | 'audio' | 'video';
  url: string;
  mimeType: string;
  size: number;
  metadata?: Record<string, unknown>;
}

// Prompt Versioning & Evaluation (Mirascope-inspired)
export interface PromptEvaluation {
  id: string;
  promptId: string;
  version: string;
  evaluationType: 'performance' | 'cost' | 'bias' | 'quality';
  score: number;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface CostAnalytics {
  promptId: string;
  totalCost: number;
  averageCostPerCall: number;
  totalCalls: number;
  costBreakdown: {
    inputTokens: number;
    outputTokens: number;
    modelCost: number;
  };
  timeRange: {
    start: string;
    end: string;
  };
}
