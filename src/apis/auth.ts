import { AxiosError } from 'axios';

import axiosInstance from '@/lib/axios';
import type { RoleInfo } from '@/types/common';
import type { UserData } from '@/types/user';
import type { Credentials, AuthResponse, JwtPayload } from '@/types/auth';

export type { RoleInfo, Credentials, AuthResponse, JwtPayload };

const AUTH_ENDPOINT = 'API/account';

const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('authToken', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
  delete axiosInstance.defaults.headers.common['Authorization'];
};

const register = async (userData: UserData): Promise<AuthResponse> => {
  const dataWithDefaultRole = {
    ...userData,
    roles: userData.roles ?? 1,
  };
  try {
    const response = (await axiosInstance.post(
      `${AUTH_ENDPOINT}/register`,
      dataWithDefaultRole,
    )) as Record<string, unknown>;
    return {
      success: true,
      data: response,
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
    const response = (await axiosInstance.post(
      `${AUTH_ENDPOINT}/sigin`,
      credentials,
    )) as Record<string, unknown>;

    if (response.token) {
      setAuthToken(response.token as string);

      return {
        success: true,
        data: response,
        token: response.token as string,
        message: (response.message as string) || 'Đăng nhập thành công',
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

    const response = (await axiosInstance.get(`${AUTH_ENDPOINT}/test`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })) as Record<string, unknown>;

    return {
      success: true,
      data: response,
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

const authService = {
  register,
  signin,
  logout,
  verifyToken,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
};

export default authService;
