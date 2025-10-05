import React, { useState, useMemo } from 'react';

type TimeRange = '24h' | '7d' | '30d' | '90d';

interface ActivityLog {
  id: string;
  type: 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  model?: string;
}

interface ModelUsage {
  name: string;
  usage: number;
  percentage: number;
}

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  // Mock data - would come from API in production
  const metrics = useMemo(() => {
    const baseMetrics = {
      totalPrompts: 1247,
      avgResponseTime: 2.3,
      successRate: 96.8,
      apiCost: 142.50
    };

    // Adjust metrics based on time range
    const multipliers = {
      '24h': 0.1,
      '7d': 1,
      '30d': 4,
      '90d': 12
    };

    const multiplier = multipliers[timeRange];

    return {
      totalPrompts: Math.round(baseMetrics.totalPrompts * multiplier),
      avgResponseTime: baseMetrics.avgResponseTime,
      successRate: baseMetrics.successRate,
      apiCost: baseMetrics.apiCost * multiplier
    };
  }, [timeRange]);

  const modelUsage: ModelUsage[] = [
    { name: 'GPT-4', usage: 485, percentage: 39 },
    { name: 'Claude 3 Opus', usage: 374, percentage: 30 },
    { name: 'GPT-4 Turbo', usage: 249, percentage: 20 },
    { name: 'Gemini Pro', usage: 87, percentage: 7 },
    { name: 'Others', usage: 52, percentage: 4 }
  ];

  const recentActivities: ActivityLog[] = [
    { id: '1', type: 'success', message: 'Prompt optimization completed', timestamp: '2 minutes ago', model: 'GPT-4' },
    { id: '2', type: 'success', message: 'Code review workflow executed', timestamp: '15 minutes ago', model: 'Claude 3' },
    { id: '3', type: 'warning', message: 'High latency detected (3.8s)', timestamp: '1 hour ago', model: 'GPT-4 Turbo' },
    { id: '4', type: 'success', message: 'Batch processing completed (50 items)', timestamp: '2 hours ago' },
    { id: '5', type: 'error', message: 'API rate limit reached', timestamp: '3 hours ago', model: 'Gemini Pro' },
    { id: '6', type: 'success', message: 'Marketing copy generated', timestamp: '4 hours ago', model: 'GPT-4' },
    { id: '7', type: 'success', message: 'Data analysis completed', timestamp: '5 hours ago', model: 'Claude 3' },
    { id: '8', type: 'warning', message: 'Token limit exceeded, truncated', timestamp: '6 hours ago' }
  ];

  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '📝';
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>📊 Analytics & Metrics</h2>
        
        {/* Time Range Filter */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {(['24h', '7d', '30d', '90d'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '8px 16px',
                backgroundColor: timeRange === range ? '#007bff' : 'white',
                color: timeRange === range ? 'white' : '#212529',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: timeRange === range ? '600' : '400'
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Total Prompts Executed</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#212529' }}>{metrics.totalPrompts.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#28a745', marginTop: '8px' }}>↑ 12% from previous period</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Avg Response Time</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#212529' }}>{metrics.avgResponseTime}s</div>
          <div style={{ fontSize: '12px', color: '#28a745', marginTop: '8px' }}>↓ 8% faster</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Success Rate</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#212529' }}>{metrics.successRate}%</div>
          <div style={{ fontSize: '12px', color: '#28a745', marginTop: '8px' }}>↑ 2.3% improvement</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>API Costs</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#212529' }}>${metrics.apiCost.toFixed(2)}</div>
          <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '8px' }}>↑ 5% from previous period</div>
        </div>
      </div>

      {/* Top Models by Usage */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginBottom: '30px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Top Models by Usage</h3>
        {modelUsage.map((model, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{model.name}</span>
              <span style={{ fontSize: '14px', color: '#6c757d' }}>
                {model.usage} runs ({model.percentage}%)
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${model.percentage}%`,
                height: '100%',
                backgroundColor: '#007bff',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {recentActivities.map(activity => (
            <div
              key={activity.id}
              style={{
                display: 'flex',
                alignItems: 'start',
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '6px',
                borderLeft: `4px solid ${getStatusColor(activity.type)}`
              }}
            >
              <span style={{ fontSize: '20px', marginRight: '12px' }}>
                {getStatusIcon(activity.type)}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', color: '#212529', marginBottom: '4px' }}>
                  {activity.message}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  {activity.timestamp}
                  {activity.model && ` • ${activity.model}`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
