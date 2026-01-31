import { toast } from 'sonner';

export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    errors?: Record<string, string[]>;
  } | null;
}

export class ApiError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export function handleApiError(error: unknown): never {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = error as Record<string, any>;

  // Handle API error response
  if (err.response?.data) {
    const apiError = err.response.data as ApiErrorResponse;

    // Extract validation errors if present
    const validationErrors = apiError.data?.errors;

    throw new ApiError(
      apiError.message || 'An error occurred',
      apiError.statusCode || 500,
      validationErrors
    );
  }

  // Handle network errors
  if (err.request) {
    throw new ApiError('Network error. Please check your internet connection.', 0);
  }

  // Handle other errors
  throw new ApiError(
    (err instanceof Error ? err.message : String(err)) || 'An unexpected error occurred',
    500
  );
}

export function showErrorToast(error: unknown, fallbackMessage = 'An error occurred') {
  if (error instanceof ApiError) {
    // Show validation errors if present
    if (error.errors) {
      const firstError = Object.values(error.errors)[0]?.[0];
      toast.error(firstError || error.message);

      // Optionally show all validation errors
      Object.entries(error.errors).forEach(([field, messages]) => {
        messages.forEach((msg) => {
          toast.error(`${field}: ${msg}`);
        });
      });
    } else {
      toast.error(error.message);
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error(fallbackMessage);
  }
}

export function getErrorMessage(error: unknown, fallbackMessage = 'An error occurred'): string {
  if (error instanceof ApiError) {
    if (error.errors) {
      const firstError = Object.values(error.errors)[0]?.[0];
      return firstError || error.message;
    }
    return error.message;
  } else if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
}
