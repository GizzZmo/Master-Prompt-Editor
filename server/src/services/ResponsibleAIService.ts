// Responsible AI service for bias detection and ethical prompt management
import { v4 as uuidv4 } from 'uuid';
import { BiasDetectionResult, BiasCategory, EthicalPromptTemplate } from '../../../src/types/prompt';

export class ResponsibleAIService {
  private ethicalTemplates: Map<string, EthicalPromptTemplate> = new Map();
  private biasDetectionResults: Map<string, BiasDetectionResult> = new Map();

  constructor() {
    this.initializeEthicalTemplates();
  }

  /**
   * Detect potential bias in prompt content
   */
  public async detectBias(promptContent: string): Promise<BiasDetectionResult> {
    const categories: BiasCategory[] = [];
    
    // Mock bias detection logic - in real implementation, this would use ML models
    const biasKeywords = {
      gender: ['he/she', 'man/woman', 'masculine', 'feminine', 'male', 'female'],
      race: ['race', 'ethnicity', 'color', 'minority', 'majority'],
      age: ['young', 'old', 'elderly', 'senior', 'youth', 'aged'],
      religion: ['christian', 'muslim', 'jewish', 'hindu', 'buddhist', 'religious'],
      socioeconomic: ['poor', 'rich', 'wealthy', 'poverty', 'privileged', 'class']
    };

    let overallScore = 0;
    const suggestions: string[] = [];

    for (const [biasType, keywords] of Object.entries(biasKeywords)) {
      const foundKeywords = keywords.filter(keyword => 
        promptContent.toLowerCase().includes(keyword.toLowerCase())
      );

      if (foundKeywords.length > 0) {
        const score = Math.min(foundKeywords.length * 0.2, 1.0); // Max score of 1.0
        categories.push({
          type: biasType as any,
          score,
          evidence: foundKeywords.map(kw => `Found potentially biased term: "${kw}"`),
        });
        overallScore += score;

        if (score > 0.3) {
          suggestions.push(`Consider using more inclusive language instead of terms related to ${biasType}`);
        }
      }
    }

    overallScore = Math.min(overallScore / Object.keys(biasKeywords).length, 1.0);

    // Add general suggestions based on overall score
    if (overallScore > 0.5) {
      suggestions.push('Consider reviewing prompt for potential bias and using neutral language');
      suggestions.push('Test prompt with diverse scenarios to ensure fair outputs');
    }

    const result: BiasDetectionResult = {
      overallScore,
      categories,
      suggestions,
      detectedAt: new Date().toISOString(),
    };

    return result;
  }

  /**
   * Get ethical prompt templates
   */
  public async getEthicalTemplates(): Promise<EthicalPromptTemplate[]> {
    return Array.from(this.ethicalTemplates.values());
  }

  /**
   * Get ethical template by ID
   */
  public async getEthicalTemplate(templateId: string): Promise<EthicalPromptTemplate | null> {
    return this.ethicalTemplates.get(templateId) || null;
  }

  /**
   * Create new ethical template
   */
  public async createEthicalTemplate(
    name: string,
    description: string,
    template: string,
    ethicalGuidelines: string[],
    tags: string[]
  ): Promise<EthicalPromptTemplate> {
    const ethicalTemplate: EthicalPromptTemplate = {
      id: uuidv4(),
      name,
      description,
      template,
      ethicalGuidelines,
      tags,
    };

    this.ethicalTemplates.set(ethicalTemplate.id, ethicalTemplate);
    return ethicalTemplate;
  }

