import { useState, useCallback } from 'react';
import { Prompt, PromptVersion } from '../types/prompt';
import { getPromptById, createPrompt, updatePrompt, addPromptVersion, rollbackPromptVersion } from '../utils/api';

interface UsePromptManagementResult {
  prompt: Prompt | null;
  loading: boolean;
  error: string | null;
  fetchPrompt: (id: string) => Promise<void>;
  createPrompt: (name: string, content: string, category: Prompt['category'], domain: string) => Promise<void>;
  addVersion: (promptId: string, content: string, metadata: Omit<PromptVersion['metadata'], 'createdAt' | 'lastModified' | 'llmCallLogs'>) => Promise<void>;
  rollbackToVersion: (promptId: string, version: string) => Promise<void>;
  updatePromptMetadata: (promptId: string, metadata: Partial<Prompt>) => Promise<void>;
}

export const usePromptManagement = (): UsePromptManagementResult => {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrompt = useCallback(async (id: string) => {
    if (!id) {
      setPrompt(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    const response = await getPromptById(id);
    if (response.success && response.data) {
      setPrompt(response.data);
    } else {
      setError(response.error || 'Failed to fetch prompt.');
      setPrompt(null);
    }
    setLoading(false);
  }, []);

  const createPrompt = useCallback(async (name: string, content: string, category: Prompt['category'], domain: string) => {
    setLoading(true);
    setError(null);
    const newVersion: PromptVersion = {
      version: '1.0.0',
      content: content,
      metadata: {
        expectedOutcome: '',
        rationale: 'Initial creation',
        author: 'current_user',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        llmCallLogs: []
      }
    };
    const newPromptData: Partial<Prompt> = {
      name, category, domain,
      currentVersion: newVersion.version,
      versions: [newVersion]
    };

    const response = await createPrompt(newPromptData);
    if (response.success && response.data) {
      setPrompt(response.data);
      alert('Prompt created successfully!');
    } else {
      setError(response.error || 'Failed to create prompt.');
    }
    setLoading(false);
  }, []);

  const addVersion = useCallback(async (promptId: string, content: string, userMetadata: Omit<PromptVersion['metadata'], 'createdAt' | 'lastModified' | 'llmCallLogs'>) => {
    setLoading(true);
    setError(null);

    const versionDataToSend: Partial<PromptVersion> = {
      content,
      metadata: {
        ...userMetadata,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      }
    };

    const response = await addPromptVersion(promptId, versionDataToSend);
    if (response.success && response.data) {
      setPrompt(response.data);
      alert('New prompt version added!');
    |
      setError(response.error || 'Failed to add prompt version.');
    }
    setLoading(false);
  }, []);

  const updatePromptMetadata = useCallback(async (promptId: string, metadata: Partial<Prompt>) => {
    setLoading(true);
    setError(null);
    const response = await updatePrompt(promptId, metadata);
    if (response.success && response.data) {
      setPrompt(response.data);
      alert('Prompt metadata updated!');
    } else {
      setError(response.error || 'Failed to update prompt metadata.');
    }
    setLoading(false);
  }, []);

  const rollbackToVersion = useCallback(async (promptId: string, version: string) => {
    setLoading(true);
    setError(null);
    const response = await rollbackPromptVersion(promptId, version);
    if (response.success && response.data) {
      setPrompt(response.data);
      alert(`Prompt rolled back to version ${version}.`);
    } else {
      setError(response.error || 'Failed to rollback prompt.');
    }
    setLoading(false);
  }, []);

  return {
    prompt,
    loading,
    error,
    fetchPrompt,
    createPrompt,
    addVersion,
    rollbackToVersion,
    updatePromptMetadata
  };
};
