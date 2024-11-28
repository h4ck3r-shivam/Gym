import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  code?: string;
  details?: any;

  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      details: error.details,
    };
  }

  if (error instanceof AxiosError) {
    const response = error.response?.data;
    return {
      message: response?.message || error.message,
      code: response?.code || error.code,
      details: response?.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error occurred',
  };
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return !error.response;
  }
  return false;
}

export function isAuthenticationError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
}

export function isAuthorizationError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 403;
  }
  return false;
}

export function isValidationError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 422;
  }
  return false;
}

export function getErrorMessage(error: unknown): string {
  const apiError = handleApiError(error);
  return apiError.message;
}

export function getErrorCode(error: unknown): string | undefined {
  const apiError = handleApiError(error);
  return apiError.code;
}

export function getValidationErrors(error: unknown): Record<string, string[]> {
  if (error instanceof AxiosError && error.response?.status === 422) {
    return error.response.data.errors || {};
  }
  return {};
}

export function formatValidationErrors(
  errors: Record<string, string[]>
): Record<string, string> {
  const formatted: Record<string, string> = {};
  Object.entries(errors).forEach(([field, messages]) => {
    formatted[field] = messages[0]; // Take the first error message for each field
  });
  return formatted;
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  ACCESS_DENIED: 'ACCESS_DENIED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
