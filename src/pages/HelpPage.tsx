import React, { useState } from 'react';

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQ[] = [
  {
    id: '1',
    category: 'Getting Started',
    question: 'How do I create my first prompt?',
    answer: 'Navigate to the Master Prompt Editor, click "New Prompt", enter your prompt text, and save it. You can then test it in the integrated playground on the right side of the editor.'
  },
  {
    id: '2',
    category: 'Getting Started',
    question: 'What is prompt versioning?',
    answer: 'Prompt versioning allows you to track changes to your prompts over time. Each time you save a modified prompt, a new version is created. You can view, compare, and restore previous versions at any time.'
  },
  {
    id: '3',
    category: 'Features',
    question: 'How do I use the AI Toolkit?',
    answer: 'The Advanced AI Toolkit provides workflow automation, multimodal capabilities, and AI agent management. Navigate to the AI Toolkit page and select the tool you want to use. Each tool has built-in documentation and examples.'
  },
  {
    id: '4',
    category: 'Features',
    question: 'Can I compare different AI models?',
    answer: 'Yes! Go to the Model Comparison page, select up to 4 models you want to compare, and view their specifications side-by-side. You can also test them with a custom prompt to see how each model responds.'
  },
  {
    id: '5',
    category: 'Optimization',
    question: 'What optimization strategies are available?',
    answer: 'We support multiple optimization strategies including meta-prompting, gradient-based optimization, DSPy integration, chain-of-thought, few-shot, and zero-shot learning. Each strategy is designed for different use cases.'
  },
  {
    id: '6',
    category: 'Optimization',
    question: 'How does prompt benchmarking work?',
    answer: 'Benchmarking runs your prompt multiple times to measure performance metrics like response time, consistency, and quality. You can configure the number of iterations and analyze the results to identify optimization opportunities.'
  },
  {
    id: '7',
    category: 'Analytics',
    question: 'What metrics are tracked?',
    answer: 'We track comprehensive metrics including total prompts executed, average response time, success rate, API costs, model usage, and system performance. You can view these metrics on the Analytics page with customizable time ranges.'
  },
  {
    id: '8',
    category: 'Analytics',
    question: 'How can I monitor my API costs?',
    answer: 'The Analytics page provides detailed cost tracking across different time periods. You can see total costs, cost per model, and trends over time. Set up alerts for budget thresholds in the Settings page.'
  },
  {
    id: '9',
    category: 'Troubleshooting',
    question: 'Why is my prompt taking too long to respond?',
    answer: 'Long response times can be caused by several factors: large context windows, complex prompts, or API rate limiting. Try simplifying your prompt, reducing the context size, or switching to a faster model. Check the Analytics page for performance insights.'
  },
  {
    id: '10',
    category: 'Troubleshooting',
    question: 'What should I do if I get an error?',
    answer: 'First, check the error message for details. Common issues include API key problems, rate limits, or network connectivity. Verify your API keys in Settings, check your usage limits, and ensure you have a stable internet connection. Contact support if the issue persists.'
  },
  {
    id: '11',
    category: 'Best Practices',
    question: 'How do I write effective prompts?',
    answer: 'Effective prompts are clear, specific, and well-structured. Use the Prompt Library for templates, provide context and examples, specify the desired format, and iterate based on results. The optimization tools can help refine your prompts automatically.'
  },
  {
    id: '12',
    category: 'Best Practices',
    question: 'When should I use which AI model?',
    answer: 'Choose models based on your needs: GPT-4 for complex reasoning, Claude for long documents, GPT-3.5 Turbo for speed and cost efficiency, and Gemini for multilingual tasks. Use the Model Comparison page to evaluate options for your specific use case.'
  }
];

const CATEGORIES = ['All', 'Getting Started', 'Features', 'Optimization', 'Analytics', 'Troubleshooting', 'Best Practices'];

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const filteredFAQs = FAQS.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div>
      <h2>❓ Help & Documentation</h2>
      <p>Find answers to common questions and learn how to use the AI Orchestrator</p>

      {/* Quick Start Guide */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginTop: '20px',
        marginBottom: '30px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#007bff' }}>🚀 Quick Start Guide</h3>
        <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
          <li>
            <strong>Set up your API keys:</strong> Navigate to Settings and configure your API keys for OpenAI, Anthropic, or other providers.
          </li>
          <li>
            <strong>Create your first prompt:</strong> Go to the Master Prompt Editor and create a new prompt. Use the Prompt Library for templates.
          </li>
          <li>
            <strong>Test your prompt:</strong> Use the built-in playground to test your prompt with different models and parameters.
          </li>
          <li>
            <strong>Optimize and iterate:</strong> Use the optimization tools to improve your prompt&apos;s performance and effectiveness.
          </li>
          <li>
            <strong>Monitor performance:</strong> Check the Analytics page to track usage, costs, and performance metrics.
          </li>
        </ol>
      </div>

      {/* Search and Filter */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '14px',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            marginBottom: '15px'
          }}
        />

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 16px',
                backgroundColor: selectedCategory === category ? '#007bff' : '#f8f9fa',
                color: selectedCategory === category ? 'white' : '#212529',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: selectedCategory === category ? '600' : '400'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => (
            <div
              key={faq.id}
              style={{
                borderBottom: index < filteredFAQs.length - 1 ? '1px solid #e9ecef' : 'none'
              }}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  backgroundColor: expandedFAQ === faq.id ? '#f8f9fa' : 'white',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s'
                }}
              >
                <div>
                  <div style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    backgroundColor: '#e7f3ff',
                    color: '#0066cc',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '500',
                    marginBottom: '8px'
                  }}>
                    {faq.category}
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: '#212529' }}>
                    {faq.question}
                  </div>
                </div>
                <span style={{ 
                  fontSize: '20px', 
                  color: '#6c757d',
                  transition: 'transform 0.2s',
                  transform: expandedFAQ === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  display: 'inline-block'
                }}>
                  ▼
                </span>
              </button>
              {expandedFAQ === faq.id && (
                <div style={{
                  padding: '16px 20px',
                  backgroundColor: '#f8f9fa',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#495057'
                }}>
                  {faq.answer}
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
            <p>No FAQs found matching your search.</p>
          </div>
        )}
      </div>

      {/* Additional Resources */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginTop: '30px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0 }}>📚 Additional Resources</h3>
        <ul style={{ lineHeight: '2', paddingLeft: '20px' }}>
          <li><a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>📖 Complete Documentation</a></li>
          <li><a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>🎥 Video Tutorials</a></li>
          <li><a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>💡 Best Practices Guide</a></li>
          <li><a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>🔧 API Reference</a></li>
          <li><a href="#" style={{ color: '#007bff', textDecoration: 'none' }}>👥 Community Forum</a></li>
        </ul>
      </div>

      {/* Contact Support */}
      <div style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '30px',
        borderRadius: '8px',
        marginTop: '30px',
        textAlign: 'center'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Need More Help?</h3>
        <p style={{ marginBottom: '20px' }}>Our support team is here to help you succeed</p>
        <button style={{
          padding: '12px 24px',
          backgroundColor: 'white',
          color: '#007bff',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          📧 Contact Support
        </button>
      </div>
    </div>
  );
};

export default HelpPage;
