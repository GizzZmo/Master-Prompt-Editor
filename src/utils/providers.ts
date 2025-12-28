import { AIModelPricing, AIProvider, AIConfig } from '../types/ai';

/**
 * Lightweight provider registry to support a plugin-style architecture.
 * Providers can be injected at runtime for new model backends (e.g., Ollama, Azure OpenAI).
 */
const registry = new Map<string, AIProvider>();

const defaultProviders: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    supportsParallel: true,
    capabilities: ['chat', 'vision'],
    models: [
      { model: 'gpt-4', provider: 'OpenAI', inputCostPer1k: 0.03, outputCostPer1k: 0.06 },
      { model: 'gpt-4o', provider: 'OpenAI', inputCostPer1k: 0.005, outputCostPer1k: 0.015 },
      { model: 'gpt-3.5-turbo', provider: 'OpenAI', inputCostPer1k: 0.0005, outputCostPer1k: 0.0015 },
    ],
    generate: async (prompt: string, options: Partial<AIConfig>) => ({
      text: `[Mocked ${options.model ?? 'gpt-4'}] ${prompt}`,
      tokenUsage: { input: prompt.length / 4, output: 128 },
    }),
    estimateCost: (model: string, tokenUsage: { input: number; output: number }) => {
      const pricing = findPricing(model);
      if (!pricing) return 0;
      const inputCost = (tokenUsage.input / 1000) * pricing.inputCostPer1k;
      const outputCost = (tokenUsage.output / 1000) * pricing.outputCostPer1k;
      return Number((inputCost + outputCost).toFixed(4));
    },
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    supportsParallel: true,
    capabilities: ['chat'],
    models: [
      { model: 'claude-3-opus', provider: 'Anthropic', inputCostPer1k: 0.015, outputCostPer1k: 0.075 },
      { model: 'claude-3-sonnet', provider: 'Anthropic', inputCostPer1k: 0.003, outputCostPer1k: 0.015 },
    ],
    generate: async (prompt: string, options: Partial<AIConfig>) => ({
      text: `[Mocked ${options.model ?? 'claude-3-opus'}] ${prompt}`,
      tokenUsage: { input: prompt.length / 4, output: 96 },
    }),
    estimateCost: (model: string, tokenUsage: { input: number; output: number }) => {
      const pricing = findPricing(model);
      if (!pricing) return 0;
      const inputCost = (tokenUsage.input / 1000) * pricing.inputCostPer1k;
      const outputCost = (tokenUsage.output / 1000) * pricing.outputCostPer1k;
      return Number((inputCost + outputCost).toFixed(4));
    },
  },
  {
    id: 'google',
    name: 'Google',
    supportsParallel: true,
    capabilities: ['chat'],
    models: [
      { model: 'gemini-pro', provider: 'Google', inputCostPer1k: 0.00025, outputCostPer1k: 0.0005 },
    ],
    generate: async (prompt: string, options: Partial<AIConfig>) => ({
      text: `[Mocked ${options.model ?? 'gemini-pro'}] ${prompt}`,
      tokenUsage: { input: prompt.length / 4, output: 64 },
    }),
    estimateCost: (model: string, tokenUsage: { input: number; output: number }) => {
      const pricing = findPricing(model);
      if (!pricing) return 0;
      const inputCost = (tokenUsage.input / 1000) * pricing.inputCostPer1k;
      const outputCost = (tokenUsage.output / 1000) * pricing.outputCostPer1k;
      return Number((inputCost + outputCost).toFixed(4));
    },
  },
];

const findPricing = (modelId: string): AIModelPricing | undefined => {
  for (const provider of registry.values()) {
    const pricing = provider.models.find((m) => m.model === modelId);
    if (pricing) return pricing;
  }
  return undefined;
};

/**
 * Register a provider at runtime (Dependency Injection friendly).
 */
export const registerProvider = (provider: AIProvider) => {
  registry.set(provider.id, provider);
};

/**
 * Initialize registry with defaults on first import.
 */
defaultProviders.forEach(registerProvider);

export const listProviders = (): AIProvider[] => Array.from(registry.values());

export const findProviderByModel = (modelId: string): AIProvider | undefined => {
  return listProviders().find((provider) => provider.models.some((m) => m.model === modelId));
};

export const estimateCostForModel = (modelId: string, tokenUsage: { input: number; output: number }): number => {
  const provider = findProviderByModel(modelId);
  if (!provider) return 0;
  return provider.estimateCost(modelId, tokenUsage);
};

export const getPricingTable = (): AIModelPricing[] =>
  listProviders().flatMap((provider) => provider.models);
