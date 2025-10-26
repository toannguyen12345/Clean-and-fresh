import axios, { AxiosError, AxiosResponse } from 'axios';

import type { IResponseErrorAxios } from '@/types';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response: AxiosResponse<any>) => {
    return response.data;
  },
  (error: AxiosError<IResponseErrorAxios>) => {
    return Promise.reject(error.response?.data.errors);
  },
);

export default axiosInstance;
