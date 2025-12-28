import React, { useState, useEffect, useRef } from 'react';
import { sendChatMessage, getChatAgents, clearChatSession, switchChatAgent } from '../utils/api';
import { useToast } from '../context/toastContextHelpers';
import Button from '../components/ui/Button';
import { ChatMessage, AIAgent, ChatResponse } from '../types/ai';
import '../styles/global.css';

const ChatbotOrchestratorPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load available agents on mount
  const loadAgents = React.useCallback(async () => {
    const response = await getChatAgents();
    if (response.success && response.data) {
      const agentData = response.data as AIAgent[];
      setAgents(agentData);
      
      // Set default agent (Claude 3.5 Sonnet)
      const defaultAgent = agentData.find((a) => a.id === 'claude-3.5-sonnet');
      if (defaultAgent) {
        setSelectedAgentId(defaultAgent.id);
      } else if (agentData.length > 0) {
        setSelectedAgentId(agentData[0].id);
      }
    } else {
      showToast(response.error || 'Failed to load agents', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(
        inputMessage,
        sessionId,
        selectedAgentId || undefined
      );

      if (response.success && response.data) {
        const chatResponse = response.data as ChatResponse;
        
        // Update session ID if this is the first message
        if (!sessionId) {
          setSessionId(chatResponse.sessionId);
        }

        // Add assistant message
        const assistantMessage: ChatMessage = {
          id: `msg_${Date.now()}_assistant`,
          type: 'assistant',
          content: chatResponse.message,
          timestamp: chatResponse.timestamp,
          agentId: chatResponse.agentId,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update total cost
        if (chatResponse.cost) {
          setTotalCost((prev) => prev + chatResponse.cost!);
        }

        // Show metrics
        if (chatResponse.durationMs) {
          const costStr = chatResponse.cost ? ` ($${chatResponse.cost.toFixed(4)})` : '';
          showToast(
            `Response from ${chatResponse.agentName} in ${chatResponse.durationMs}ms${costStr}`,
            'info'
          );
        }
      } else {
        showToast(response.error || 'Failed to send message', 'error');
      }
    } catch (error) {
      showToast('Error sending message', 'error');
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (sessionId) {
      const response = await clearChatSession(sessionId);
      if (response.success) {
        showToast('Chat cleared', 'success');
      }
    }
    setMessages([]);
    setSessionId(undefined);
    setTotalCost(0);
  };

  const handleSwitchAgent = async (newAgentId: string) => {
    if (sessionId && newAgentId !== selectedAgentId) {
      const response = await switchChatAgent(sessionId, newAgentId);
      if (response.success) {
        setSelectedAgentId(newAgentId);
        const agent = agents.find((a) => a.id === newAgentId);
        if (agent) {
          const systemMessage: ChatMessage = {
            id: `msg_${Date.now()}_system`,
            type: 'system',
            content: `Switched to ${agent.name}`,
            timestamp: new Date().toISOString(),
            agentId: newAgentId,
          };
          setMessages((prev) => [...prev, systemMessage]);
          showToast(`Switched to ${agent.name}`, 'success');
        }
      } else {
        showToast(response.error || 'Failed to switch agent', 'error');
      }
    } else {
      setSelectedAgentId(newAgentId);
    }
    setShowAgentSelector(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ marginBottom: '10px' }}>🤖 AI Chatbot Orchestrator</h1>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Chat with multiple AI agents including Claude 3.5 Sonnet, GPT-4, and free models like Llama 3
        </p>
        
        {/* Agent Info Bar */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px', 
          padding: '12px 15px', 
          background: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <div style={{ flex: 1 }}>
            {currentAgent ? (
              <div>
                <strong>Current Agent:</strong> {currentAgent.name} ({currentAgent.provider})
                <br />
                <small style={{ color: '#666' }}>
                  {currentAgent.speed} • {currentAgent.isFree ? 'Free' : currentAgent.costPer1kTokens} • {currentAgent.contextWindow} context
                </small>
              </div>
            ) : (
              <div>Loading agents...</div>
            )}
          </div>
          <Button onClick={() => setShowAgentSelector(!showAgentSelector)}>
            Change Agent
          </Button>
          <Button onClick={handleClearChat} variant="secondary">
            Clear Chat
          </Button>
          {totalCost > 0 && (
            <div style={{ 
              padding: '6px 12px', 
              background: '#e3f2fd', 
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Total: ${totalCost.toFixed(4)}
            </div>
          )}
        </div>

        {/* Agent Selector */}
        {showAgentSelector && (
          <div style={{ 
            marginTop: '15px', 
            padding: '15px', 
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            maxHeight: '300px',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginBottom: '10px' }}>Select AI Agent</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => handleSwitchAgent(agent.id)}
                  style={{
                    padding: '12px',
                    background: agent.id === selectedAgentId ? '#e3f2fd' : '#f8f9fa',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: `2px solid ${agent.id === selectedAgentId ? '#2196f3' : 'transparent'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <strong>{agent.name}</strong>
                    {agent.isFree && (
                      <span style={{ 
                        padding: '2px 8px', 
                        background: '#4caf50', 
                        color: 'white', 
                        borderRadius: '4px', 
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        FREE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {agent.description}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                    {agent.speed} • {agent.isFree ? 'Free' : agent.costPer1kTokens} • {agent.contextWindow}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px', 
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        marginBottom: '15px'
      }}>
        {messages.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            padding: '40px',
            fontSize: '16px'
          }}>
            <p style={{ marginBottom: '10px' }}>👋 Welcome to the AI Chatbot Orchestrator!</p>
            <p>Start a conversation with any AI agent. The system will intelligently route your requests to the best available model.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                marginBottom: '15px',
                display: 'flex',
                justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 
                    msg.type === 'user' ? '#2196f3' : 
                    msg.type === 'system' ? '#fff3cd' : 
                    '#f1f3f4',
                  color: msg.type === 'user' ? 'white' : '#333',
                  wordWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {msg.type === 'assistant' && msg.agentId && (
                  <div style={{ 
                    fontSize: '11px', 
                    opacity: 0.8, 
                    marginBottom: '4px',
                    fontWeight: 'bold'
                  }}>
                    {agents.find((a) => a.id === msg.agentId)?.name || msg.agentId}
                  </div>
                )}
                <div>{msg.content}</div>
                <div style={{ 
                  fontSize: '10px', 
                  opacity: 0.7, 
                  marginTop: '4px',
                  textAlign: msg.type === 'user' ? 'right' : 'left'
                }}>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ 
        display: 'flex', 
        gap: '10px',
        padding: '15px',
        background: 'white',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message... (Shift+Enter for new line, Enter to send)"
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            resize: 'none',
            minHeight: '60px',
            fontSize: '14px',
            fontFamily: 'inherit'
          }}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || !inputMessage.trim()}
          style={{ 
            minWidth: '100px',
            height: '60px'
          }}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  );
};

export default ChatbotOrchestratorPage;
