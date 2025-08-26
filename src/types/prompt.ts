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
    promptId?: string;
    version?: string;
    metric?: string;
    score: number;
    reasoning: string;
    feedback?: string;
    timestamp?: string;
    suggestions?: string[];
    performanceMetrics?: PerformanceEvaluationMetrics;
}

export interface PerformanceEvaluationMetrics {
    responseTime: number; // milliseconds
    tokenUsage: {
        input: number;
        output: number;
        total: number;
    };
    cost: number; // USD
    accuracy?: number; // percentage
    latency: number; // milliseconds
    throughput?: number; // requests per second
    memoryUsage?: number; // bytes
    errorRate?: number; // percentage
}

export type PromptOptimizationStrategyType = 'meta-prompting' | 'gradient-based' | 'dspy' | 'chain-of-thought' | 'few-shot' | 'zero-shot';

export interface PromptOptimizationStrategy {
    id: string;
    name: string;
    apply: (prompt: Prompt) => Prompt;
}
