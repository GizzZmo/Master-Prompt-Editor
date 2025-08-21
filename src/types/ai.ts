// /src/types/ai.ts

// Re-export prompt types to avoid conflicts
export type { 
  Prompt, 
  PromptVersion, 
  PromptCategory, 
  PromptEvaluationResult, 
  PromptOptimizationStrategy,
  PromptOptimizationStrategyType 
} from './prompt';

/**
 * Supported AI model types for the toolkit
 */
export type AIModelType = 'GPT-4' | 'GPT-3.5' | 'DALL-E 3' | 'Whisper' | 'Llama 3' | 'Claude' | 'Gemini';

/**
 * Configuration for AI model settings
 */
export interface AIConfig {
  model: AIModelType;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
}

/**
 * Individual step in an AI workflow
 */
export interface AIWorkflowStep {
  id: string;
  name: string;
  type: 'prompt' | 'model' | 'processing';
  config: Record<string, unknown>;
  order: number;
  // Additional properties for compatibility
  taskType?: string;
  inputMapping?: Record<string, unknown>;
  outputMapping?: Record<string, unknown>;
}

/**
 * Complete AI workflow definition
 */
export interface AIWorkflow {
  id: string;
  name: string;
  description: string;
  steps: AIWorkflowStep[];
  createdAt: string;
  updatedAt: string;
  // Additional properties for compatibility
  createdBy?: string;
}

/**
 * Log entry for AI task execution
 */
export interface AITaskExecutionLog {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  result?: unknown;
  error?: string;
  // Additional properties for compatibility with components
  taskId?: string;
  timestamp?: string;
  success?: boolean;
  durationMs?: number;
  cost?: number;
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
 * Function type for creating prompt templates with variable substitution
 */
export type PromptTemplate = (variables: Record<string, string | number>) => string;

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
