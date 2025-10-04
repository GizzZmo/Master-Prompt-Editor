import React, { useState } from 'react';

interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('7d');

  const metrics: MetricCard[] = [
    {
      title: 'Total Prompts Executed',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      description: 'Compared to previous period'
    },
    {
      title: 'Average Response Time',
      value: '1.2s',
      change: '-8.3%',
      trend: 'up',
      description: 'Faster than previous period'
    },
    {
      title: 'Success Rate',
      value: '98.7%',
      change: '+2.1%',
      trend: 'up',
      description: 'Error rate decreased'
    },
    {
      title: 'Total API Cost',
      value: '$247.50',
      change: '+15.2%',
      trend: 'down',
      description: 'Increased usage'
    },
    {
      title: 'Active Workflows',
      value: '34',
      change: '+5',
      trend: 'up',
      description: 'New workflows created'
    },
    {
      title: 'User Satisfaction',
      value: '4.6/5',
      change: '+0.2',
      trend: 'up',
      description: 'Based on feedback'
    }
  ];

  const topModels = [
    { name: 'GPT-4', usage: 45, cost: '$125.30' },
    { name: 'GPT-3.5 Turbo', usage: 30, cost: '$45.20' },
    { name: 'Claude 3 Opus', usage: 15, cost: '$62.40' },
    { name: 'Gemini Pro', usage: 10, cost: '$14.60' }
  ];

  const recentActivity = [
    { time: '2 minutes ago', action: 'Workflow "Customer Onboarding" executed', status: 'success' },
    { time: '15 minutes ago', action: 'Prompt "Marketing Campaign v2.1" created', status: 'success' },
    { time: '1 hour ago', action: 'Model comparison completed: GPT-4 vs Claude', status: 'success' },
    { time: '2 hours ago', action: 'API rate limit warning', status: 'warning' },
    { time: '3 hours ago', action: 'Batch processing completed (250 prompts)', status: 'success' }
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return '↗';
      case 'down': return '↘';
      case 'neutral': return '→';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return '#28a745';
      case 'down': return '#dc3545';
      case 'neutral': return '#6c757d';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Analytics & Metrics</h2>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Comprehensive performance tracking and insights
          </p>
        </div>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          style={{ 
            padding: '8px 12px', 
            borderRadius: '4px', 
            border: '1px solid #ccc',
            fontSize: '14px'
          }}
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Key Metrics Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {metrics.map((metric, idx) => (
          <div 
            key={idx}
            style={{ 
              border: '1px solid #e9ecef', 
              padding: '20px', 
              borderRadius: '8px', 
              backgroundColor: 'white'
            }}
          >
            <div style={{ fontSize: '0.85em', color: '#666', marginBottom: '8px' }}>
              {metric.title}
            </div>
            <div style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '8px' }}>
              {metric.value}
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px',
              fontSize: '0.9em',
              color: getTrendColor(metric.trend)
            }}>
              <span style={{ fontSize: '1.2em' }}>{getTrendIcon(metric.trend)}</span>
              <span>{metric.change}</span>
            </div>
            <div style={{ fontSize: '0.8em', color: '#999', marginTop: '5px' }}>
              {metric.description}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Performance Chart Placeholder */}
        <div style={{ 
          border: '1px solid #e9ecef', 
          padding: '20px', 
          borderRadius: '8px', 
          backgroundColor: 'white'
        }}>
          <h3 style={{ marginTop: 0 }}>Performance Over Time</h3>
          <div style={{ 
            height: '300px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3em', marginBottom: '10px' }}>📊</div>
              <div>Chart visualization placeholder</div>
              <div style={{ fontSize: '0.85em', marginTop: '5px' }}>
                Response times, success rates, and cost trends
              </div>
            </div>
          </div>
        </div>

        {/* Top Models */}
        <div style={{ 
          border: '1px solid #e9ecef', 
          padding: '20px', 
          borderRadius: '8px', 
          backgroundColor: 'white'
        }}>
          <h3 style={{ marginTop: 0 }}>Top Models by Usage</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {topModels.map((model, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 'bold' }}>{model.name}</span>
                  <span style={{ color: '#666', fontSize: '0.9em' }}>{model.cost}</span>
                </div>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: '#e9ecef', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    width: `${model.usage}%`, 
                    height: '100%', 
                    backgroundColor: '#007bff',
                    transition: 'width 0.3s'
                  }} />
                </div>
                <div style={{ fontSize: '0.75em', color: '#666', marginTop: '2px' }}>
                  {model.usage}% of total usage
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ 
        border: '1px solid #e9ecef', 
        padding: '20px', 
        borderRadius: '8px', 
        backgroundColor: 'white'
      }}>
        <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentActivity.map((activity, idx) => (
            <div 
              key={idx}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '10px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                borderLeft: `3px solid ${getStatusColor(activity.status)}`
              }}
            >
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: getStatusColor(activity.status),
                marginRight: '12px'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9em' }}>{activity.action}</div>
                <div style={{ fontSize: '0.75em', color: '#666', marginTop: '2px' }}>
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        fontSize: '0.9em',
        color: '#666'
      }}>
        <strong>Note:</strong> This is a conceptual implementation. In production, these metrics would be 
        calculated from real usage data, with interactive charts and detailed drill-down capabilities.
      </div>
    </div>
  );
};

export default AnalyticsPage;
