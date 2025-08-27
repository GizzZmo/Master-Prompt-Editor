import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console and external service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({ errorInfo });

    // TODO: Log to external error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI or default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          border: '1px solid #ff4444', 
          borderRadius: '8px', 
          backgroundColor: '#ffe6e6',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#cc0000', marginBottom: '16px' }}>Something went wrong</h2>
          <p style={{ marginBottom: '16px', color: '#666' }}>
            An unexpected error occurred. Please refresh the page and try again.
          </p>
          <details style={{ textAlign: 'left', marginBottom: '16px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Error Details (Click to expand)
            </summary>
            <div style={{ 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#f5f5f5', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '12px',
              overflow: 'auto'
            }}>
              {this.state.error && (
                <div>
                  <strong>Error:</strong> {this.state.error.toString()}
                  <br />
                  <strong>Stack:</strong>
                  <pre>{this.state.error.stack}</pre>
                </div>
              )}
              {this.state.errorInfo && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre>{this.state.errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;