/**
 * Generic API Response Types
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: Record<string, unknown>;
}

export interface ListApiResponse<T> {
  success: boolean;
  message: string;
  users?: T;
  error?: Record<string, unknown>;
}
