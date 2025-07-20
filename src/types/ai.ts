/**
 * Represents a single prompt structure used throughout the application.
 * NOTE: This file is for generic AI model interaction types. The detailed Prompt
 * structure with versioning is in `src/types/prompt.ts`.
 */

/**
 * Defines the configuration options for an AI model's generation request.
 */
export interface AIConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

/**
 * Represents a standard text output from an AI model.
 */
export interface TextOutput {
  text: string;
}

/**
 * Represents a potentially multimodal output that could include text, images, or other media.
 */
export interface MultimodalOutput {
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
}

/**
 * A generic API response structure for AI-related requests.
 */
export interface AIResponse<T> {
  success: boolean;
  data?: T; // Data can be optional on error
  error?: string;
}

/**
 * Type for AI models available in the system.
 */
export type AIModelType = 'GPT-4' | 'DALL-E 3' | 'Whisper' | 'Llama 3' | string; // Added string for extensibility

/**
 * Represents a log entry for an AI task execution.
 */
export interface AITaskExecutionLog {
  taskId: string;
  timestamp: string;
  modelUsed: AIModelType;
  taskType: string; // e.g., 'text-generation', 'image-analysis'
  inputSummary: string; // A brief summary of the input
  outputSummary: string; // A brief summary of the output
  durationMs: number;
  cost: number; // Estimated cost of the execution
  success: boolean;
  errorMessage?: string;
  details?: Record<string, any>; // Additional details for debugging/monitoring
}

/**
 * Represents a step in an AI workflow.
 */
export interface AIWorkflowStep {
  id: string;
  name: string;
  taskType: 'text-generation' | 'image-generation' | 'audio-generation' | 'code-generation' | 'multimodal-analysis' | string;
  // What comes in from previous step or initial input
  inputMapping: Record<string, any>;
  // What is produced for the next step or final output
  outputMapping: Record<string, any>;
  // Any specific configurations for this step's AI model
  config?: AIConfig;
  // Reference to a specific prompt if this step uses one
  promptId?: string;
}

/**
 * Represents an AI workflow, a chain of interconnected AI tasks.
 */
export interface AIWorkflow {
  id: string;
  name: string;
  description?: string;
  steps: AIWorkflowStep[];
  status: 'draft' | 'active' | 'archived';
  createdBy: string;
  createdAt: string;
  lastModified: string;
}
