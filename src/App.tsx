import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import PromptEditorPage from './pages/PromptEditor/PromptEditorPage';
import AIToolkitPage from './pages/AIToolkit/AIToolkitPage';
import SettingsPage from './pages/SettingsPage';
import { AIProvider } from './context/AIContext';

function App() {
  return (
    <Router>
      <AIProvider>
        <div className="app-container">
          <Sidebar />
          <div className="main-content">
            <Header />
            <div className="page-content">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/prompt-editor" element={<PromptEditorPage />} />
                <Route path="/ai-toolkit" element={<AIToolkitPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                {/* TODO: Add more routes for specific toolkit functionalities */}
              </Routes>
            </div>
          </div>
        </div>
      </AIProvider>
    </Router>
  );
}

export default App;
