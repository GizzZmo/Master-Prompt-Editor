import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import { PromptEditorPage } from './pages/PromptEditor/PromptEditorPage';
import { AIToolkitPage } from './pages/AIToolkit/AIToolkitPage';
import SettingsPage from './pages/SettingsPage';
import { AIProvider } from './context/AIContext';
import { ToastProvider } from './context/ToastContext';
import KeyboardShortcuts from './components/ui/KeyboardShortcuts';
import { useToast } from './context/toastContextHelpers';

function AppContent() {
  const { showToast } = useToast();

  const shortcuts = [
    {
      key: 'ctrl+/',
      description: 'Show/hide keyboard shortcuts',
    },
    {
      key: 'ctrl+s',
      description: 'Save current prompt',
      action: () => showToast('Save shortcut pressed', 'info'),
    },
    {
      key: 'ctrl+n',
      description: 'Create new prompt',
      action: () => showToast('New prompt shortcut pressed', 'info'),
    },
    {
      key: 'ctrl+e',
      description: 'Execute workflow',
      action: () => showToast('Execute workflow shortcut pressed', 'info'),
    },
    {
      key: 'escape',
      description: 'Close modal or clear search',
    },
  ];

  return (
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
      <KeyboardShortcuts shortcuts={shortcuts} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AIProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AIProvider>
    </Router>
  );
}

export default App;
