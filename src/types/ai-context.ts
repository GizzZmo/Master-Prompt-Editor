import { AIModelType, AITaskExecutionLog, AIWorkflow } from '../types/ai';

export interface AIContextType {
  workflows: AIWorkflow[];
  addWorkflow: (workflow: AIWorkflow) => void;
  aiModels: AIModelType[];
  executionLogs: AITaskExecutionLog[];
  addExecutionLog: (log: AITaskExecutionLog) => void;
}