import axiosInstance from '@/lib/axios';

export const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('authToken', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
  delete axiosInstance.defaults.headers.common['Authorization'];
};

export const hasAuthToken = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token =
    localStorage.getItem('token') || localStorage.getItem('authToken');
  return !!token;
};

export const isLoggedIn = (): boolean => {
  return hasAuthToken();
};
