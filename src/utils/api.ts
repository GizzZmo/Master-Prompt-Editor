// /src/utils/api.ts

import { Prompt, AIModelType, AITaskExecutionLog, AIWorkflow, PromptEvaluationResult, PromptOptimizationStrategyType } from '../types/ai';

// API base URL configuration - uses environment variable or falls back to relative path
const BASE_URL = process.env.REACT_APP_API_URL || '/api';

/**
 * Generic HTTP request helper with error handling.
 * Automatically parses JSON responses and throws meaningful errors for failed requests.
 * 
 * @param endpoint - API endpoint path (will be appended to BASE_URL)
 * @param options - Fetch API options (method, headers, body, etc.)
 * @returns Promise resolving to parsed JSON response
 * @throws Error with message from API response or generic error
 */
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorBody.message || `API request failed: ${response.statusText}`);
  }
  return response.json();
}

// Type for creating new prompts (excludes server-generated fields)
type NewPromptData = Omit<Prompt, 'id' | 'version'>;

/**
 * Core API functions for prompt management.
 * Provides CRUD operations for prompts with proper TypeScript typing.
 */
export const api = {
  /** Fetch all available prompts */
  getPrompts: (): Promise<Prompt[]> => request('/prompts'),

  /** Fetch a specific prompt by ID */
  getPrompt: (id: string): Promise<Prompt> => request(`/prompts/${id}`),

  /** Update an existing prompt */
  savePrompt: (prompt: Prompt): Promise<Prompt> =>
    request(`/prompts/${prompt.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prompt),
    }),

  /** Create a new prompt */
  createPrompt: (promptData: NewPromptData): Promise<Prompt> =>
    request('/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promptData),
    }),
  
  // Add other API methods here as needed
};

/**
 * Configuration options for AI content generation
 */
interface AIConfig {
  /** AI model to use (e.g., 'GPT-4', 'GPT-3.5') */
  model?: string;
  /** Temperature for response randomness (0.0 = deterministic, 1.0 = very random) */
  temperature?: number;
}

/**
 * Standardized response format for AI generation requests
 */
interface AIResponse {
  /** Whether the request was successful */
  success: boolean;
  /** Generated content (only present if successful) */
  data?: { text: string };
  /** Error message (only present if failed) */
  error?: string;
}

/**
 * Generates AI content using the configured AI service.
 * 
 * This function provides a standardized interface for AI content generation
 * within the prompt playground. It handles API communication, error handling,
 * and response formatting.
 * 
 * @param prompt - The complete prompt text to send to the AI
 * @param config - Configuration options for the AI generation
 * @returns Promise resolving to standardized AI response object
 * 
 * @example
 * ```typescript
 * const response = await generateAIContent(
 *   "Write a professional email about...",
 *   { model: 'GPT-4', temperature: 0.7 }
 * );
 * 
 * if (response.success) {
 *   console.log(response.data.text);
 * } else {
 *   console.error(response.error);
 * }
 * ```
 */
export const generateAIContent = async (prompt: string, config: AIConfig): Promise<AIResponse> => {
  try {
    const response = await request<{ text: string }>('/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, config }),
    });
    return { success: true, data: response };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Additional API functions for missing imports

export const getAIModels = async (): Promise<AIModelType[]> => {
  try {
    return await request<AIModelType[]>('/ai/models');
  } catch (error) {
    console.warn('Failed to fetch AI models, using defaults');
    return ['GPT-4', 'GPT-3.5', 'Claude'];
  }
};

export const getExecutionLogs = async (): Promise<AITaskExecutionLog[]> => {
  try {
    return await request<AITaskExecutionLog[]>('/ai/logs');
  } catch (error) {
    console.warn('Failed to fetch execution logs, generating mock data');
    // Return mock data for demonstration
    return [
      {
        id: 'log_1',
        workflowId: 'workflow_1',
        taskId: 'task_abc123',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'completed',
        success: true,
        startTime: new Date(Date.now() - 300000).toISOString(),
        endTime: new Date(Date.now() - 299500).toISOString(),
        durationMs: 500,
        cost: 0.0234
      },
      {
        id: 'log_2',
        workflowId: 'workflow_2',
        taskId: 'task_def456',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        status: 'completed',
        success: true,
        startTime: new Date(Date.now() - 600000).toISOString(),
        endTime: new Date(Date.now() - 599200).toISOString(),
        durationMs: 800,
        cost: 0.0456
      },
      {
        id: 'log_3',
        workflowId: 'workflow_3',
        taskId: 'task_ghi789',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        status: 'failed',
        success: false,
        startTime: new Date(Date.now() - 900000).toISOString(),
        endTime: new Date(Date.now() - 898000).toISOString(),
        durationMs: 2000,
        cost: 0.0123,
        error: 'API timeout'
      }
    ];
  }
};

export const createWorkflow = async (workflow: Omit<AIWorkflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<AIWorkflow> => {
  return request<AIWorkflow>('/ai/workflows', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(workflow),
  });
};

export const executeWorkflow = async (workflowId: string): Promise<AITaskExecutionLog> => {
  return request<AITaskExecutionLog>(`/ai/workflows/${workflowId}/execute`, {
    method: 'POST',
  });
};

export const optimizePrompt = async (promptId: string, strategy: PromptOptimizationStrategyType): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await request<Prompt>(`/prompts/${promptId}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ strategy }),
    });
    return { success: true, data: response };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

export const evaluatePrompt = async (promptId: string, evaluationResult: PromptEvaluationResult): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const response = await request<PromptEvaluationResult>(`/prompts/${promptId}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evaluationResult),
    });
    return { success: true, data: response };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
