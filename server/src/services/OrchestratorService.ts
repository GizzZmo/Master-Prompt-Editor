// server/src/services/OrchestratorService.ts

/**
 * AI Agent definition for the orchestrator
 */
interface AIAgent {
  id: string;
  name: string;
  model: string;
  provider: string;
  isFree: boolean;
  speed: 'Very Fast' | 'Fast' | 'Medium' | 'Slow';
  costPer1kTokens?: string;
  contextWindow: string;
  description: string;
  isAvailable: boolean;
}

/**
 * Chat message structure
 */
interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  agentId?: string;
}

/**
 * Chat session structure
 */
interface ChatSession {
  id: string;
  messages: ChatMessage[];
  currentAgentId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Chat request structure
 */
interface ChatRequest {
  message: string;
  sessionId?: string;
  agentId?: string;
  context?: Record<string, unknown>;
}

/**
 * Chat response structure
 */
interface ChatResponse {
  sessionId: string;
  agentId: string;
  agentName: string;
  message: string;
  timestamp: string;
  cost?: number;
  durationMs?: number;
}

/**
 * OrchestratorService manages multiple AI agents and routes conversations
 * to the most appropriate agent based on task requirements, cost, and speed.
 */
export class OrchestratorService {
  private agents: Map<string, AIAgent>;
  private sessions: Map<string, ChatSession>;
  private defaultAgentId: string;

  constructor() {
    this.agents = new Map();
    this.sessions = new Map();
    this.defaultAgentId = 'claude-3.5-sonnet';
    this.initializeAgents();
  }

  /**
   * Initialize available AI agents with their configurations.
   * Includes both free and premium agents.
   */
  private initializeAgents(): void {
    const agentConfigs: AIAgent[] = [
      {
        id: 'claude-3.5-sonnet',
        name: 'Claude 3.5 Sonnet',
        model: 'claude-3-5-sonnet-20240620',
        provider: 'Anthropic',
        isFree: false,
        speed: 'Very Fast',
        costPer1kTokens: '$0.003 / $0.015',
        contextWindow: '200K',
        description: 'Fast, capable, and cost-effective. Excellent for general tasks, coding, and analysis.',
        isAvailable: true,
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        model: 'gpt-4-turbo',
        provider: 'OpenAI',
        isFree: false,
        speed: 'Fast',
        costPer1kTokens: '$0.01 / $0.03',
        contextWindow: '128K',
        description: 'Powerful and versatile model for complex reasoning and creative tasks.',
        isAvailable: true,
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        model: 'gpt-3.5-turbo',
        provider: 'OpenAI',
        isFree: false,
        speed: 'Very Fast',
        costPer1kTokens: '$0.0005 / $0.0015',
        contextWindow: '16K',
        description: 'Fast and cost-effective for simple tasks and quick responses.',
        isAvailable: true,
      },
      {
        id: 'llama-3-70b',
        name: 'Llama 3 70B',
        model: 'llama-3-70b-instruct',
        provider: 'Meta',
        isFree: true,
        speed: 'Fast',
        costPer1kTokens: 'Free',
        contextWindow: '8K',
        description: 'Free open-source model, great for general tasks and self-hosting.',
        isAvailable: true,
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        model: 'gemini-pro',
        provider: 'Google',
        isFree: true,
        speed: 'Very Fast',
        costPer1kTokens: 'Free (with limits)',
        contextWindow: '32K',
        description: 'Free tier available, fast responses for general tasks.',
        isAvailable: true,
      },
      {
        id: 'mixtral-8x7b',
        name: 'Mixtral 8x7B',
        model: 'mixtral-8x7b-instruct',
        provider: 'Mistral AI',
        isFree: true,
        speed: 'Fast',
        costPer1kTokens: 'Free (via HuggingFace)',
        contextWindow: '32K',
        description: 'Free open-source mixture-of-experts model, excellent quality for its size.',
        isAvailable: true,
      },
    ];

    agentConfigs.forEach((agent) => {
      this.agents.set(agent.id, agent);
    });
  }

  /**
   * Get all available agents
   */
  public getAgents(): AIAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get a specific agent by ID
   */
  public getAgent(agentId: string): AIAgent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Select the best agent for a given task based on various criteria
   */
  private selectBestAgent(message: string, preferFree: boolean = false): string {
    // Simple heuristic-based agent selection
    const messageLower = message.toLowerCase();

    // For coding tasks, prefer Claude 3.5 Sonnet or GPT-4
    if (messageLower.includes('code') || messageLower.includes('function') || 
        messageLower.includes('bug') || messageLower.includes('debug')) {
      return preferFree ? 'llama-3-70b' : 'claude-3.5-sonnet';
    }

    // For creative writing, prefer GPT-4 or Claude
    if (messageLower.includes('write') || messageLower.includes('story') || 
        messageLower.includes('creative')) {
      return preferFree ? 'mixtral-8x7b' : 'gpt-4-turbo';
    }

    // For quick/simple tasks, use fast and cheap models
    if (messageLower.includes('quick') || messageLower.includes('simple') || 
        message.length < 50) {
      return preferFree ? 'gemini-pro' : 'gpt-3.5-turbo';
    }

    // Default: use Claude 3.5 Sonnet (best balance of speed, quality, and cost)
    // or Llama 3 70B for free tier
    return preferFree ? 'llama-3-70b' : this.defaultAgentId;
  }

