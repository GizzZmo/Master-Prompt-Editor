import { Prompt } from '../../src/types/ai'; // FIX: Corrected the relative path to go to the project root

export const mockPrompts: Prompt[] = [
  {
    id: '1',
    name: 'Creative Writing Assistant',
    content: 'You are a creative writing assistant. Help the user brainstorm ideas for their next story.',
    version: '1.0.0'
  },
  {
    id: '2',
    name: 'Technical Explainer',
    content: 'You are a technical expert. Explain complex topics in simple terms for a beginner.',
    version: '1.2.0'
  }
];
