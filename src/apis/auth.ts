import axios, { AxiosError } from 'axios';

import type { RoleInfo } from '@/types/common';

export type { RoleInfo };

interface UserData {
  account: string;
  password: string;
  userName: string;
  userEmail: string;
  roles?: string | number;
  phone?: string;
  address?: string;
  country?: string;
  img?: string;
}

interface Credentials {
  account: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: Record<string, unknown>;
  token?: string;
  userInfo?: JwtPayload;
}

export interface JwtPayload {
  id: string;
  idAccount: string;
  account?: string;
  roles: string[];
  exp?: number;
  iat?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
const AUTH_ENDPOINT = `${API_BASE_URL}/API/account`;

const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('authToken', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  }
};

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
  delete axios.defaults.headers.common['Authorization'];
};

const register = async (userData: UserData): Promise<AuthResponse> => {
  const dataWithDefaultRole = {
    ...userData,
    roles: userData.roles ?? 1,
  };
  try {
    const response = await axios.post(
      `${AUTH_ENDPOINT}/register`,
      dataWithDefaultRole,
    );
    return {
      success: true,
      data: response.data,
      message: 'Đăng ký thành công',
    };
  } catch (error) {
    const axiosError = error as AxiosError<Record<string, unknown>>;
    return {
      success: false,
      message:
        ((axiosError.response?.data as Record<string, unknown>)
          ?.message as string) || 'Đăng ký thất bại',
      error: axiosError.response?.data,
    };
  }
};

const signin = async (credentials: Credentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${AUTH_ENDPOINT}/sigin`, credentials);

    if (response.data.token) {
      setAuthToken(response.data.token);

      return {
        success: true,
        data: response.data,
        token: response.data.token,
        message: response.data.message || 'Đăng nhập thành công',
      };
    }

    return {
      success: false,
      message: 'Không nhận được token',
    };
  } catch (error) {
    const axiosError = error as AxiosError<Record<string, unknown>>;
    return {
      success: false,
      message:
        ((axiosError.response?.data as Record<string, unknown>)
          ?.message as string) || 'Đăng nhập thất bại',
      error: axiosError.response?.data,
    };
  }
};

const logout = (): AuthResponse => {
  removeAuthToken();
  return {
    success: true,
    message: 'Đăng xuất thành công',
  };
};

const verifyToken = async (): Promise<AuthResponse> => {
  try {
    const token = getAuthToken();
    if (!token) {
      return {
        success: false,
        message: 'Không tìm thấy token',
      };
    }

    const response = await axios.get(`${AUTH_ENDPOINT}/test`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
      message: 'Token hợp lệ',
    };
  } catch (error) {
    const axiosError = error as AxiosError<Record<string, unknown>>;
    if (axiosError.response?.status === 401) {
      removeAuthToken();
    }

    return {
      success: false,
      message:
        ((axiosError.response?.data as Record<string, unknown>)
          ?.message as string) || 'Token không hợp lệ',
      error: axiosError.response?.data,
    };
  }
};

const isTokenExpired = (): boolean => {
  const token = getAuthToken();
  if (!token) return true;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    const decoded = JSON.parse(jsonPayload) as JwtPayload;
    if (!decoded.exp) return true;

    const currentTime = Date.now() / 1000;
    return (decoded.exp as number) < currentTime;
  } catch {
    return true;
  }
};

const getCurrentUser = (): JwtPayload | null => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
};

const authService = {
  register,
  signin,
  logout,
  verifyToken,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  isTokenExpired,
  getCurrentUser,
};

export default authService;

export {
  register,
  signin,
  logout,
  verifyToken,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  isTokenExpired,
  getCurrentUser,
};
