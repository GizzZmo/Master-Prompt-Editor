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
export type AIModelType = 'GPT-4' | 'GPT-3.5' | 'DALL-E 3' | 'Whisper' | 'Llama 3' | 'Claude' | 'Claude-3.5-Sonnet' | 'Gemini';

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
 * Pricing configuration for a single AI model.
 * Values are expressed as cost per 1K tokens.
 */
export interface AIModelPricing {
  model: string;
  provider: string;
  inputCostPer1k: number;
  outputCostPer1k: number;
}

/**
 * Interface for pluggable AI providers.
 * This enables a modular, dependency-injected architecture for adding new models.
 */
export interface AIProvider {
  /** Stable identifier for the provider (e.g., 'openai', 'anthropic', 'google') */
  id: string;
  /** Human-readable provider name */
  name: string;
  /** Models supported by this provider */
  models: AIModelPricing[];
  /** Whether the provider can run multiple models in parallel for A/B tests */
  supportsParallel?: boolean;
  /** Optional capability flags for future expansion */
  capabilities?: string[];
  /**
   * Generate content with the provider. The return type is intentionally loose to support diverse responses.
   */
  generate: (
    prompt: string,
    options: Partial<AIConfig>
  ) => Promise<{ text: string; raw?: unknown; tokenUsage?: { input: number; output: number } }>;
  /**
   * Estimate cost for a token budget so the UI can render live cost calculators without calling the provider.
   */
  estimateCost: (model: string, tokenUsage: { input: number; output: number }) => number;
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
  /** Optional agent ID for assistant/system messages */
  agentId?: string;
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

/**
 * AI Agent configuration for the orchestrator.
 * Each agent represents a different AI model with specific capabilities.
 */
export interface AIAgent {
  /** Unique identifier for the agent */
  id: string;
  /** Display name of the agent */
  name: string;
  /** Underlying AI model type */
  model: AIModelType;
  /** Provider (e.g., 'OpenAI', 'Anthropic', 'Meta') */
  provider: string;
  /** Whether this agent is free to use */
  isFree: boolean;
  /** Estimated response speed (e.g., 'Fast', 'Medium', 'Slow') */
  speed: 'Very Fast' | 'Fast' | 'Medium' | 'Slow';
  /** Cost per 1000 tokens (input/output) */
  costPer1kTokens?: string;
  /** Maximum context window size */
  contextWindow: string;
  /** Brief description of the agent's capabilities */
  description: string;
  /** Whether the agent is currently available */
  isAvailable: boolean;
}

/**
 * Configuration for the chatbot orchestrator.
 */
export interface OrchestratorConfig {
  /** Default agent to use when starting a conversation */
  defaultAgentId: string;
  /** Whether to auto-select the best agent based on task */
  autoSelectAgent: boolean;
  /** Maximum conversation history to maintain */
  maxHistoryLength: number;
  /** Whether to log all agent interactions */
  enableLogging: boolean;
}

/**
 * Request to send a message through the orchestrator.
 */
export interface ChatRequest {
  /** The user's message */
  message: string;
  /** Optional session ID to continue an existing conversation */
  sessionId?: string;
  /** Optional specific agent to use (otherwise uses orchestrator logic) */
  agentId?: string;
  /** Optional context or additional parameters */
  context?: Record<string, unknown>;
}

/**
 * Response from the orchestrator containing the agent's reply.
 */
export interface ChatResponse {
  /** Session ID for this conversation */
  sessionId: string;
  /** The agent that generated this response */
  agentId: string;
  /** Agent's display name */
  agentName: string;
  /** The response message */
  message: string;
  /** Timestamp of the response */
  timestamp: string;
  /** Approximate cost of this interaction */
  cost?: number;
  /** Time taken to generate response (in ms) */
  durationMs?: number;
}
