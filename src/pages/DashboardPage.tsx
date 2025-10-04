import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const DashboardPage: React.FC = () => {
  const quickActions = [
    { label: 'Create New Prompt', icon: '✏️', link: '/prompt-editor', color: '#007bff' },
    { label: 'Browse Templates', icon: '📚', link: '/prompt-library', color: '#28a745' },
    { label: 'Build Workflow', icon: '🔗', link: '/ai-toolkit', color: '#6f42c1' },
    { label: 'Compare Models', icon: '⚖️', link: '/model-comparison', color: '#fd7e14' },
    { label: 'View Analytics', icon: '📊', link: '/analytics', color: '#20c997' },
    { label: 'Get Help', icon: '❓', link: '/help', color: '#17a2b8' }
  ];

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the AI Orchestrator! This dashboard provides an overview of your AI activities, prompt performance, and system health.</p>
      
      {/* Quick Actions */}
      <div style={{ 
        border: '1px solid #e9ecef', 
        padding: '20px', 
        borderRadius: '8px', 
        backgroundColor: 'white',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '15px' 
        }}>
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.link}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div
                style={{
                  padding: '15px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color;
                  e.currentTarget.style.backgroundColor = '#e9ecef';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                }}
              >
                <div style={{ fontSize: '2em', marginBottom: '8px' }}>{action.icon}</div>
                <div style={{ fontSize: '0.9em', fontWeight: 'bold' }}>{action.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3>Prompt Performance Overview</h3>
          <p>Key metrics like successful prompt runs, error rates, and cost analysis.</p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '15px',
            marginTop: '15px'
          }}>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#28a745' }}>98.7%</div>
              <div style={{ fontSize: '0.85em', color: '#666' }}>Success Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#007bff' }}>1.2s</div>
              <div style={{ fontSize: '0.85em', color: '#666' }}>Avg Response</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#6f42c1' }}>2,847</div>
              <div style={{ fontSize: '0.85em', color: '#666' }}>Total Runs</div>
            </div>
            <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#fd7e14' }}>$247</div>
              <div style={{ fontSize: '0.85em', color: '#666' }}>Monthly Cost</div>
            </div>
          </div>
          <Link to="/analytics" style={{ textDecoration: 'none', display: 'block', marginTop: '15px' }}>
            <Button>View Detailed Analytics →</Button>
          </Link>
        </div>
        <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3>AI Toolkit Usage</h3>
          <p>Insights into multimodal AI tasks, workflow automation usage, and model utilization.</p>
          <div style={{ marginTop: '15px' }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '0.9em' }}>Active Workflows</span>
                <span style={{ fontWeight: 'bold' }}>34</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                <div style={{ width: '75%', height: '100%', backgroundColor: '#007bff', borderRadius: '4px' }} />
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '0.9em' }}>Model Usage</span>
                <span style={{ fontWeight: 'bold' }}>High</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                <div style={{ width: '85%', height: '100%', backgroundColor: '#28a745', borderRadius: '4px' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '0.9em' }}>Resource Consumption</span>
                <span style={{ fontWeight: 'bold' }}>Moderate</span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
                <div style={{ width: '60%', height: '100%', backgroundColor: '#ffc107', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3>Recent Activities</h3>
          <p>Latest prompt updates, workflow runs, and system alerts.</p>
          <ul style={{ fontSize: '0.9em', lineHeight: '1.8' }}>
            <li>
              <span style={{ color: '#28a745', marginRight: '5px' }}>✓</span>
              Prompt &apos;marketing-campaign-v1.2.0&apos; updated.
              <div style={{ fontSize: '0.8em', color: '#666' }}>2 minutes ago</div>
            </li>
            <li>
              <span style={{ color: '#28a745', marginRight: '5px' }}>✓</span>
              Workflow &apos;CustomerOnboarding&apos; executed successfully.
              <div style={{ fontSize: '0.8em', color: '#666' }}>15 minutes ago</div>
            </li>
            <li>
              <span style={{ color: '#ffc107', marginRight: '5px' }}>⚠</span>
              Alert: High latency detected on image generation task.
              <div style={{ fontSize: '0.8em', color: '#666' }}>1 hour ago</div>
            </li>
          </ul>
        </div>
        <div style={{ border: '1px solid #e9ecef', padding: '20px', borderRadius: '8px', backgroundColor: 'white' }}>
          <h3>System Health</h3>
          <p>Monitoring overall system performance, stability, and uptime.</p>
          <div style={{ marginTop: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#28a745', 
                borderRadius: '50%',
                marginRight: '10px'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9em', fontWeight: 'bold' }}>API Services</div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>All systems operational</div>
              </div>
              <div style={{ fontSize: '0.9em', color: '#28a745', fontWeight: 'bold' }}>99.9%</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#28a745', 
                borderRadius: '50%',
                marginRight: '10px'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9em', fontWeight: 'bold' }}>Database</div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>Response time: 45ms</div>
              </div>
              <div style={{ fontSize: '0.9em', color: '#28a745', fontWeight: 'bold' }}>Healthy</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                backgroundColor: '#ffc107', 
                borderRadius: '50%',
                marginRight: '10px'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9em', fontWeight: 'bold' }}>Cache Layer</div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>High memory usage</div>
              </div>
              <div style={{ fontSize: '0.9em', color: '#ffc107', fontWeight: 'bold' }}>Warning</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
