// /src/types/ai.ts

/**
 * Core prompt data structure representing a reusable AI prompt template
 */
export interface Prompt {
  /** Unique identifier for the prompt */
  id: string;
  /** Human-readable prompt name */
  name: string;
  /** The actual prompt content/template text */
  content: string;
  /** Version identifier for the current prompt iteration */
  version: string;
}

/**
 * Represents a specific version of a prompt for version control
 */
export interface PromptVersion {
  /** Unique identifier for this version */
  id: string;
  /** ID of the parent prompt */
  promptId: string;
  /** Version identifier (e.g., "1.0", "2.1") */
  version: string;
  /** Prompt content for this specific version */
  content: string;
  /** Timestamp when this version was created */
  createdAt: string;
}

/**
 * Category for organizing prompts by domain or use case
 */
export interface PromptCategory {
  /** Unique identifier for the category */
  id: string;
  /** Category display name */
  name: string;
}

/**
 * Log entry for tracking LLM API calls and responses
 */
export interface LLMCallLog {
  /** Unique identifier for this log entry */
  id: string;
  /** When the API call was made */
  timestamp: string;
  /** The request payload sent to the LLM */
  request: object;
  /** The response received from the LLM */
  response: object;
}

/**
 * Result of evaluating a prompt's effectiveness
 */
export interface PromptEvaluationResult {
  /** Numerical score (typically 0-1 or 0-100) */
  score: number;
  /** Explanation of the scoring rationale */
  reasoning: string;
  /** Optional suggestions for improvement */
  suggestions?: string[];
}

/**
 * Strategy for automatically optimizing prompts
 */
export interface PromptOptimizationStrategy {
  /** Unique identifier for the strategy */
  id: string;
  /** Human-readable strategy name */
  name: string;
  /** Function that applies the optimization to a prompt */
  apply: (prompt: Prompt) => Prompt;
}

/**
 * Function type for creating prompt templates with variable substitution
 */
export type PromptTemplate = (variables: Record<string, string | number>) => string;

/**
 * Function type for evaluating prompt effectiveness based on output quality
 */
export type PromptEvaluationFunction = (prompt: Prompt, output: unknown) => PromptEvaluationResult;

/**
 * Function type for optimizing prompts based on evaluation results
 */
export type PromptOptimizationFunction = (prompt: Prompt, results: PromptEvaluationResult[]) => Prompt;

// ===== CHAT HISTORY TYPES =====
// These types support the conversational AI features in the prompt playground

/**
 * Individual message in a chat conversation.
 * Supports different message types for proper conversation flow and UI styling.
 */
export interface ChatMessage {
  /** Unique identifier for the message (timestamp-based for simplicity) */
  id: string;
  /** Type of message determining its role in conversation and visual styling */
  type: 'user' | 'assistant' | 'system';
  /** The actual message content */
  content: string;
  /** ISO timestamp when the message was created */
  timestamp: string;
}

/**
 * Complete chat session containing conversation history.
 * Designed to support future features like session management and prompt association.
 */
export interface ChatSession {
  /** Unique identifier for the chat session */
  id: string;
  /** All messages in chronological order */
  messages: ChatMessage[];
  /** Optional association with a specific prompt (for future use) */
  promptId?: string;
  /** When the session was first created */
  createdAt: string;
  /** When the session was last modified */
  updatedAt: string;
}
