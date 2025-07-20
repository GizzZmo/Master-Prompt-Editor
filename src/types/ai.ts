/**
 * Represents a single prompt structure used throughout the application.
 */
export interface Prompt {
  id: string;
  name: string;
  content: string;
  version: string;
}

/**
 * Defines the configuration options for an AI model's generation request.
 */
export interface AIConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

/**
 * Represents a standard text output from an AI model.
 */
export interface TextOutput {
  text: string;
}

/**
 * Represents a potentially multimodal output that could include text, images, or other media.
 */
export interface MultimodalOutput {
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
}

/**
 * A generic API response structure for AI-related requests.
 */
export interface AIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
