import { useState, useCallback, useEffect } from 'react';
import { api } from '../utils/api';
import { Prompt } from '../types/prompt';

export function usePromptManagement(initialPromptId: string | null) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch prompts on mount and whenever initialPromptId changes
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    api.getPrompts()
      .then(allPrompts => {
        if (cancelled) return;
        setPrompts(allPrompts);
        if (initialPromptId) {
          const found = allPrompts.find((p: Prompt) => p.id === initialPromptId);
          setActivePrompt(found || null);
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch prompts');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [initialPromptId]);

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allPrompts = await api.getPrompts();
      setPrompts(allPrompts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prompts');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
