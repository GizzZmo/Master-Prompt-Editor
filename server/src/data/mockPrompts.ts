import { Prompt, PromptVersion } from '../../../src/types/prompt';

const mockPromptVersions: PromptVersion[] = [
  {
    id: 'v1',
    promptId: 'p1',
    version: '1.0',
    content: 'Initial version of the creative writing prompt.',
    createdAt: new Date().toISOString(),
    metadata: { author: 'Admin' }
  },
  {
    id: 'v2',
    promptId: 'p2',
    version: '1.0',
    content: 'Initial version of the technical explainer.',
    createdAt: new Date().toISOString(),
    metadata: { complexity: 'Beginner' }
  }
];

export const mockPrompts: Prompt[] = [
  {
    id: 'p1',
    name: 'Creative Writing Assistant',
    description: 'Helps users brainstorm story ideas.',
    tags: ['creative', 'writing', 'assistant'],
    content: 'Initial version of the creative writing prompt.',
    version: '1.0',
    versions: mockPromptVersions.filter(v => v.promptId === 'p1'),
    modalityType: 'text',
    isShared: false,
    votes: [],
    comments: [],
    ethicalTags: ['approved'],
  },
  {
    id: 'p2',
    name: 'Technical Explainer',
    description: 'Explains complex topics simply.',
    tags: ['technical', 'explainer', 'code'],
    content: 'Initial version of the technical explainer.',
    version: '1.0',
    versions: mockPromptVersions.filter(v => v.promptId === 'p2'),
    modalityType: 'text',
    isShared: false,
    votes: [],
    comments: [],
    ethicalTags: ['approved'],
  }
];
