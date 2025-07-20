import {
  Prompt,
  PromptVersion,
} from '../../src/types/prompt';

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

  public async getPromptVersions(promptId: string): Promise<PromptVersion[]> {
    return mockVersions.filter((v: PromptVersion) => v.promptId === promptId);
  }

  public async getPromptVersion(promptId: string, versionId: string): Promise<PromptVersion | undefined> {
    // FIX: Added 'PromptVersion' type to the parameter 'v'
    return mockVersions.find((v: PromptVersion) => v.promptId === promptId && v.id === versionId);
  }

  public async createPromptVersion(promptId: string, content: string): Promise<PromptVersion> {
    const latestVersion = mockVersions
      .filter((v: PromptVersion) => v.promptId === promptId) // FIX: Added 'PromptVersion' type
      .sort((a, b) => (b.version > a.version ? 1 : -1))[0];

    const newVersionNumber = latestVersion ? parseFloat(latestVersion.version) + 0.1 : 1.0;

    const newVersion: PromptVersion = {
      id: `v${Date.now()}`,
      promptId,
      version: newVersionNumber.toFixed(1),
      content,
      createdAt: new Date().toISOString(),
    };
    mockVersions.push(newVersion);
    return newVersion;
  }
}
