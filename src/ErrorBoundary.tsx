import { store } from '@store';
import { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch() {
    const token = store.getState().auth.token;
    if (process.env.NODE_ENV === 'development') return;

    let redirectUrl = '/error-page';

    if (!token) redirectUrl = '/login-required';

    window.location.href = redirectUrl;
  }

  render() {
    if (this.state.hasError) {
      return null; // Render nothing as we are navigating to 404 page
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
