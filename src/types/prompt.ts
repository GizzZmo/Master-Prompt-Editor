export interface Prompt {
  id: string;
  name: string;
  description: string;
  tags: string[];
  // FIX: Added content and version to represent the active state
  content: string;
  version: string;
  versions: PromptVersion[];
}

export interface PromptVersion {
  // FIX: Added id and promptId for unique identification
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
