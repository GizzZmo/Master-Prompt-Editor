// server/src/services/PromptService.ts

// Define a reusable type for a Prompt
interface Prompt {
  id: string;
  name: string;
  content: string;
  version: string;
}

// Define a type for data used to create a new prompt
type NewPromptData = Omit<Prompt, 'id' | 'version'>;

// A mock database for demonstration purposes
const mockDatabase: Map<string, Prompt> = new Map();

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
  public async createPrompt(data: NewPromptData): Promise<Prompt> {
    const id = `prompt_${Date.now()}`;
    const newPrompt: Prompt = {
      id,
      ...data,
      version: '1.0.0',
    };
    mockDatabase.set(id, newPrompt);
    return newPrompt;
  }

  /**
   * Updates an existing prompt.
   */
  public async updatePrompt(id: string, updates: Partial<NewPromptData>): Promise<Prompt | null> {
    const existingPrompt = mockDatabase.get(id);
    if (!existingPrompt) {
      return null;
    }

    // FIX: Changed 'let' to 'const' as 'major' is not reassigned.
    const [major] = existingPrompt.version.split('.').map(Number);
    const newVersion = `${major + 1}.0.0`;

    const updatedPrompt: Prompt = {
      ...existingPrompt,
      ...updates,
      version: newVersion,
    };

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
    // FIX: Added a comment to explain why the block is empty, resolving the 'no-empty' error.
    // This method is a placeholder for future functionality.
  }
}
