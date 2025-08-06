// /src/types/ai.ts

export interface Prompt {
  id: string;
  name: string;
  content: string;
  version: string;
  // Collaborative features
  isShared?: boolean;
  sharedLibraryId?: string;
  votes?: Array<{
    id: string;
    promptId: string;
    userId: string;
    voteType: 'up' | 'down';
    createdAt: string;
  }>;
  comments?: Array<{
    id: string;
    promptId: string;
    userId: string;
    content: string;
    createdAt: string;
  }>;
  // Responsible AI features
  ethicalTags?: string[];
  biasDetectionResult?: {
    overallScore: number;
    categories: Array<{
      type: string;
      score: number;
    }>;
    suggestions: string[];
  };
  // Multimodal support
  modalityType?: 'text' | 'text-image' | 'text-audio' | 'multimodal';
}

export interface PromptVersion {
  id: string;
  promptId: string;
  version: string;
  content: string;
  createdAt: string;
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

// A function that takes a map of variables and returns a string.
export type PromptTemplate = (variables: Record<string, string | number>) => string;

// A function to evaluate a prompt's output. 'unknown' is safer than 'any'.
export type PromptEvaluationFunction = (prompt: Prompt, output: unknown) => PromptEvaluationResult;

// A function to optimize a prompt based on previous results.
export type PromptOptimizationFunction = (prompt: Prompt, results: PromptEvaluationResult[]) => Prompt;
