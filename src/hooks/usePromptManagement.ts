import { useState, useCallback } from 'react';
import { api } from '../utils/api';

// Define an interface for the Prompt object for type safety
export interface Prompt {
  id: string;
  name: string;
  content: string;
  // Add other prompt properties here
}

export function usePromptManagement(initialPromptId: string | null) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [activePrompt, setActivePrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true);
    try {
      const allPrompts = await api.get('/prompts');
      setPrompts(allPrompts);
      if (initialPromptId) {
        const foundPrompt = allPrompts.find((p: Prompt) => p.id === initialPromptId);
        setActivePrompt(foundPrompt || null);
      }
    } catch (error) {
      console.error("Failed to fetch prompts:", error);
    } finally {
      setIsLoading(false);
    }
    // FIX: This is a common spot for a parsing error.
    // Ensure there are no stray commas or incorrect syntax here.
  }, [initialPromptId]);

  // Add other functions like savePrompt, deletePrompt, etc.

  return { prompts, activePrompt, isLoading, fetchPrompts };
}
