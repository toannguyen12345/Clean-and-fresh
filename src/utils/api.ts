import { AxiosError } from 'axios';

export const handleApiError = (
  error: unknown,
  defaultMessage: string,
): { message: string; error?: Record<string, unknown> } => {
  if (error instanceof AxiosError) {
    const data: Record<string, unknown> | undefined = error.response?.data;
    const message: string = (data?.message as string) || defaultMessage;
    return {
      message,
      error: error.response?.data,
    };
  }
  return {
    message: defaultMessage,
    error: undefined,
  };
};
