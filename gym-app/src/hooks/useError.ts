import { useState, useCallback } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import {
  handleApiError,
  isNetworkError,
  isAuthenticationError,
  isAuthorizationError,
  ApiError,
} from '../utils/errorHandling';

interface UseErrorOptions {
  showNotification?: boolean;
  throwError?: boolean;
}

export function useError(options: UseErrorOptions = {}) {
  const { showNotification = true, throwError = false } = options;
  const { addNotification } = useNotification();
  const [error, setError] = useState<ApiError | null>(null);

  const handleError = useCallback(
    (err: unknown) => {
      const apiError = handleApiError(err);
      setError(apiError);

      if (showNotification) {
        let notificationType: 'error' | 'warning' = 'error';
        let message = apiError.message;

        if (isNetworkError(err)) {
          message = 'Network error. Please check your internet connection.';
        } else if (isAuthenticationError(err)) {
          message = 'Please log in to continue.';
          notificationType = 'warning';
        } else if (isAuthorizationError(err)) {
          message = 'You do not have permission to perform this action.';
          notificationType = 'warning';
        }

        addNotification({
          type: notificationType,
          message,
        });
      }

      if (throwError) {
        throw err;
      }

      return apiError;
    },
    [showNotification, addNotification, throwError]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
}

export default useError;
