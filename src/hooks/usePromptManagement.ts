import { useState, useCallback, useEffect } from 'react';
import { api } from '../utils/api';
import { Prompt } from '../types/prompt';

export function usePromptManagement(initialPromptId: string | null) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allPrompts = await api.getPrompts();
      setPrompts(allPrompts);
      if (initialPromptId) {
        const foundPrompt = allPrompts.find((p: Prompt) => p.id === initialPromptId);
        setActivePrompt(foundPrompt || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prompts');
    } finally {
      setIsLoading(false);
    }
  }, [initialPromptId]);

  // Fetch prompts on mount
  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const selectPrompt = useCallback((prompt: Prompt | null) => {
    setActivePrompt(prompt);
  }, []);

  const createPrompt = useCallback(async (data: Omit<Prompt, 'id' | 'version' | 'versions'>) => {
    const newPrompt = await api.createPrompt({ ...data, versions: [] });
    setPrompts(prev => [...prev, newPrompt]);
    setActivePrompt(newPrompt);
    return newPrompt;
  }, []);

  return { prompts, activePrompt, isLoading, error, fetchPrompts, selectPrompt, createPrompt };
}
