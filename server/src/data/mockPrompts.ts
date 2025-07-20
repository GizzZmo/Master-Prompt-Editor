import { Prompt, PromptVersion } from '../../../src/types/prompt';

export const mockPrompts: Prompt[] = [
  {
    id: 'prompt_1',
    name: 'Creative Writing Assistant',
    category: 'general',
    domain: 'creative-writing',
    currentVersion: '1.0.0',
    versions: [
      {
        version: '1.0.0',
        content: 'You are a creative writing assistant. Help the user brainstorm ideas for their next story.',
        metadata: {
          expectedOutcome: 'Brainstorm creative story ideas.',
          rationale: 'Initial version for general brainstorming.',
          author: 'System',
          createdAt: new Date('2023-01-15T10:00:00Z').toISOString(),
          lastModified: new Date('2023-01-15T10:00:00Z').toISOString(),
        },
      },
    ],
  },
  {
    id: 'prompt_2',
    name: 'Technical Explainer',
    category: 'software-development',
    domain: 'technical-documentation',
    currentVersion: '1.2.0',
    versions: [
      {
        version: '1.0.0',
        content: 'You are a technical expert. Explain complex topics in simple terms for a beginner.',
        metadata: {
          expectedOutcome: 'Simplify complex technical concepts.',
          rationale: 'Initial version for technical simplification.',
          author: 'System',
          createdAt: new Date('2023-02-01T11:00:00Z').toISOString(),
          lastModified: new Date('2023-02-01T11:00:00Z').toISOString(),
        },
      },
      {
        version: '1.1.0',
        content: 'You are a technical expert. Explain complex topics in simple terms for a beginner, focusing on practical examples.',
        metadata: {
          expectedOutcome: 'Simplify complex technical concepts with practical examples.',
          rationale: 'Added emphasis on practical examples.',
          author: 'Alice',
          createdAt: new Date('2023-02-10T14:30:00Z').toISOString(),
          lastModified: new Date('2023-02-10T14:30:00Z').toISOString(),
        },
      },
      {
        version: '1.2.0',
        content: 'You are a technical expert. Explain complex software engineering topics in simple terms for a beginner, providing clear analogies and code snippets.',
        metadata: {
          expectedOutcome: 'Simplify complex software engineering concepts with analogies and code.',
          rationale: 'Refined for software engineering, added code snippets.',
          author: 'Bob',
          createdAt: new Date('2023-03-05T09:15:00Z').toISOString(),
          lastModified: new Date('2023-03-05T09:15:00Z').toISOString(),
        },
      },
    ],
  },
  {
    id: 'prompt_3',
    name: 'Marketing Email Draft',
    category: 'marketing',
    domain: 'email-campaigns',
    currentVersion: '1.0.0',
    versions: [
      {
        version: '1.0.0',
        content: 'Draft a concise and engaging marketing email for a new product launch. Focus on benefits and a clear call to action.',
        metadata: {
          expectedOutcome: 'Generate a marketing email draft for a product launch.',
          rationale: 'Initial draft for marketing team.',
          author: 'System',
          createdAt: new Date('2023-04-20T16:00:00Z').toISOString(),
          lastModified: new Date('2023-04-20T16:00:00Z').toISOString(),
        },
      },
    ],
  },
];
