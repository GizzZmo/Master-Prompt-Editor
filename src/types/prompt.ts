/* src/types/prompt.ts */

export type PromptCategory = 'marketing' | 'human-resources' | 'software-development' | 'general';

export type PromptVersion = {
  version: string; // Semantic versioning (X.Y.Z) as per 2.1
  content: string; // The actual prompt text
  metadata: {
    expectedOutcome: string;
    rationale: string;
    author: string;
    createdAt: string;
    lastModified: string;
    // Additional metadata for logging LLM calls (inputs, outputs, costs, token usage) as per 2.1
    llmCallLogs?: LLMCallLog[];
  };
};

export type Prompt = {
  id: string;
  name: string; // Structured naming format: {feature}-{purpose}-{version} as per 2.1
  category: PromptCategory;
  domain: string; // e.g., 'healthcare', 'finance' as per 2.1
  currentVersion: string; // Points to the active version
  versions: PromptVersion[];
};

export type LLMCallLog = {
  timestamp: string;
  promptVersionId: string; // Link to the specific prompt version used
  input: string; // The full input sent to the LLM
  output: string; // The full output received from the LLM
  cost: number; // Associated cost
  tokenUsage: number; // Token usage
  success: boolean;
  error?: string;
};

export type PromptEvaluationResult = {
  promptId: string;
  version: string;
  metric: string; // e.g., 'accuracy', 'relevance', 'user_satisfaction'
  score: number;
  feedback?: string; // User feedback or notes
  timestamp: string;
};

export type PromptOptimizationStrategy = 'meta-prompting' | 'gradient-based' | 'dspy';
