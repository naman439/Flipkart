'use client';

import React from 'react';

/**
 * Minimalist ErrorBoundary for catching rendering errors
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', background: 'white' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Something went wrong.</h2>
          <p style={{ color: '#666', marginBottom: 20 }}>We're working on fixing it. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
