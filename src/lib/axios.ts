import axios, { AxiosError, AxiosResponse } from 'axios';

import { STATUS_HTTP_CODE } from '@/constants';
import { IResponseErrorAxios } from '@/types';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  // Add more config before request
  return config;
});

axiosInstance.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response: AxiosResponse<any>) => {
    // Handle response
    return response.data;
  },
  (error: AxiosError<IResponseErrorAxios>) => {
    if (error.response) {
      switch (error.response.status) {
        case STATUS_HTTP_CODE.BAD_REQUEST:
          console.error('Bad request');
          break;
        case STATUS_HTTP_CODE.UNAUTHORIZED:
          console.error('Unauthorized access - redirecting to login');
          break;
        case STATUS_HTTP_CODE.FORBIDDEN:
          console.error('Forbidden access');
          break;
        case STATUS_HTTP_CODE.NOT_FOUND:
          console.error('Resource not found');
          break;
        case STATUS_HTTP_CODE.INTERNAL_SERVER:
          console.error('Internal server error');
          break;
        default:
          console.error('An error occurred:', error.response.status);
      }
    } else if (error.request) {
      // Handle request sent but not response
      console.error('No response received:', error.request);
    }

    return Promise.reject(error.response?.data.errors);
  },
);

export default axiosInstance;
