import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: 'How do I create a new prompt?',
      answer: 'Navigate to the Master Prompt Editor page, click "Create New Prompt", enter your prompt content, add metadata like tags and description, then save. You can also use templates from the Prompt Library for faster creation.',
      category: 'Prompts'
    },
    {
      question: 'What are prompt versions and how do I use them?',
      answer: 'Prompt versions allow you to maintain a history of changes to your prompts. Each time you save changes, a new version is created. You can view version history, compare versions, and rollback to previous versions if needed.',
      category: 'Prompts'
    },
    {
      question: 'How do I compare different AI models?',
      answer: 'Visit the Model Comparison page, select the models you want to compare, optionally enter a test prompt, and click "Compare". You\'ll see side-by-side comparisons of capabilities, pricing, and performance characteristics.',
      category: 'Models'
    },
    {
      question: 'What is a workflow and how do I create one?',
      answer: 'A workflow is a sequence of AI tasks that can be automated. In the AI Toolkit, use the Workflow Builder to add steps, configure each step\'s parameters, and chain them together. Workflows can include text generation, image processing, data analysis, and more.',
      category: 'Workflows'
    },
    {
      question: 'How can I track my API usage and costs?',
      answer: 'The Analytics page provides detailed metrics on API usage, costs, response times, and success rates. You can filter by time range and see breakdowns by model and task type.',
      category: 'Analytics'
    },
    {
      question: 'What keyboard shortcuts are available?',
      answer: 'Press Ctrl+/ to view all keyboard shortcuts. Common shortcuts include: Ctrl+S (save prompt), Ctrl+N (new prompt), Ctrl+E (execute workflow), and Escape (close modals).',
      category: 'General'
    },
    {
      question: 'How do I configure API keys for different AI providers?',
      answer: 'Go to Settings page and enter your API keys for OpenAI, Anthropic, or other providers. Keys are stored securely and used to authenticate API requests.',
      category: 'Settings'
    },
    {
      question: 'What are the responsible AI features?',
      answer: 'The platform includes Explainable AI (XAI) for transparency, bias detection and mitigation tools, data privacy compliance settings (GDPR, CCPA), and clear labeling of AI-generated content.',
      category: 'Responsible AI'
    },
    {
      question: 'How do I export and import prompts?',
      answer: 'In the Prompt Editor, use the Export/Import buttons to save prompts as JSON files or import existing prompt collections. This is useful for backup, sharing, or migrating between environments.',
      category: 'Prompts'
    },
    {
      question: 'What multimodal capabilities are supported?',
      answer: 'The AI Toolkit supports text, image, audio, and video processing. You can chain different modalities together in workflows, such as generating images from text descriptions or analyzing video content.',
      category: 'AI Toolkit'
    }
  ];

  const categories = ['all', ...Array.from(new Set(faqs.map(f => f.category)))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const quickStartSteps = [
    {
      title: '1. Set Up API Keys',
      description: 'Configure your AI provider API keys in Settings',
      icon: '🔑'
    },
    {
      title: '2. Explore Templates',
      description: 'Browse the Prompt Library for ready-to-use templates',
      icon: '📚'
    },
    {
      title: '3. Create Your First Prompt',
      description: 'Use the Master Prompt Editor to create and test prompts',
      icon: '✏️'
    },
    {
      title: '4. Build a Workflow',
      description: 'Chain AI tasks together in the AI Toolkit',
      icon: '🔗'
    },
    {
      title: '5. Monitor Performance',
      description: 'Track usage and costs in the Analytics dashboard',
      icon: '📊'
    }
  ];

  const resources = [
    {
      title: 'Prompt Engineering Guide',
      description: 'Learn best practices for crafting effective prompts',
      link: '#'
    },
    {
      title: 'API Documentation',
      description: 'Technical reference for backend APIs',
      link: '#'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for common tasks',
      link: '#'
    },
    {
      title: 'Community Forum',
      description: 'Get help and share knowledge with other users',
      link: '#'
    }
  ];

  return (
    <div>
      <h2>Help & Documentation</h2>
      <p>Find answers to common questions and learn how to use the AI Orchestrator.</p>

      {/* Quick Start Guide */}
      <div style={{ 
        border: '1px solid #e9ecef', 
        padding: '20px', 
        borderRadius: '8px', 
        backgroundColor: 'white',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0 }}>Quick Start Guide</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px' 
        }}>
          {quickStartSteps.map((step, idx) => (
            <div 
              key={idx}
              style={{ 
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2em', marginBottom: '10px' }}>{step.icon}</div>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9em' }}>
                {step.title}
              </div>
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          />
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ 
              padding: '10px 15px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ 
        border: '1px solid #e9ecef', 
        padding: '20px', 
        borderRadius: '8px', 
        backgroundColor: 'white',
        marginBottom: '30px'
      }}>
        <h3 style={{ marginTop: 0 }}>Frequently Asked Questions</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredFAQs.map((faq, idx) => (
            <div 
              key={idx}
              style={{ 
                border: '1px solid #e9ecef',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <div 
                onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                style={{ 
                  padding: '15px',
                  backgroundColor: expandedFAQ === idx ? '#f8f9fa' : 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ 
                    fontSize: '0.75em', 
                    color: '#666',
                    backgroundColor: '#e9ecef',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginRight: '10px'
                  }}>
                    {faq.category}
                  </span>
                  <span style={{ fontWeight: 'bold' }}>{faq.question}</span>
                </div>
                <span style={{ fontSize: '1.5em', color: '#666' }}>
                  {expandedFAQ === idx ? '−' : '+'}
                </span>
              </div>
              {expandedFAQ === idx && (
                <div style={{ 
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderTop: '1px solid #e9ecef'
                }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        {filteredFAQs.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', margin: '20px 0' }}>
            No FAQs found matching your search.
          </p>
        )}
      </div>

      {/* Resources */}
      <div style={{ 
        border: '1px solid #e9ecef', 
        padding: '20px', 
        borderRadius: '8px', 
        backgroundColor: 'white'
      }}>
        <h3 style={{ marginTop: 0 }}>Additional Resources</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '15px' 
        }}>
          {resources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.link}
              style={{
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                textDecoration: 'none',
                color: 'inherit',
                border: '1px solid #e9ecef',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e9ecef';
                e.currentTarget.style.borderColor = '#007bff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
                e.currentTarget.style.borderColor = '#e9ecef';
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#007bff' }}>
                {resource.title}
              </div>
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                {resource.description}
              </div>
            </a>
          ))}
        </div>
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f0f8ff', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3 style={{ marginTop: 0 }}>Still Need Help?</h3>
        <p style={{ marginBottom: '15px' }}>
          Can&apos;t find what you&apos;re looking for? Our support team is here to help.
        </p>
        <button 
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default HelpPage;
