import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

// Declare global window property for error tracking
declare global {
  interface Window {
    trackComponentError?: (error: Error, componentStack: string) => void;
  }
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: undefined,
    errorInfo: undefined
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to the console
    console.error('Uncaught error:', error, errorInfo);
    
    // Track error with analytics if available
    if (typeof window.trackComponentError === 'function') {
      window.trackComponentError(error, errorInfo.componentStack || '');
    }
    
    // Update state with error info
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      // Render fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-red-800">
              <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
              <p className="mb-4">An unexpected error occurred. Please try refreshing the page.</p>
              {this.state.error && (
                <details className="text-sm bg-red-100 p-3 rounded">
                  <summary className="font-semibold cursor-pointer">Error details</summary>
                  <pre className="mt-2 overflow-auto">{this.state.error.toString()}</pre>
                </details>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Refresh Page
                </button>
                <button
                  onClick={() => {
                    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
                  }}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;