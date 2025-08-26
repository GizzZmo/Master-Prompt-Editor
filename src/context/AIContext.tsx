import { useState, useEffect, ReactNode } from 'react';
import { AIModelType, AITaskExecutionLog, AIWorkflow } from '../types/ai';
import { AIContext } from '../hooks/useAI';

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
  useEffect(() => {
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
