// Local type definitions
interface Prompt {
  id: string;
  name: string;
  description: string;
  tags: string[];
  content: string;
  version: string;
  versions: PromptVersion[];
}

interface PromptVersion {
  id: string;
  promptId: string;
  version: string;
  content: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

// A mock database for demonstration purposes
const mockPrompts: Prompt[] = [];
const mockVersions: PromptVersion[] = [];

export class PromptService {
  public async getAllPrompts(): Promise<Prompt[]> {
    return mockPrompts;
  }

  public async getPromptById(id: string): Promise<Prompt | undefined> {
    return mockPrompts.find(p => p.id === id);
  }

  // FIX: Added missing 'createPrompt' method
  public async createPrompt(data: Omit<Prompt, 'id' | 'version'>): Promise<Prompt> {
    const newPrompt: Prompt = {
      id: `prompt_${Date.now()}`,
      version: '1.0',
      ...data,
    };
    mockPrompts.push(newPrompt);
    return newPrompt;
  }

  // FIX: Added missing 'addPromptVersion' method
  public async addPromptVersion(promptId: string, content: string): Promise<PromptVersion> {
    const newVersion: PromptVersion = {
      id: `v_${Date.now()}`,
      promptId,
      version: (Math.random() + 1).toString().substring(2, 5), // Mock version
      content,
      createdAt: new Date().toISOString(),
    };
    mockVersions.push(newVersion);
    return newVersion;
  }

  // FIX: Added missing 'rollbackPromptToVersion' method
  public async rollbackPromptToVersion(promptId: string, versionId: string): Promise<Prompt | null> {
    const targetVersion = mockVersions.find(v => v.id === versionId && v.promptId === promptId);
    const prompt = mockPrompts.find(p => p.id === promptId);

    if (targetVersion && prompt) {
      prompt.content = targetVersion.content;
      prompt.version = targetVersion.version;
      return prompt;
    }
    return null;
  }

  // FIX: Added missing 'updatePromptMetadata' method
  public async updatePromptMetadata(promptId: string, metadata: Partial<Prompt>): Promise<Prompt | null> {
      const prompt = mockPrompts.find(p => p.id === promptId);
      if (prompt) {
          Object.assign(prompt, metadata);
          return prompt;
      }
      return null;
  }

  // FIX: Added missing 'deletePrompt' method
  public async deletePrompt(promptId: string): Promise<{ success: boolean }> {
    const index = mockPrompts.findIndex(p => p.id === promptId);
    if (index > -1) {
      mockPrompts.splice(index, 1);
      return { success: true };
    }
    return { success: false };
  }
}