  /**
   * Validate prompt against ethical guidelines
   */
  public async validatePromptEthics(
    promptContent: string,
    templateId?: string
  ): Promise<{
    isEthical: boolean;
    score: number;
    violations: string[];
    recommendations: string[];
  }> {
    const biasResult = await this.detectBias(promptContent);
    const violations: string[] = [];
    const recommendations: string[] = [];

    // Check for explicit harmful content
    const harmfulPatterns = [
      'generate fake news',
      'create misinformation',
      'write harassment',
      'create discriminatory',
      'generate illegal',
    ];

    harmfulPatterns.forEach(pattern => {
      if (promptContent.toLowerCase().includes(pattern.toLowerCase())) {
        violations.push(`Potentially harmful request detected: ${pattern}`);
      }
    });

    // If template provided, check against its guidelines
    if (templateId) {
      const template = this.ethicalTemplates.get(templateId);
      if (template) {
        template.ethicalGuidelines.forEach(guideline => {
          // Mock validation logic
          if (Math.random() > 0.8) { // 20% chance of guideline violation
            violations.push(`Potential violation of guideline: ${guideline}`);
          }
        });
      }
    }

    // Calculate ethical score (inverse of bias score + violation penalty)
    let ethicalScore = 1 - biasResult.overallScore;
    ethicalScore -= violations.length * 0.2;
    ethicalScore = Math.max(0, Math.min(1, ethicalScore));

    const isEthical = ethicalScore > 0.7 && violations.length === 0;

    if (!isEthical) {
      recommendations.push('Consider revising prompt to be more inclusive and ethical');
      recommendations.push('Review ethical guidelines for prompt creation');
      recommendations.push(...biasResult.suggestions);
    }

    return {
      isEthical,
      score: ethicalScore,
      violations,
      recommendations,
    };
  }

  /**
   * Apply ethical template to create responsible prompt
   */
  public async applyEthicalTemplate(
    templateId: string,
    variables: Record<string, string>
  ): Promise<string> {
    const template = this.ethicalTemplates.get(templateId);
    if (!template) {
      throw new Error(`Ethical template not found: ${templateId}`);
    }

    let appliedTemplate = template.template;
    
    // Replace variables in template
    for (const [key, value] of Object.entries(variables)) {
      appliedTemplate = appliedTemplate.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return appliedTemplate;
  }

  /**
   * Get bias detection history for a prompt
   */
  public async getBiasDetectionHistory(promptId: string): Promise<BiasDetectionResult[]> {
    return Array.from(this.biasDetectionResults.values()).filter(
      result => (result as any).promptId === promptId
    );
  }

  private initializeEthicalTemplates(): void {
    // Initialize with some default ethical templates
    const templates: Omit<EthicalPromptTemplate, 'id'>[] = [
      {
        name: 'Inclusive Assistant',
        description: 'Template for creating inclusive AI assistant prompts',
        template: 'You are a helpful and inclusive AI assistant. When responding to questions about {{topic}}, ensure your responses are respectful to all individuals regardless of their background, identity, or beliefs. Provide balanced and factual information without bias.',
        ethicalGuidelines: [
          'Use inclusive language',
          'Avoid stereotypes and generalizations',
          'Respect diversity of perspectives',
          'Provide balanced information',
        ],
        tags: ['inclusive', 'general', 'assistant'],
      },
      {
        name: 'Educational Content Creator',
        description: 'Template for educational content that promotes learning without bias',
        template: 'Create educational content about {{subject}} that is accessible to learners from diverse backgrounds. Ensure the content is factually accurate, culturally sensitive, and promotes critical thinking.',
        ethicalGuidelines: [
          'Ensure factual accuracy',
          'Use culturally sensitive examples',
          'Promote critical thinking',
          'Be accessible to diverse learners',
        ],
        tags: ['education', 'inclusive', 'learning'],
      },
      {
        name: 'Fair Analysis Framework',
        description: 'Template for conducting fair and unbiased analysis',
        template: 'Analyze {{data_or_topic}} in a fair and objective manner. Consider multiple perspectives, acknowledge limitations in the data, and avoid drawing conclusions that could perpetuate bias or discrimination.',
        ethicalGuidelines: [
          'Consider multiple perspectives',
          'Acknowledge data limitations',
          'Avoid discriminatory conclusions',
          'Maintain objectivity',
        ],
        tags: ['analysis', 'fairness', 'objective'],
      },
    ];

    templates.forEach(template => {
      const ethicalTemplate: EthicalPromptTemplate = {
        ...template,
        id: uuidv4(),
      };
      this.ethicalTemplates.set(ethicalTemplate.id, ethicalTemplate);
    });
  }
}