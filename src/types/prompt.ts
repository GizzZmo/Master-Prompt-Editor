export interface Prompt {
  id: string;
  name: string;
  description: string;
  tags: string[];
  content: string;
  version: string;
  versions: PromptVersion[];
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
