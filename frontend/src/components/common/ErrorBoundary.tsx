import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-primary-light to-[#062a5a] p-4">
          <div className="glass rounded-xl p-8 max-w-md w-full text-center">
            <div className="p-4 bg-danger/20 rounded-full w-16 h-16 mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-danger" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            
            <p className="text-white/70 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            
            <div className="bg-black/30 rounded-lg p-4 mb-6 text-left">
              <code className="text-xs text-white/50 break-all">
                {this.state.error?.stack}
              </code>
            </div>
            
            <Button onClick={this.handleReset} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
