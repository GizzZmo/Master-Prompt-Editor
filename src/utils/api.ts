/* src/utils/api.ts */

import { Prompt, PromptEvaluationResult, PromptOptimizationStrategy, PromptVersion } from "../types/prompt";
import { AIModelType, AITaskExecutionLog, AIWorkflow, MultimodalInput, MultimodalOutput } from "../types/ai";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const fetchApi = async <T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization headers if needed
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.message || `API error: ${response.statusText}` };
    }

    const data: T = await response.json();
    return { success: true, data };
  } catch (error: any) {
    console.error(`API Call Error to ${endpoint}:`, error);
    return { success: false, error: error.message || 'Network error' };
  }
};

// --- Prompt Editor API Calls (Conceptual based on 2.1, 2.3, 2.4) ---

export const getPrompts = (): Promise<ApiResponse<Prompt[]>> => {
  return fetchApi<Prompt[]>('/prompts');
};

export const getPromptById = (id: string): Promise<ApiResponse<Prompt>> => {
  return fetchApi<Prompt>(`/prompts/${id}`);
};

export const createPrompt = (prompt: Partial<Prompt>): Promise<ApiResponse<Prompt>> => {
  return fetchApi<Prompt>('/prompts', { method: 'POST', body: JSON.stringify(prompt) });
};

export const updatePrompt = (id: string, prompt: Partial<Prompt>): Promise<ApiResponse<Prompt>> => {
  return fetchApi<Prompt>(`/prompts/${id}`, { method: 'PUT', body: JSON.stringify(prompt) });
};

export const deletePrompt = (id: string): Promise<ApiResponse<void>> => {
  return fetchApi<void>(`/prompts/${id}`, { method: 'DELETE' });
};

export const addPromptVersion = (promptId: string, version: Partial<PromptVersion>): Promise<ApiResponse<Prompt>> => {
  return fetchApi<Prompt>(`/prompts/${promptId}/versions`, { method: 'POST', body: JSON.stringify(version) });
};

export const rollbackPromptVersion = (promptId: string, version: string): Promise<ApiResponse<Prompt>> => {
  return fetchApi<Prompt>(`/prompts/${promptId}/rollback/${version}`, { method: 'POST' });
};

export const runPromptTest = (promptContent: string, options: any): Promise<ApiResponse<MultimodalOutput>> => {
  // Represents the 'playground' functionality (2.1)
  return fetchApi<MultimodalOutput>('/prompt-tests', { method: 'POST', body: JSON.stringify({ promptContent, options }) });
};

export const optimizePrompt = (promptId: string, strategy: PromptOptimizationStrategy): Promise<ApiResponse<Prompt>> => {
  // Automated Prompt Optimization (2.3)
  return fetchApi<Prompt>(`/prompts/${promptId}/optimize`, { method: 'POST', body: JSON.stringify({ strategy }) });
};

export const evaluatePrompt = (promptId: string, evaluation: PromptEvaluationResult): Promise<ApiResponse<void>> => {
  // Evaluation metrics (2.3)
  return fetchApi<void>(`/prompts/${promptId}/evaluate`, { method: 'POST', body: JSON.stringify(evaluation) });
};

// --- AI Toolkit API Calls (Conceptual based on 3.1, 3.2, 3.3) ---

export const executeAITask = (taskType: AITaskType, input: MultimodalInput, modelConfig?: any): Promise<ApiResponse<MultimodalOutput>> => {
  // Single AI task execution
  return fetchApi<MultimodalOutput>('/ai/task/execute', { method: 'POST', body: JSON.stringify({ taskType, input, modelConfig }) });
};

export const createWorkflow = (workflow: Partial<AIWorkflow>): Promise<ApiResponse<AIWorkflow>> => {
  return fetchApi<AIWorkflow>('/ai/workflows', { method: 'POST', body: JSON.stringify(workflow) });
};

export const getWorkflows = (): Promise<ApiResponse<AIWorkflow[]>> => {
  return fetchApi<AIWorkflow[]>('/ai/workflows');
};

export const executeWorkflow = (workflowId: string, initialInput: MultimodalInput): Promise<ApiResponse<AITaskExecutionLog>> => {
  // AI Task Chaining & Workflow Automation (3.2)
  return fetchApi<AITaskExecutionLog>(`/ai/workflows/${workflowId}/execute`, { method: 'POST', body: JSON.stringify({ initialInput }) });
};

export const getAIModels = (): Promise<ApiResponse<AIModelType[]>> => {
  // Flexible LLM integration (3.3)
  return fetchApi<AIModelType[]>('/ai/models');
};

export const getExecutionLogs = (): Promise<ApiResponse<AITaskExecutionLog[]>> => {
  // Performance monitoring (6.2)
  return fetchApi<AITaskExecutionLog[]>('/ai/logs');
};
