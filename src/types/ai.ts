/* src/types/ai.ts */

export type AITaskType = 'text-generation' | 'image-generation' | 'audio-generation' | 'code-generation' | 'multimodal-analysis';

export type AIModelType = 'LLM' | 'Diffusion' | 'GAN' | 'NLP' | 'TTS';

export type MultimodalInput = {
  text?: string;
  image?: string; // Base64 encoded or URL
  audio?: string; // Base64 encoded or URL
  video?: string; // Base64 encoded or URL
};

export type MultimodalOutput = {
  text?: string;
  image?: string; // Base64 encoded or URL
  audio?: string; // Base64 encoded or URL
  video?: string; // Base64 encoded or URL
  metadata?: {
    aiGenerated: boolean; // For transparency as per 4.2
    originalSource?: string; // If edited
  };
};

export type AIWorkflowStep = {
  id: string;
  name: string;
  promptId?: string; // If using a specific prompt from the editor
  taskType: AITaskType;
  inputMapping: Record<string, string>; // How inputs from previous steps map to this step
  outputMapping: Record<string, string>; // How outputs from this step map to global workflow or next step
  modelConfig?: { // Flexible LLM integration as per 3.3
    modelId: string;
    temperature?: number;
    maxTokens?: number;
    // Other model-specific parameters
  };
  // TODO: Add support for custom Python tools / functions as per 3.2
};

export type AIWorkflow = {
  id: string;
  name: string;
  description: string;
  steps: AIWorkflowStep[];
  createdBy: string;
  createdAt: string;
  lastModified: string;
  status: 'draft' | 'active' | 'archived';
};

export type AITaskExecutionLog = {
  workflowId?: string;
  taskId: string; // Or stepId if part of a workflow
  timestamp: string;
  input: MultimodalInput; // Or specific task input
  output: MultimodalOutput; // Or specific task output
  durationMs: number;
  cost: number;
  success: boolean;
  error?: string;
  // Key metrics for success & continuous improvement as per 6.2
  userFeedback?: 'positive' | 'negative' | 'neutral';
  taskCompletionRate?: number; // For specific workflows
  errorFrequency?: number;
  resourceUtilization?: {
    cpu: number;
    memory: number;
    tokenUsage?: number;
  };
};