  /**
   * Create a new chat session
   */
  private createSession(agentId: string): ChatSession {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session: ChatSession = {
      id: sessionId,
      messages: [],
      currentAgentId: agentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get an existing session or create a new one
   */
  private getOrCreateSession(sessionId?: string, agentId?: string): ChatSession {
    if (sessionId && this.sessions.has(sessionId)) {
      return this.sessions.get(sessionId)!;
    }
    return this.createSession(agentId || this.defaultAgentId);
  }

  /**
   * Generate a mock AI response based on the agent and message
   * In a real implementation, this would call the actual AI API
   */
  private async generateResponse(
    agent: AIAgent,
    message: string,
    conversationHistory: ChatMessage[]
  ): Promise<string> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    // Generate a contextual response based on the agent
    const responses = [
      `Hello! I'm ${agent.name}, powered by ${agent.provider}. I understand you said: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}". How can I assist you further?`,
      `As ${agent.name}, I'm here to help! Regarding your message about "${message.substring(0, 40)}${message.length > 40 ? '...' : ''}", I can provide detailed assistance.`,
      `Thanks for your message! Using ${agent.model}, I can help you with that. ${agent.description}`,
    ];

    // Add context awareness if there's history
    if (conversationHistory.length > 1) {
      return `Continuing our conversation... ${responses[Math.floor(Math.random() * responses.length)]}`;
    }

    return responses[Math.floor(Math.random() * responses.length)];
  }

  /**
   * Process a chat request and return a response
   */
  public async chat(request: ChatRequest): Promise<ChatResponse> {
    const startTime = Date.now();

    // Determine which agent to use
    let agentId = request.agentId;
    if (!agentId) {
      // Auto-select based on message content
      const preferFree = request.context?.preferFree === true;
      agentId = this.selectBestAgent(request.message, preferFree);
    }

    const agent = this.getAgent(agentId);
    if (!agent || !agent.isAvailable) {
      throw new Error(`Agent ${agentId} is not available`);
    }

    // Get or create session
    const session = this.getOrCreateSession(request.sessionId, agentId);

    // Add user message to session
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'user',
      content: request.message,
      timestamp: new Date().toISOString(),
    };
    session.messages.push(userMessage);

    // Generate AI response
    const responseContent = await this.generateResponse(
      agent,
      request.message,
      session.messages
    );

    // Add assistant message to session
    const assistantMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'assistant',
      content: responseContent,
      timestamp: new Date().toISOString(),
      agentId: agent.id,
    };
    session.messages.push(assistantMessage);

    // Update session
    session.currentAgentId = agentId;
    session.updatedAt = new Date().toISOString();
    this.sessions.set(session.id, session);

    // Calculate metrics
    const durationMs = Date.now() - startTime;
    const estimatedTokens = Math.ceil((request.message.length + responseContent.length) / 4);
    const cost = this.estimateCost(agent, estimatedTokens);

    return {
      sessionId: session.id,
      agentId: agent.id,
      agentName: agent.name,
      message: responseContent,
      timestamp: assistantMessage.timestamp,
      cost,
      durationMs,
    };
  }

  /**
   * Estimate cost for a given agent and token count
   */
  private estimateCost(agent: AIAgent, tokens: number): number | undefined {
    if (agent.isFree || !agent.costPer1kTokens) {
      return 0;
    }

    // Parse cost string (e.g., "$0.003 / $0.015" -> average)
    const costs = agent.costPer1kTokens.match(/\d+\.\d+/g);
    if (costs && costs.length > 0) {
      const avgCost = costs.reduce((sum, cost) => sum + parseFloat(cost), 0) / costs.length;
      return (avgCost * tokens) / 1000;
    }

    return undefined;
  }

  /**
   * Get a chat session by ID
   */
  public getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get all active sessions
   */
  public getSessions(): ChatSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Clear a chat session
   */
  public clearSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Switch agent in an existing session
   */
  public switchAgent(sessionId: string, newAgentId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    const agent = this.getAgent(newAgentId);
    if (!agent || !agent.isAvailable) {
      return false;
    }

    session.currentAgentId = newAgentId;
    session.updatedAt = new Date().toISOString();

    // Add a system message about the switch
    const systemMessage: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'system',
      content: `Switched to ${agent.name}`,
      timestamp: new Date().toISOString(),
      agentId: newAgentId,
    };
    session.messages.push(systemMessage);

    this.sessions.set(sessionId, session);
    return true;
  }
}
