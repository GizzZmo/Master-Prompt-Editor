import React from 'react';

const Header: React.FC = () => {
  return (
    <header style={{
      padding: '20px',
      borderBottom: '1px solid #e9ecef',
      backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1>AI Orchestrator</h1>
      {/* TODO: Add user profile, notifications, or global actions here */}
      <div className="user-actions">
        <span>Welcome, User!</span>
      </div>
    </header>
  );
};

export default Header;
