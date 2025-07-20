import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
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
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>AI Orchestrator</h2>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', padding: '10px 15px', display: 'block', borderRadius: '5px' }}>Dashboard</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/prompt-editor" style={{ color: 'white', textDecoration: 'none', padding: '10px 15px', display: 'block', borderRadius: '5px' }}>Master Prompt Editor</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/ai-toolkit" style={{ color: 'white', textDecoration: 'none', padding: '10px 15px', display: 'block', borderRadius: '5px' }}>Advanced AI Toolkit</Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/settings" style={{ color: 'white', textDecoration: 'none', padding: '10px 15px', display: 'block', borderRadius: '5px' }}>Settings</Link>
          </li>
          {/* TODO: Add more navigation links based on 'Swiss Army Knife' functionality */}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
