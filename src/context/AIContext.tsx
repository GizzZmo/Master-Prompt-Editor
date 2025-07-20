import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AIModelType, AITaskExecutionLog, AIWorkflow } from '../types/ai';

interface AIContextType {
  workflows: AIWorkflow[];
  addWorkflow: (workflow: AIWorkflow) => void;
  aiModels: AIModelType[];
  executionLogs: AITaskExecutionLog[];
  addExecutionLog: (log: AITaskExecutionLog) => void;
  // TODO: Add more state management for AI specific data (e.g., real-time metrics, system health)
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [workflows, setWorkflows] = useState<AIWorkflow[]>([]);
  const [aiModels, setAiModels] = useState<AIModelType[]>([]); // This would ideally be fetched from API
  const [executionLogs, setExecutionLogs] = useState<AITaskExecutionLog[]>([]);

  const addWorkflow = (workflow: AIWorkflow) => {
    setWorkflows((prev) => [...prev, workflow]);
  };

  const addExecutionLog = (log: AITaskExecutionLog) => {
    setExecutionLogs((prev) => [...prev, log]);
  };

  // In a real application, you would fetch initial workflows, models, and logs here
  // For example, using useEffect and the API utility.
  React.useEffect(() => {
    // Mock data for initial state
    setAiModels(['GPT-4', 'DALL-E 3', 'Whisper', 'Llama 3'] as AIModelType[]);
  }, []);

  return (
    <AIContext.Provider value={{
      workflows,
      addWorkflow,
      aiModels,
      executionLogs,
      addExecutionLog,
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
