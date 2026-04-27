import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', gap: '16px',
          background: 'var(--bg-base)', color: 'var(--tx-primary)',
          fontFamily: 'inherit', padding: '24px', textAlign: 'center',
        }}>
          <span style={{ fontSize: '48px' }}>⚠️</span>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>Something went wrong</h2>
          <p style={{ color: 'var(--tx-muted)', margin: 0, maxWidth: '400px' }}>
            {this.state.error.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.href = '/'; }}
            style={{
              padding: '8px 20px', borderRadius: '8px', border: 'none',
              background: 'var(--brand)', color: '#fff', cursor: 'pointer',
              fontSize: '14px', fontWeight: 600,
            }}
          >
            Go home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
