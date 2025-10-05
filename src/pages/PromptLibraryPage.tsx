import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { useToast } from '../context/toastContextHelpers';

interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  template: string;
}

const TEMPLATES: PromptTemplate[] = [
  {
    id: '1',
    title: 'Content Summarization',
    description: 'Summarize long-form content into concise bullet points',
    category: 'Content',
    template: 'Please summarize the following content into key bullet points:\n\n{content}\n\nProvide a concise summary highlighting the main points and key takeaways.'
  },
  {
    id: '2',
    title: 'Code Review',
    description: 'Comprehensive code review focusing on best practices',
    category: 'Development',
    template: 'Review the following code for:\n1. Code quality and best practices\n2. Potential bugs or security issues\n3. Performance optimizations\n4. Code readability and maintainability\n\n{code}\n\nProvide specific feedback and suggestions for improvement.'
  },
  {
    id: '3',
    title: 'Marketing Copy',
    description: 'Generate compelling marketing copy for products',
    category: 'Marketing',
    template: 'Create engaging marketing copy for the following product:\n\nProduct: {product_name}\nKey Features: {features}\nTarget Audience: {audience}\n\nGenerate:\n1. Catchy headline\n2. Product description\n3. Call-to-action'
  },
  {
    id: '4',
    title: 'Data Analysis',
    description: 'Analyze data patterns and generate insights',
    category: 'Analytics',
    template: 'Analyze the following data and provide insights:\n\n{data}\n\nProvide:\n1. Key patterns and trends\n2. Statistical summary\n3. Actionable recommendations\n4. Potential anomalies or outliers'
  },
  {
    id: '5',
    title: 'Technical Documentation',
    description: 'Create clear and comprehensive technical documentation',
    category: 'Documentation',
    template: 'Create technical documentation for:\n\nFeature/Component: {name}\nPurpose: {purpose}\nTechnical Details: {details}\n\nInclude:\n1. Overview and purpose\n2. Usage instructions\n3. API/Interface documentation\n4. Examples and best practices\n5. Troubleshooting tips'
  },
  {
    id: '6',
    title: 'Customer Support Response',
    description: 'Generate helpful and empathetic customer support responses',
    category: 'Support',
    template: 'Draft a customer support response for:\n\nCustomer Issue: {issue}\nCustomer Sentiment: {sentiment}\nContext: {context}\n\nProvide:\n1. Empathetic acknowledgment\n2. Clear explanation or solution\n3. Step-by-step instructions if applicable\n4. Follow-up action items'
  },
  {
    id: '7',
    title: 'Blog Post Outline',
    description: 'Create structured blog post outlines',
    category: 'Content',
    template: 'Create a blog post outline for:\n\nTopic: {topic}\nTarget Audience: {audience}\nKey Points: {key_points}\n\nGenerate:\n1. Attention-grabbing title\n2. Introduction hook\n3. Main sections with subheadings\n4. Conclusion with call-to-action'
  },
  {
    id: '8',
    title: 'Bug Report Analysis',
    description: 'Analyze and categorize bug reports',
    category: 'Development',
    template: 'Analyze this bug report:\n\n{bug_report}\n\nProvide:\n1. Severity classification (Critical/High/Medium/Low)\n2. Root cause analysis\n3. Affected components\n4. Recommended steps to reproduce\n5. Suggested fix or workaround'
  }
];

const CATEGORIES = ['All', 'Content', 'Development', 'Marketing', 'Analytics', 'Documentation', 'Support'];

const PromptLibraryPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { showToast } = useToast();

  const filteredTemplates = selectedCategory === 'All' 
    ? TEMPLATES 
    : TEMPLATES.filter(t => t.category === selectedCategory);

  const copyToClipboard = (template: string) => {
    navigator.clipboard.writeText(template).then(() => {
      showToast('Template copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy template', 'error');
    });
  };

  return (
    <div>
      <h2>📚 Prompt Library</h2>
      <p>Browse and use pre-built prompt templates for common tasks</p>

      {/* Category Filter */}
      <div style={{ 
        marginTop: '20px', 
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
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
              fontWeight: selectedCategory === category ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {filteredTemplates.map(template => (
          <div 
            key={template.id}
            style={{
              border: '1px solid #e9ecef',
              borderRadius: '8px',
              padding: '20px',
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              transition: 'box-shadow 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
          >
            <div style={{ marginBottom: '10px' }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                backgroundColor: '#e7f3ff',
                color: '#0066cc',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '500',
                marginBottom: '10px'
              }}>
                {template.category}
              </span>
            </div>
            <h3 style={{ marginTop: '0', marginBottom: '10px', fontSize: '18px' }}>
              {template.title}
            </h3>
            <p style={{ color: '#6c757d', fontSize: '14px', marginBottom: '15px', flexGrow: 1 }}>
              {template.description}
            </p>
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '15px',
              fontSize: '13px',
              fontFamily: 'monospace',
              maxHeight: '100px',
              overflowY: 'auto',
              color: '#495057'
            }}>
              {template.template.substring(0, 150)}...
            </div>
            <Button
              onClick={() => copyToClipboard(template.template)}
              variant="primary"
              style={{ width: '100%' }}
            >
              📋 Copy to Clipboard
            </Button>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
          <p>No templates found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default PromptLibraryPage;
