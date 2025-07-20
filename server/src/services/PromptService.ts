// server/src/services/PromptService.ts

import { Prompt, PromptVersion, PromptCategory, LLMCallLog, PromptEvaluationResult, PromptOptimizationStrategy } from '../../../src/types/prompt'; // Corrected import path and types
import { mockPrompts } from '../data/mockPrompts';

// A mock database for demonstration purposes
const mockDatabase: Map<string, Prompt> = new Map(mockPrompts.map(p => [p.id, p]));

// Type for data used to create a new prompt
type NewPromptRequestData = Omit<Prompt, 'id' | 'currentVersion' | 'versions'> & { initialContent: string; };

export class PromptService {
  /**
   * Retrieves all prompts.
   */
  public async getAllPrompts(): Promise<Prompt[]> {
    return Array.from(mockDatabase.values());
  }

  /**
   * Retrieves a single prompt by its ID.
   */
  public async getPromptById(id: string): Promise<Prompt | undefined> {
    return mockDatabase.get(id);
  }

  /**
   * Creates a new prompt.
   */
  public async createPrompt(data: NewPromptRequestData): Promise<Prompt> {
    const id = `prompt_${Date.now()}`;
    const initialVersion: PromptVersion = {
      version: '1.0.0',
      content: data.initialContent,
      metadata: {
        expectedOutcome: 'Define expected outcome here',
        rationale: 'Initial creation',
        author: 'System',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
    };

    const newPrompt: Prompt = {
      id,
      name: data.name,
      category: data.category,
      domain: data.domain,
      currentVersion: initialVersion.version,
      versions: [initialVersion],
    };
    mockDatabase.set(id, newPrompt);
    return newPrompt;
  }

  /**
   * Adds a new version to an existing prompt.
   */
  public async addPromptVersion(promptId: string, content: string, metadata: Omit<PromptVersion['metadata'], 'createdAt' | 'lastModified'>): Promise<Prompt | null> {
    const existingPrompt = mockDatabase.get(promptId);
    if (!existingPrompt) {
      return null;
    }

    const [major, minor, patch] = existingPrompt.currentVersion.split('.').map(Number);
    // Increment minor version for new content, reset patch
    const newVersionString = `${major}.${minor + 1}.0`;

    const newVersion: PromptVersion = {
      version: newVersionString,
      content,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
    };

    const updatedPrompt: Prompt = {
      ...existingPrompt,
      currentVersion: newVersionString,
      versions: [...existingPrompt.versions, newVersion],
    };

    mockDatabase.set(promptId, updatedPrompt);
    return updatedPrompt;
  }

  /**
   * Rolls back a prompt to a specific version.
   */
  public async rollbackPromptToVersion(promptId: string, targetVersion: string): Promise<Prompt | null> {
    const existingPrompt = mockDatabase.get(promptId);
    if (!existingPrompt) {
      return null;
    }

    const targetPromptVersion = existingPrompt.versions.find(v => v.version === targetVersion);
    if (!targetPromptVersion) {
      return null; // Target version not found
    }

    const updatedPrompt: Prompt = {
      ...existingPrompt,
      currentVersion: targetVersion,
      // Conceptually, we don't remove future versions for rollback, just change 'currentVersion'
      // If strict rollback (removing future versions) is needed, modify 'versions' array here.
    };
    mockDatabase.set(promptId, updatedPrompt);
    return updatedPrompt;
  }

  /**
   * Updates an existing prompt's metadata (excluding content and versions directly).
   * This might be used for updating name, category, domain without creating a new version.
   */
  public async updatePromptMetadata(id: string, updates: Partial<Omit<Prompt, 'id' | 'currentVersion' | 'versions'>>): Promise<Prompt | null> {
    const existingPrompt = mockDatabase.get(id);
    if (!existingPrompt) {
      return null;
    }

    const updatedPrompt: Prompt = {
      ...existingPrompt,
      ...updates,
      // When updating metadata, we usually don't change the version number
      // unless the name change implies a significant shift.
      // For now, no version increment here.
    };

    // Also update the lastModified of the current version if the underlying content metadata changes
    const currentVersionIndex = updatedPrompt.versions.findIndex(v => v.version === updatedPrompt.currentVersion);
    if (currentVersionIndex !== -1) {
      updatedPrompt.versions[currentVersionIndex] = {
        ...updatedPrompt.versions[currentVersionIndex],
        metadata: {
          ...updatedPrompt.versions[currentVersionIndex].metadata,
          lastModified: new Date().toISOString(),
        },
      };
    }

    mockDatabase.set(id, updatedPrompt);
    return updatedPrompt;
  }

  /**
   * Deletes a prompt.
   */
  public async deletePrompt(id: string): Promise<boolean> {
    return mockDatabase.delete(id);
  }

  /**
   * Placeholder for a method that was possibly empty.
   */
  public async someOtherMethod() {
    // This method is a placeholder for future functionality.
  }
}
