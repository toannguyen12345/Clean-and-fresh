import { AxiosError } from 'axios';

export const handleApiError = (
  error: unknown,
  defaultMessage: string,
): { message: string; error?: Record<string, unknown> } => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    return {
      message: (data?.message as string) || defaultMessage,
      error: error.response?.data,
    };
  }
  return {
    message: defaultMessage,
    error: undefined,
  };
};
