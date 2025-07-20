import { AIResponse, AIModelType, AITaskExecutionLog, AIWorkflow } from '../types/ai';
import { Prompt, PromptVersion, PromptEvaluationResult, PromptOptimizationStrategy, PromptCategory } from '../types/prompt'; // Removed unused LLMCallLog import

const BASE_URL = 'http://localhost:3001/api';

// Unified API response type (using AIResponse from src/types/ai)
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<AIResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, options);

    // Handle 204 No Content for delete operations
    if (response.status === 204) {
      return { success: true };
    }

    const jsonResponse = await response.json();

    if (!response.ok) {
      // Backend errors might come with 'error' field, or a generic message
      const errorMessage = jsonResponse.error || jsonResponse.message || `HTTP error! status: ${response.status}`;
      return { success: false, error: errorMessage };
    }
    return { success: true, data: jsonResponse as T };
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    return { success: false, error: `Network error or invalid response: ${(error as Error).message}` };
  }
}

export const api = {
  get: async <T>(endpoint: string): Promise<AIResponse<T>> => {
    return apiRequest<T>(endpoint);
  },
  post: async <T, U>(endpoint: string, body: U): Promise<AIResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },
  put: async <T, U>(endpoint: string, body: U): Promise<AIResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  },
  delete: async <T>(endpoint: string): Promise<AIResponse<T>> => {
    return apiRequest<T>(endpoint, {
      method: 'DELETE',
    });
  },
};

// Specific API functions for Prompts
export const getPrompts = (): Promise<AIResponse<Prompt[]>> => api.get<Prompt[]>('/prompts');
export const getPromptById = (id: string): Promise<AIResponse<Prompt>> => api.get<Prompt>(`/prompts/${id}`);
export const createPrompt = (name: string, initialContent: string, category: PromptCategory, domain: string): Promise<AIResponse<Prompt>> => {
  return api.post<Prompt, { name: string; initialContent: string; category: PromptCategory; domain: string; }>('/prompts', { name, initialContent, category, domain });
};

export const addPromptVersion = (promptId: string, content: string, metadata: Omit<PromptVersion['metadata'], 'createdAt' | 'lastModified'>): Promise<AIResponse<Prompt>> => {
  return api.post<Prompt, { content: string; metadata: Omit<PromptVersion['metadata'], 'createdAt' | 'lastModified'> }>(`/prompts/${promptId}/versions`, { content, metadata });
};

export const rollbackPromptVersion = (promptId: string, version: string): Promise<AIResponse<Prompt>> => {
  return api.post<Prompt, { version: string }>(`/prompts/${promptId}/rollback`, { version });
};

export const updatePromptMetadata = (promptId: string, updates: Partial<Omit<Prompt, 'id' | 'currentVersion' | 'versions'>>): Promise<AIResponse<Prompt>> => {
  return api.put<Prompt, Partial<Omit<Prompt, 'id' | 'currentVersion' | 'versions'>>>(`/prompts/${promptId}`, updates);
};

export const deletePrompt = (promptId: string): Promise<AIResponse<void>> => api.delete<void>(`/prompts/${promptId}`);

export const optimizePrompt = (promptId: string, strategy: PromptOptimizationStrategy): Promise<AIResponse<unknown>> => {
  return api.post<unknown, { strategy: PromptOptimizationStrategy }>(`/prompts/${promptId}/optimize`, { strategy });
};

export const evaluatePrompt = (promptId: string, result: PromptEvaluationResult): Promise<AIResponse<unknown>> => {
  return api.post<unknown, PromptEvaluationResult>(`/prompts/${promptId}/evaluate`, result);
};

// Specific API functions for AI Toolkit
export const getAIModels = (): Promise<AIResponse<AIModelType[]>> => {
  // This would typically fetch from a specific backend endpoint
  return Promise.resolve({
    success: true,
    data: ['GPT-4', 'DALL-E 3', 'Whisper', 'Llama 3'] as AIModelType[],
  });
};

export const getExecutionLogs = (): Promise<AIResponse<AITaskExecutionLog[]>> => {
  // This would typically fetch from a specific backend endpoint
  return Promise.resolve({
    success: true,
    data: [
      { taskId: 'task_1', timestamp: new Date().toISOString(), modelUsed: 'GPT-4', taskType: 'text-generation', inputSummary: 'User query about climate change', outputSummary: 'Article on climate change impact', durationMs: 1200, cost: 0.05, success: true },
      { taskId: 'task_2', timestamp: new Date().toISOString(), modelUsed: 'DALL-E 3', taskType: 'image-generation', inputSummary: 'Generate a futuristic city', outputSummary: 'Image of a neon city', durationMs: 3500, cost: 0.15, success: true },
      { taskId: 'task_3', timestamp: new Date().toISOString(), modelUsed: 'Whisper', taskType: 'audio-transcription', inputSummary: 'Meeting recording', outputSummary: 'Transcript of meeting', durationMs: 800, cost: 0.01, success: true },
      { taskId: 'task_4', timestamp: new Date().toISOString(), modelUsed: 'Llama 3', taskType: 'code-generation', inputSummary: 'Python function for sorting list', outputSummary: 'Code snippet', durationMs: 900, cost: 0.03, success: true },
      { taskId: 'task_5', timestamp: new Date().toISOString(), modelUsed: 'GPT-4', taskType: 'text-generation', inputSummary: 'Analyze market trends for Q1', outputSummary: 'Failed to retrieve data', durationMs: 1500, cost: 0.02, success: false, errorMessage: 'API limit exceeded' },
    ]
  });
};

export const createWorkflow = (workflow: Partial<AIWorkflow>): Promise<AIResponse<AIWorkflow>> => {
  return api.post<AIWorkflow, Partial<AIWorkflow>>('/ai/workflows', workflow);
};

export const executeWorkflow = (workflowId: string, inputData: Record<string, any>): Promise<AIResponse<AITaskExecutionLog>> => {
  return api.post<AITaskExecutionLog, { workflowId: string; inputData: Record<string, any> }>('/ai/workflows/execute', { workflowId, inputData });
};

export const generateAIContent = (prompt: string, config: AIConfig): Promise<AIResponse<unknown>> => {
  return api.post<unknown, { prompt: string; config: AIConfig }>('/ai/generate', { prompt, config });
};
