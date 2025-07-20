      setSelectedPrompt(null); // Clear selected prompt if ID is empty
      setIsLoading(false);
      return;
    }
    try {
      const response = await getPromptById(promptId);
      if (response.success && response.data) {
        setSelectedPrompt(response.data);
      } else {
        setSelectedPrompt(null);
        setError(response.error || `Prompt with ID ${promptId} not found.`);
      }
    } catch (err) {
      setError((err as Error).message);
      setSelectedPrompt(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPrompt = useCallback(async (name: string, initialContent: string, category: PromptCategory, domain: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCreatePrompt(name, initialContent, category, domain);
      if (response.success && response.data) {
        setPrompts(prev => [...prev, response.data]);
        setSelectedPrompt(response.data);
        alert('Prompt created successfully!');
      } else {
        setError(response.error || 'Failed to create prompt.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addVersion = useCallback(async (promptId: string, content: string, metadata: Omit<PromptVersion['metadata'], 'createdAt' | 'lastModified'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await addPromptVersion(promptId, content, metadata);
      if (response.success && response.data) {
        setSelectedPrompt(response.data);
        // Optionally, re-fetch all prompts to ensure the list is updated
        await fetchAllPrompts();
        alert('New version added successfully!');
      } else {
        setError(response.error || 'Failed to add new version.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAllPrompts]);

  const rollbackToVersion = useCallback(async (promptId: string, version: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await rollbackPromptVersion(promptId, version);
      if (response.success && response.data) {
        setSelectedPrompt(response.data);
        alert(`Rolled back to version ${version} successfully!`);
      } else {
        setError(response.error || `Failed to rollback to version ${version}.`);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optional: Add deletePrompt and updatePromptMetadata if needed in the UI
  const deletePrompt = useCallback(async (promptId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiDeletePrompt(promptId);
      if (response.success) {
        setPrompts(prev => prev.filter(p => p.id !== promptId));
        if (selectedPrompt?.id === promptId) {
          setSelectedPrompt(null);
        }
        alert('Prompt deleted successfully!');
      } else {
        setError(response.error || 'Failed to delete prompt.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedPrompt]);

  const updatePromptMeta = useCallback(async (promptId: string, updates: Partial<Omit<Prompt, 'id' | 'currentVersion' | 'versions'>>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiUpdatePromptMetadata(promptId, updates);
      if (response.success && response.data) {
        setSelectedPrompt(response.data);
        // Optionally, re-fetch all prompts to ensure the list is updated
        await fetchAllPrompts();
        alert('Prompt metadata updated successfully!');
      } else {
        setError(response.error || 'Failed to update prompt metadata.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAllPrompts]);

  return {
    prompts,
    selectedPrompt,
    isLoading,
    error,
    fetchAllPrompts,
    fetchPrompt,
    createPrompt,
    addVersion,
    rollbackToVersion,
    deletePrompt,
    updatePromptMeta,
  };
}
