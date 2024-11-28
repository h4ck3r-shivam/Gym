import { useState, useCallback } from 'react';
import { AxiosResponse } from 'axios';
import { ApiResponse } from '../types';
import { handleApiError, isSuccessResponse, extractErrorMessage } from '../utils/api-helpers';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiResponse<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiCall: (...args: any[]) => Promise<AxiosResponse<ApiResponse<T>>>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
    initialData?: T | null;
  }
): UseApiResponse<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: options?.initialData || null,
    loading: false,
    error: null,
  });

  const reset = useCallback(() => {
    setState({
      data: options?.initialData || null,
      loading: false,
      error: null,
    });
  }, [options?.initialData]);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const response = await apiCall(...args);

        if (!isSuccessResponse(response.data)) {
          const errorMessage = extractErrorMessage(response.data) || 'Request failed';
          throw new Error(errorMessage);
        }

        const data = Object.values(response.data.data || {})[0] as T;
        setState((prev) => ({ ...prev, data, loading: false }));
        options?.onSuccess?.(data);
      } catch (error) {
        const errorMessage = handleApiError(error).message;
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
        options?.onError?.(errorMessage);
      }
    },
    [apiCall, options]
  );

  return {
    ...state,
    execute,
    reset,
  };
}

// Example usage:
/*
const MyComponent = () => {
  const {
    data: gyms,
    loading,
    error,
    execute: fetchGyms
  } = useApi(gymAPI.getAllGyms, {
    onSuccess: (data) => console.log('Gyms loaded:', data),
    onError: (error) => console.error('Failed to load gyms:', error)
  });

  useEffect(() => {
    fetchGyms();
  }, [fetchGyms]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!gyms) return null;

  return (
    <div>
      {gyms.map(gym => (
        <GymCard key={gym._id} gym={gym} />
      ))}
    </div>
  );
};
*/
