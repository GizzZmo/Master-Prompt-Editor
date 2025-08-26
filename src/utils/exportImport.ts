import { Prompt } from '../types/ai';

export interface ExportData {
  prompts: Prompt[];
  exportDate: string;
  version: string;
}

export const exportPrompts = (prompts: Prompt[]): void => {
  const exportData: ExportData = {
    prompts,
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `prompts_export_${new Date().toISOString().split('T')[0]}.json`;
  
  // Security: Use appendChild and removeChild atomically
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
};

export const importPrompts = (file: File): Promise<Prompt[]> => {
  return new Promise((resolve, reject) => {
    // Security: Validate file type and size
    if (!file.type.includes('json') && !file.name.endsWith('.json')) {
      reject(new Error('Invalid file type: Only JSON files are allowed'));
      return;
    }
    
    // Security: Limit file size to 10MB
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      reject(new Error('File too large: Maximum size is 10MB'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        // Security: Basic length check before parsing
        if (content.length > MAX_FILE_SIZE) {
          throw new Error('File content too large');
        }
        
        const data = JSON.parse(content);
        
        // Validate the structure
        if (!data.prompts || !Array.isArray(data.prompts)) {
          throw new Error('Invalid file format: missing prompts array');
        }
        
        // Security: Limit number of prompts
        if (data.prompts.length > 1000) {
          throw new Error('Too many prompts: Maximum 1000 prompts allowed');
        }
        
        // Basic validation of prompt structure
        const validatedPrompts = data.prompts.map((prompt: unknown, index: number) => {
          const p = prompt as Record<string, unknown>;
          if (!p.id || !p.name || !p.content) {
            throw new Error(`Invalid prompt at index ${index}: missing required fields (id, name, content)`);
          }
          
          // Security: Validate types and sanitize strings
          if (typeof p.id !== 'string' || typeof p.name !== 'string' || typeof p.content !== 'string') {
            throw new Error(`Invalid prompt at index ${index}: fields must be strings`);
          }
          
          // Security: Limit string lengths to prevent DoS
          if (p.name.length > 200 || p.content.length > 50000) {
            throw new Error(`Invalid prompt at index ${index}: content too long`);
          }
          
          return prompt as Prompt;
        });
        
        resolve(validatedPrompts);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Failed to parse file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

export const exportSinglePrompt = (prompt: Prompt): void => {
  const dataStr = JSON.stringify(prompt, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  // Security: Sanitize filename
  const sanitizedName = prompt.name.replace(/[^a-z0-9\-_]/gi, '_').toLowerCase();
  const fileName = sanitizedName.length > 0 ? sanitizedName : 'prompt';
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `${fileName}.json`;
  
  // Security: Use appendChild and removeChild atomically
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
};

export const exportPromptsAsMarkdown = (prompts: Prompt[]): void => {
  let markdown = '# Prompts Export\n\n';
  markdown += `Export Date: ${new Date().toLocaleDateString()}\n\n`;
  
  prompts.forEach((prompt, index) => {
    // Security: Escape markdown special characters
    const escapeName = prompt.name.replace(/[#*[\]()]/g, '\\$&');
    const escapeDescription = prompt.description.replace(/[#*[\]()]/g, '\\$&');
    
    markdown += `## ${index + 1}. ${escapeName}\n\n`;
    markdown += `**ID:** ${prompt.id}\n\n`;
    markdown += `**Version:** ${prompt.version}\n\n`;
    markdown += `**Description:** ${escapeDescription}\n\n`;
    markdown += `**Tags:** ${prompt.tags.join(', ')}\n\n`;
    markdown += `**Content:**\n\n`;
    markdown += '```\n';
    markdown += prompt.content;
    markdown += '\n```\n\n';
    markdown += '---\n\n';
  });
  
  const dataBlob = new Blob([markdown], { type: 'text/markdown' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `prompts_export_${new Date().toISOString().split('T')[0]}.md`;
  
  // Security: Use appendChild and removeChild atomically
  document.body.appendChild(link);
  try {
    link.click();
  } finally {
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
};