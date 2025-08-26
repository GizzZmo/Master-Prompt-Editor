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
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(link.href);
};

export const importPrompts = (file: File): Promise<Prompt[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate the structure
        if (!data.prompts || !Array.isArray(data.prompts)) {
          throw new Error('Invalid file format: missing prompts array');
        }
        
        // Basic validation of prompt structure
        const validatedPrompts = data.prompts.map((prompt: unknown, index: number) => {
          const p = prompt as Record<string, unknown>;
          if (!p.id || !p.name || !p.content) {
            throw new Error(`Invalid prompt at index ${index}: missing required fields (id, name, content)`);
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
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `${prompt.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(link.href);
};

export const exportPromptsAsMarkdown = (prompts: Prompt[]): void => {
  let markdown = '# Prompts Export\n\n';
  markdown += `Export Date: ${new Date().toLocaleDateString()}\n\n`;
  
  prompts.forEach((prompt, index) => {
    markdown += `## ${index + 1}. ${prompt.name}\n\n`;
    markdown += `**ID:** ${prompt.id}\n\n`;
    markdown += `**Version:** ${prompt.version}\n\n`;
    markdown += `**Description:** ${prompt.description}\n\n`;
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
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(link.href);
};