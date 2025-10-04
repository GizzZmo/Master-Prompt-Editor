import React, { useState } from 'react';
import Button from '../components/ui/Button';
import { useToast } from '../context/toastContextHelpers';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  tags: string[];
}

const PromptLibraryPage: React.FC = () => {
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock prompt templates
  const templates: PromptTemplate[] = [
    {
      id: '1',
      name: 'Content Summarization',
      description: 'Summarize long-form content into concise summaries',
      category: 'Text Processing',
      template: 'Summarize the following text in [number] sentences, focusing on the main points:\n\n[text]',
      tags: ['summarization', 'text', 'nlp']
    },
    {
      id: '2',
      name: 'Code Review Assistant',
      description: 'Review code for best practices and potential issues',
      category: 'Development',
      template: 'Review the following code and provide feedback on:\n1. Code quality\n2. Potential bugs\n3. Performance optimizations\n4. Best practices\n\n```[language]\n[code]\n```',
      tags: ['code', 'review', 'development']
    },
    {
      id: '3',
      name: 'Marketing Copy Generator',
      description: 'Generate compelling marketing copy for products',
      category: 'Marketing',
      template: 'Create engaging marketing copy for [product] that:\n- Highlights key benefits\n- Targets [audience]\n- Uses a [tone] tone\n- Includes a strong call-to-action',
      tags: ['marketing', 'copywriting', 'content']
    },
    {
      id: '4',
      name: 'Data Analysis Query',
      description: 'Analyze datasets and extract insights',
      category: 'Analytics',
      template: 'Analyze the following data and provide:\n1. Key trends and patterns\n2. Notable outliers\n3. Actionable insights\n4. Recommendations\n\nData: [data]',
      tags: ['analytics', 'data', 'insights']
    },
    {
      id: '5',
      name: 'Technical Documentation',
      description: 'Generate clear technical documentation',
      category: 'Development',
      template: 'Create technical documentation for [component/feature] including:\n- Overview and purpose\n- Setup instructions\n- API reference\n- Usage examples\n- Common issues and troubleshooting',
      tags: ['documentation', 'technical', 'development']
    },
    {
      id: '6',
      name: 'Customer Support Response',
      description: 'Draft professional customer support responses',
      category: 'Customer Service',
      template: 'Draft a professional customer support response for the following inquiry:\n\nCustomer Issue: [issue]\n\nInclude:\n- Acknowledgment of the issue\n- Clear solution or next steps\n- Professional and empathetic tone',
      tags: ['support', 'customer-service', 'communication']
    }
  ];

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (template: PromptTemplate) => {
    showToast(`Template "${template.name}" copied to clipboard!`, 'success');
    navigator.clipboard.writeText(template.template);
  };

  return (
    <div>
      <h2>Prompt Library</h2>
      <p>Browse and use pre-built prompt templates to accelerate your AI workflows.</p>

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filter by Category:</label>
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ 
            padding: '8px 12px', 
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

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredTemplates.map(template => (
          <div 
            key={template.id}
            style={{ 
              border: '1px solid #e9ecef', 
              padding: '20px', 
              borderRadius: '8px', 
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <h3 style={{ margin: 0, color: '#007bff' }}>{template.name}</h3>
            <p style={{ 
              margin: 0, 
              fontSize: '0.9em', 
              color: '#666',
              backgroundColor: '#f8f9fa',
              padding: '4px 8px',
              borderRadius: '4px',
              display: 'inline-block',
              alignSelf: 'flex-start'
            }}>
              {template.category}
            </p>
            <p style={{ margin: 0, flexGrow: 1 }}>{template.description}</p>
            
            <div style={{ 
              backgroundColor: '#f8f9fa', 
              padding: '10px', 
              borderRadius: '4px',
              fontSize: '0.85em',
              fontFamily: 'monospace',
              maxHeight: '100px',
              overflowY: 'auto'
            }}>
              {template.template}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
              {template.tags.map(tag => (
                <span 
                  key={tag}
                  style={{
                    fontSize: '0.75em',
                    padding: '2px 8px',
                    backgroundColor: '#e9ecef',
                    borderRadius: '12px',
                    color: '#495057'
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <Button onClick={() => handleUseTemplate(template)}>
              Use Template
            </Button>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>
          No templates found in this category.
        </p>
      )}
    </div>
  );
};

export default PromptLibraryPage;
