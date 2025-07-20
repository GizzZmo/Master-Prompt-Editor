import { Prompt, AIWorkflow } from '../../src/types/ai'; // Using frontend types for consistency

export const mockPrompts: Prompt[] = [
  {
    id: 'p-marketing-slogan-001',
    name: 'marketing-slogan-generator-v1.0.0',
    category: 'marketing',
    domain: 'ecommerce',
    currentVersion: '1.0.0',
    versions: [
      { version: '1.0.0', content: 'Generate a catchy marketing slogan for a new product, [PRODUCT_NAME]. Focus on its key benefit: [KEY_BENEFIT].', metadata: { expectedOutcome: 'A short, memorable slogan', rationale: 'Initial base slogan generator', author: 'MarketingTeam', createdAt: '2023-01-05T10:00:00Z', lastModified: '2023-01-05T10:00:00Z' } }
    ]
  },
  {
    id: 'p-hr-welcome-002',
    name: 'hr-employee-welcome-email-v1.1.0',
    category: 'human-resources',
    domain: 'onboarding',
    currentVersion: '1.1.0',
    versions: [
      { version: '1.0.0', content: 'Draft a welcome email for a new employee named [EMPLOYEE_NAME] starting on [START_DATE].', metadata: { expectedOutcome: 'Professional welcome email', rationale: 'Initial draft for new hires', author: 'HR-Admin', createdAt: '2023-02-15T09:30:00Z', lastModified: '2023-02-15T09:30:00Z' } },
      { version: '1.1.0', content: 'Draft a warm welcome email for [EMPLOYEE_NAME] starting on [START_DATE] in the [DEPARTMENT] department. Emphasize our collaborative culture and the support available.', metadata: { expectedOutcome: 'Warm, culturally-aligned welcome email', rationale: 'Added cultural emphasis and department info', author: 'HR-Admin', createdAt: '2023-03-01T11:00:00Z', lastModified: '2023-03-01T11:00:00Z' } }
    ]
  },
  {
    id: 'p-dev-bugfix-003',
    name: 'dev-bugfix-code-suggestor-v1.0.0',
    category: 'software-development',
    domain: 'code-review',
    currentVersion: '1.0.0',
    versions: [
      { version: '1.0.0', content: 'Analyze the following code snippet and suggest a fix for the bug described: [CODE_SNIPPET]\nBug Description: [BUG_DESCRIPTION]', metadata: { expectedOutcome: 'Corrected code or clear fix suggestion', rationale: 'Initial code debugging assistant', author: 'DevOpsTeam', createdAt: '2023-04-20T14:15:00Z', lastModified: '2023-04-20T14:15:00Z' } }
    ]
  }
];

export const mockWorkflows: AIWorkflow[] = [
  {
    id: 'wf-content-creation-001',
    name: 'Blog Post Generation Pipeline',
    description: 'Automates the generation of a full blog post from a topic.',
    steps: [
      {
        id: 'step-1',
        name: 'Brainstorm Headlines',
        taskType: 'text-generation',
        promptId: 'p-marketing-slogan-001', // Example of linking to a prompt
        inputMapping: { text: 'topic' },
        outputMapping: { text: 'headlines' },
        modelConfig: { modelId: 'GPT-4', temperature: 0.7 }
      },
      {
        id: 'step-2',
        name: 'Outline Content',
        taskType: 'text-generation',
        inputMapping: { text: 'headlines' },
        outputMapping: { text: 'outline' },
        modelConfig: { modelId: 'GPT-4', temperature: 0.5 }
      },
      {
        id: 'step-3',
        name: 'Draft Sections',
        taskType: 'text-generation',
        inputMapping: { text: 'outline' },
        outputMapping: { text: 'draft_content' },
        modelConfig: { modelId: 'GPT-4', temperature: 0.8 }
      },
      {
        id: 'step-4',
        name: 'Generate Feature Image',
        taskType: 'image-generation',
        inputMapping: { text: 'draft_content' },
        outputMapping: { image: 'feature_image' },
        modelConfig: { modelId: 'DALL-E 3' }
      }
    ],
    createdBy: 'ContentCreator',
    createdAt: '2023-05-01T10:00:00Z',
    lastModified: '2023-05-01T10:00:00Z',
    status: 'active'
  },
  {
    id: 'wf-customer-support-002',
    name: 'Customer Support Escalation Workflow',
    description: 'Automatically analyzes customer inquiries and suggests responses or escalates.',
    steps: [
      {
        id: 'step-1',
        name: 'Analyze Sentiment',
        taskType: 'text-generation',
        inputMapping: { text: 'customer_inquiry' },
        outputMapping: { text: 'sentiment_analysis' },
        modelConfig: { modelId: 'NLP-Sentiment' }
      },
      {
        id: 'step-2',
        name: 'Suggest Response/Escalate',
        taskType: 'text-generation',
        inputMapping: { text: 'sentiment_analysis' },
        outputMapping: { text: 'suggested_action' },
        modelConfig: { modelId: 'GPT-3.5-Turbo' }
      }
    ],
    createdBy: 'SupportManager',
    createdAt: '2023-06-10T14:30:00Z',
    lastModified: '2023-06-10T14:30:00Z',
    status: 'active'
  }
];
