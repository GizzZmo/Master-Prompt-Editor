import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import { PromptEditorPage } from './pages/PromptEditor/PromptEditorPage';
import { AIToolkitPage } from './pages/AIToolkit/AIToolkitPage';
import SettingsPage from './pages/SettingsPage';
import PromptLibraryPage from './pages/PromptLibraryPage';
import ModelComparisonPage from './pages/ModelComparisonPage';
import AnalyticsPage from './pages/AnalyticsPage';
import HelpPage from './pages/HelpPage';
import { AIProvider } from './context/AIContext';
import { ToastProvider } from './context/ToastContext';
import KeyboardShortcuts from './components/ui/KeyboardShortcuts';
import ErrorBoundary from './components/ui/ErrorBoundary';
import PageErrorBoundary from './components/ui/PageErrorBoundary';
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
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>
      <div className="main-content">
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <div className="page-content">
          <Routes>
            <Route path="/" element={
              <PageErrorBoundary pageName="Dashboard">
                <DashboardPage />
              </PageErrorBoundary>
            } />
            <Route path="/prompt-editor" element={
              <PageErrorBoundary pageName="Prompt Editor">
                <PromptEditorPage />
              </PageErrorBoundary>
            } />
            <Route path="/ai-toolkit" element={
              <PageErrorBoundary pageName="AI Toolkit">
                <AIToolkitPage />
              </PageErrorBoundary>
            } />
            <Route path="/prompt-library" element={
              <PageErrorBoundary pageName="Prompt Library">
                <PromptLibraryPage />
              </PageErrorBoundary>
            } />
            <Route path="/model-comparison" element={
              <PageErrorBoundary pageName="Model Comparison">
                <ModelComparisonPage />
              </PageErrorBoundary>
            } />
            <Route path="/analytics" element={
              <PageErrorBoundary pageName="Analytics">
                <AnalyticsPage />
              </PageErrorBoundary>
            } />
            <Route path="/help" element={
              <PageErrorBoundary pageName="Help">
                <HelpPage />
              </PageErrorBoundary>
            } />
            <Route path="/settings" element={
              <PageErrorBoundary pageName="Settings">
                <SettingsPage />
              </PageErrorBoundary>
            } />
          </Routes>
        </div>
      </div>
      <ErrorBoundary>
        <KeyboardShortcuts shortcuts={shortcuts} />
      </ErrorBoundary>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AIProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AIProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
