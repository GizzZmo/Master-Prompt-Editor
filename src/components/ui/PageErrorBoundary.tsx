import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  pageName: string;
}

/**
 * Page-level error boundary with specific error handling for different pages
 */
const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({ children, pageName }) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log specific page errors with context
    console.error(`Error in ${pageName} page:`, error, errorInfo);
    
    // TODO: Send to analytics/monitoring service with page context
    // Example: analytics.track('Page Error', { 
    //   page: pageName, 
    //   error: error.message,
    //   stack: error.stack,
    //   componentStack: errorInfo.componentStack
    // });
  };

  const getPageSpecificFallback = () => {
    const baseStyle = {
      padding: '40px',
      textAlign: 'center' as const,
      backgroundColor: '#f8f9fa',
      borderRadius: '12px',
      margin: '20px',
      border: '1px solid #dee2e6'
    };

    switch (pageName) {
      case 'Dashboard':
        return (
          <div style={baseStyle}>
            <h2>Dashboard Unavailable</h2>
            <p>The dashboard encountered an error. Your prompts and data are safe.</p>
            <p>You can still access other features like the Prompt Editor.</p>
            <button 
              onClick={() => window.location.href = '/prompt-editor'}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Go to Prompt Editor
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Retry Dashboard
            </button>
          </div>
        );

      case 'Prompt Editor':
        return (
          <div style={baseStyle}>
            <h2>Prompt Editor Error</h2>
            <p>The prompt editor encountered an issue. Your work may not be saved.</p>
            <p>Please refresh to restore the editor or try the basic editor mode.</p>
            <button 
              onClick={() => {
                // Clear any corrupted state
                localStorage.removeItem('prompt-editor-state');
                window.location.reload();
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Reset & Reload Editor
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        );

      case 'AI Toolkit':
        return (
          <div style={baseStyle}>
            <h2>AI Toolkit Error</h2>
            <p>The AI toolkit encountered an error. This might be due to API connectivity issues.</p>
            <p>Please check your connection and try again.</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Retry AI Toolkit
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Back to Dashboard
            </button>
          </div>
        );

      default:
        return (
          <div style={baseStyle}>
            <h2>Page Error</h2>
            <p>This page encountered an unexpected error.</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Reload Page
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Go Home
            </button>
          </div>
        );
    }
  };

  return (
    <ErrorBoundary fallback={getPageSpecificFallback()} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary;