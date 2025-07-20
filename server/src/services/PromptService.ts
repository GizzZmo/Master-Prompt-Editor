import { Prompt, PromptEvaluationResult, PromptOptimizationStrategy, PromptVersion } from '../../src/types/prompt';
import { mockPrompts } from '../data/mockPrompts';

export class PromptService {
  private prompts: Prompt[] = mockPrompts;

  constructor() {
    this.prompts = mockPrompts.map(p => ({
      ...p,
      versions: p.versions.map(v => ({
        ...v,
        metadata: {
          llmCallLogs: v.metadata.llmCallLogs || [],
          ...v.metadata
        }
      }))
    }));
  }

  getAllPrompts(): Prompt[] {
    return this.prompts;
  }

  getPromptById(id: string): Prompt | undefined {
    return this.prompts.find(p => p.id === id);
  }

  createPrompt(newPromptData: Partial<Prompt>): Prompt {
    const initialVersionContent = newPromptData.versions?.[0]?.content || 'Initial prompt content.';
    const newPrompt: Prompt = {
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: newPromptData.name || `New Prompt ${this.prompts.length + 1}`,
      category: newPromptData.category || 'general',
      domain: newPromptData.domain || 'default',
      currentVersion: '1.0.0',
      versions: [
        {
          version: '1.0.0',
          content: initialVersionContent,
          metadata: {
            expectedOutcome: newPromptData.versions?.[0]?.metadata?.expectedOutcome || '',
            rationale: newPromptData.versions?.[0]?.metadata?.rationale || 'Initial creation',
            author: newPromptData.versions?.[0]?.metadata?.author || 'system',
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            llmCallLogs: []
          }
        }
      ]
    };
    this.prompts.push(newPrompt);
    return newPrompt;
  }

  updatePrompt(id: string, updatedData: Partial<Prompt>): Prompt | undefined {
    const index = this.prompts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.prompts[index] = { ...this.prompts[index], ...updatedData };
      return this.prompts[index];
    }
    return undefined;
  }

  deletePrompt(id: string): boolean {
    const initialLength = this.prompts.length;
    this.prompts = this.prompts.filter(p => p.id !== id);
    return this.prompts.length < initialLength;
  }

  addPromptVersion(promptId: string, versionData: Partial<PromptVersion>): Prompt | undefined {
    const prompt = this.getPromptById(promptId);
    if (prompt) {
      const currentContent = prompt.versions.find(v => v.version === prompt.currentVersion)?.content || '';
      const newContent = versionData.content || '';

      const newVersion: PromptVersion = {
        version: this.generateNextSemanticVersion(prompt.currentVersion, currentContent, newContent),
        content: newContent,
        metadata: {
          expectedOutcome: versionData.metadata?.expectedOutcome || prompt.versions.find(v => v.version === prompt.currentVersion)?.metadata.expectedOutcome || '',
          rationale: versionData.metadata?.rationale || 'New version added via editor',
          author: versionData.metadata?.author || 'system',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          llmCallLogs: []
        }
      };
      prompt.versions.push(newVersion);
      prompt.currentVersion = newVersion.version;
      return prompt;
    }
    return undefined;
  }

  rollbackPrompt(promptId: string, targetVersion: string): Prompt | undefined {
    const prompt = this.getPromptById(promptId);
    if (prompt) {
      const versionToRollbackTo = prompt.versions.find(v => v.version === targetVersion);
      if (versionToRollbackTo) {
        prompt.currentVersion = targetVersion;
        return prompt;
      }
    }
    return undefined;
  }

  optimizePrompt(promptId: string, strategy: PromptOptimizationStrategy): Prompt | undefined {
    const prompt = this.getPromptById(promptId);
    if (prompt) {
      console.log(`[PromptService] Optimizing prompt ${promptId} with strategy: ${strategy}`);
      const currentVersionContent = prompt.versions.find(v => v.version === prompt.currentVersion)?.content || '';
      const optimizedContent = `[Optimized by ${strategy}] ${currentVersionContent}\n\nThis optimization aims to improve [specific_metric] based on [reason].`;
      const newVersion: Partial<PromptVersion> = {
        content: optimizedContent,
        metadata: {
          expectedOutcome: 'Improved output after optimization',
          rationale: `Automated optimization via ${strategy}`,
          author: 'AI-Optimizer',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString()
        }
      };
      return this.addPromptVersion(promptId, newVersion);
    }
    return undefined;
  }

  addPromptEvaluation(promptId: string, evaluation: PromptEvaluationResult): void {
    console.log(`[PromptService] Evaluation for prompt ${promptId}:`, evaluation);
    const prompt = this.getPromptById(promptId);
    if (prompt) {
        const currentPromptVersion = prompt.versions.find(v => v.version === prompt.currentVersion);
        if (currentPromptVersion) {

        }
    }
  }

  private generateNextSemanticVersion(currentVersion: string, oldContent: string, newContent: string): string {
    const parts = currentVersion.split('.').map(Number);
    let [major, minor, patch] = parts;

    if (oldContent.trim() !== newContent.trim()) {
        if (this.calculateContentChangeMagnitude(oldContent, newContent) > 0.3) {
            minor += 1;
            patch = 0;
        } else {
            patch += 1;
        }
    }

    return `${major}.${minor}.${patch}`;
  }

  private calculateContentChangeMagnitude(oldContent: string, newContent: string): number {
    const oldWords = oldContent.split(/\s+/).filter(Boolean);
    const newWords = newContent.split(/\s+/).filter(Boolean);

    const oldSet = new Set(oldWords);
    const newSet = new Set(newWords);

    let commonWords = 0;
    oldSet.forEach(word => {
        if (newSet.has(word)) {
            commonWords++;
        }
    });

    const totalWords = oldWords.length + newWords.length - commonWords;
    if (totalWords === 0) return 0;

    return 1 - (commonWords / Math.max(oldWords.length, newWords.length));
  }
}
