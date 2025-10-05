import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkStyle = (path: string) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '10px 15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderRadius: '5px',
    backgroundColor: isActive(path) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    transition: 'background-color 0.2s',
    fontWeight: isActive(path) ? '600' : '400'
  });

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: '#343a40',
      color: 'white',
      padding: '20px',
      position: 'fixed',
      height: '100%',
      overflowY: 'auto'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🤖 AI Orchestrator</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '8px' }}>
            <Link to="/" style={linkStyle('/')}>
              <span style={{ fontSize: '18px' }}>🏠</span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <Link to="/prompt-editor" style={linkStyle('/prompt-editor')}>
              <span style={{ fontSize: '18px' }}>📝</span>
              <span>Master Prompt Editor</span>
            </Link>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <Link to="/prompt-library" style={linkStyle('/prompt-library')}>
              <span style={{ fontSize: '18px' }}>📚</span>
              <span>Prompt Library</span>
            </Link>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <Link to="/ai-toolkit" style={linkStyle('/ai-toolkit')}>
              <span style={{ fontSize: '18px' }}>🛠️</span>
              <span>Advanced AI Toolkit</span>
            </Link>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <Link to="/model-comparison" style={linkStyle('/model-comparison')}>
              <span style={{ fontSize: '18px' }}>🔍</span>
              <span>Model Comparison</span>
            </Link>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <Link to="/analytics" style={linkStyle('/analytics')}>
              <span style={{ fontSize: '18px' }}>📊</span>
              <span>Analytics & Metrics</span>
            </Link>
          </li>
          <li style={{ marginBottom: '8px' }}>
            <Link to="/help" style={linkStyle('/help')}>
              <span style={{ fontSize: '18px' }}>❓</span>
              <span>Help & Documentation</span>
            </Link>
          </li>
          <li style={{ marginBottom: '8px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Link to="/settings" style={linkStyle('/settings')}>
              <span style={{ fontSize: '18px' }}>⚙️</span>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
