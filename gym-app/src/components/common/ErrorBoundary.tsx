import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import { isApiError, ApiError } from '../../utils/api-helpers';
import { reportError } from '../../utils/error-reporting';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorReport {
  error: string | undefined;
  stack: string | undefined;
  componentStack: string | undefined;
  url: string;
  userAgent: string;
  timestamp: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Report error to monitoring service
    reportError(error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Reload the page to ensure clean state
    window.location.reload();
  };

  private handleReportIssue = () => {
    const { error, errorInfo } = this.state;
    const errorReport: ErrorReport = {
      error: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack || undefined,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    // Send error report to backend
    reportError(errorReport);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const error = this.state.error;
      const isApi = isApiError(error);
      const status = isApi ? (error as ApiError).status : null;

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              maxWidth: 600,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Typography variant="h4" gutterBottom color="error">
              {status === 404 ? 'Page Not Found' : 'Oops! Something went wrong'}
            </Typography>
            
            <Typography variant="body1" color="text.secondary" paragraph>
              {isApi
                ? (error as ApiError).message
                : 'We apologize for the inconvenience. Please try again later.'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleReset}
              >
                Try Again
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={this.handleReportIssue}
              >
                Report Issue
              </Button>
              <Button
                variant="text"
                color="primary"
                onClick={() => window.location.href = '/'}
              >
                Go to Homepage
              </Button>
            </Box>

            {process.env.NODE_ENV === 'development' && (
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography variant="subtitle2" color="error" gutterBottom>
                  Error Details (Development Only):
                </Typography>
                <pre style={{ overflow: 'auto', maxHeight: '200px' }}>
                  {error?.stack}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
