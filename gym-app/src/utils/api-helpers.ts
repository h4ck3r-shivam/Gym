import { AxiosError } from 'axios';
import { ApiResponse } from '../types';

export interface ApiErrorResponse {
  message: string;
  error?: string;
}

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error: unknown): ApiErrorResponse => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiResponse<unknown>;
    return {
      message: response?.message || response?.error || error.message || 'An error occurred',
      error: response?.error,
    };
  }
  return {
    message: error instanceof Error ? error.message : 'An unknown error occurred',
  };
};

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

export const getErrorMessage = (error: unknown): string => {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isSuccessResponse = <T>(response: ApiResponse<T>): boolean => {
  return response.success === true;
};

export const extractErrorMessage = <T>(response: ApiResponse<T>): string | undefined => {
  if (!response.success) {
    return response.message || response.error;
  }
  return undefined;
};
