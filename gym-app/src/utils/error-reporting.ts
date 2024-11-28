interface ErrorReport {
  error?: string;
  stack?: string;
  componentStack?: string;
  url?: string;
  userAgent?: string;
  timestamp?: string;
}

// In a real app, this would send the error to your error tracking service
// like Sentry, LogRocket, or your own error tracking backend
export const reportError = (error: Error | ErrorReport, errorInfo?: any) => {
  // During development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error occurred:', error);
    if (errorInfo) {
      console.error('Error Info:', errorInfo);
    }
  }

  // In production, you would send this to your error tracking service
  // Example with Sentry:
  // if (process.env.NODE_ENV === 'production' && window.Sentry) {
  //   window.Sentry.captureException(error, { extra: errorInfo });
  // }

  // For now, we'll just store it in localStorage for demonstration
  try {
    const errors = JSON.parse(localStorage.getItem('error_logs') || '[]');
    errors.push({
      ...(error instanceof Error ? {
        message: error.message,
        stack: error.stack,
      } : error),
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('error_logs', JSON.stringify(errors.slice(-10))); // Keep last 10 errors
  } catch (e) {
    console.error('Failed to store error log:', e);
  }
};
