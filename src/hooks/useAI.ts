import { useContext } from 'react';
import { createContext } from 'react';
import { AIModelType, AITaskExecutionLog, AIWorkflow } from '../types/ai';

interface AIContextType {
  workflows: AIWorkflow[];
  addWorkflow: (workflow: AIWorkflow) => void;
  aiModels: AIModelType[];
  executionLogs: AITaskExecutionLog[];
  addExecutionLog: (log: AITaskExecutionLog) => void;
  // TODO: Add more state management for AI specific data (e.g., real-time metrics, system health)
}

export const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};