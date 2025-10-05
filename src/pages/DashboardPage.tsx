import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  // Mock metrics - would come from API in production
  const metrics = {
    successRate: 96.8,
    avgResponse: 2.3,
    totalRuns: 1247,
    monthlyCost: 142.50
  };

  const toolkitUsage = [
    { name: 'Prompt Editor', usage: 85 },
    { name: 'Workflow Automation', usage: 62 },
    { name: 'Model Testing', usage: 48 },
    { name: 'Data Analysis', usage: 35 }
  ];

  const recentActivities = [
    { id: '1', icon: '✅', message: 'Prompt optimization completed', time: '2 min ago', status: 'success' },
    { id: '2', icon: '✅', message: 'Code review workflow executed', time: '15 min ago', status: 'success' },
    { id: '3', icon: '⚠️', message: 'High latency detected (3.8s)', time: '1 hour ago', status: 'warning' },
    { id: '4', icon: '✅', message: 'Batch processing completed', time: '2 hours ago', status: 'success' },
    { id: '5', icon: '❌', message: 'API rate limit reached', time: '3 hours ago', status: 'error' }
  ];

  const systemHealth = [
    { component: 'API Gateway', status: 'operational', icon: '🟢' },
    { component: 'Database', status: 'operational', icon: '🟢' },
    { component: 'AI Models', status: 'operational', icon: '🟢' },
    { component: 'Cache', status: 'degraded', icon: '🟡' }
  ];

  return (
    <div>
      <h2>🏠 Dashboard</h2>
      <p>Welcome to the AI Orchestrator! Monitor your AI activities, performance metrics, and system health.</p>

      {/* Quick Actions Widget */}
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #e9ecef',
        marginTop: '20px',
        marginBottom: '30px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '15px' }}>⚡ Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <Link to="/prompt-editor" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1px solid #e9ecef'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
              <div style={{ fontWeight: '600', color: '#212529' }}>Create Prompt</div>
            </div>
          </Link>
          <Link to="/prompt-library" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1px solid #e9ecef'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📚</div>
              <div style={{ fontWeight: '600', color: '#212529' }}>Browse Templates</div>
            </div>
          </Link>
          <Link to="/model-comparison" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1px solid #e9ecef'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
              <div style={{ fontWeight: '600', color: '#212529' }}>Compare Models</div>
            </div>
          </Link>
          <Link to="/analytics" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1px solid #e9ecef'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
              <div style={{ fontWeight: '600', color: '#212529' }}>View Analytics</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Real Metrics Display */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Success Rate</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>{metrics.successRate}%</div>
          <div style={{ fontSize: '12px', color: '#28a745', marginTop: '4px' }}>↑ 2.3% improvement</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Avg Response</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>{metrics.avgResponse}s</div>
          <div style={{ fontSize: '12px', color: '#28a745', marginTop: '4px' }}>↓ 8% faster</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Total Runs</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#212529' }}>{metrics.totalRuns.toLocaleString()}</div>
          <div style={{ fontSize: '12px', color: '#28a745', marginTop: '4px' }}>↑ 12% this week</div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Monthly Cost</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#212529' }}>${metrics.monthlyCost}</div>
          <div style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>↑ 5% from last month</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        {/* Toolkit Usage with Progress Bars */}
        <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>🛠️ Toolkit Usage</h3>
          {toolkitUsage.map((tool, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{tool.name}</span>
                <span style={{ fontSize: '14px', color: '#6c757d' }}>{tool.usage}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e9ecef',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${tool.usage}%`,
                  height: '100%',
                  backgroundColor: '#007bff',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Recent Activities */}
        <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>📋 Recent Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentActivities.map(activity => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              >
                <span style={{ fontSize: '18px', marginRight: '10px' }}>{activity.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#212529', marginBottom: '2px' }}>{activity.message}</div>
                  <div style={{ fontSize: '12px', color: '#6c757d' }}>{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health Monitoring */}
        <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>💚 System Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {systemHealth.map((component, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{component.icon}</span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{component.component}</span>
                </div>
                <span style={{
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  backgroundColor: component.status === 'operational' ? '#d4edda' : '#fff3cd',
                  color: component.status === 'operational' ? '#155724' : '#856404'
                }}>
                  {component.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Overview */}
        <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ marginTop: 0 }}>📈 Performance Overview</h3>
          <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '15px' }}>
            Key metrics tracking prompt execution, response times, and cost analysis
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <span style={{ fontSize: '14px' }}>Avg. Tokens/Request</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>1,250</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <span style={{ fontSize: '14px' }}>Peak Load Time</span>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>14:00-16:00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <span style={{ fontSize: '14px' }}>Error Rate</span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#28a745' }}>3.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
