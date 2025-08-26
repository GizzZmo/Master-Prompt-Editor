import { useState, useEffect, ReactNode, useCallback } from 'react';
import { AIModelType, AITaskExecutionLog, AIWorkflow } from '../types/ai';
import { AIContext } from './aiContextHelpers';

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [workflows, setWorkflows] = useState<AIWorkflow[]>([]);
  const [aiModels, setAiModels] = useState<AIModelType[]>([]); 
  const [executionLogs, setExecutionLogs] = useState<AITaskExecutionLog[]>([]);

  const addWorkflow = useCallback((workflow: AIWorkflow) => {
    setWorkflows((prev) => [...prev, workflow]);
  }, []);

  const addExecutionLog = useCallback((log: AITaskExecutionLog) => {
    setExecutionLogs((prev) => [...prev, log]);
  }, []);

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
