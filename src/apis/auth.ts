import axiosInstance from '@/lib/axios';
import type { RoleInfo } from '@/types/common';
import type { UserData } from '@/types/user';
import type { Credentials, AuthResponse, JwtPayload } from '@/types/auth';
import { setAuthToken, getAuthToken, removeAuthToken } from '@/utils/auth';

export type { RoleInfo, Credentials, AuthResponse, JwtPayload };

const AUTH_ENDPOINT = 'API/account';

const register = async (userData: UserData): Promise<AuthResponse> => {
  const dataWithDefaultRole = {
    ...userData,
    roles: userData.roles ?? 1,
  };
  try {
    const response = await axiosInstance.post(
      `${AUTH_ENDPOINT}/register`,
      dataWithDefaultRole,
    );
    return {
      success: true,
      data: response.data,
      message: 'Đăng ký thành công',
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

const signin = async (credentials: Credentials): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post(
      `${AUTH_ENDPOINT}/sigin`,
      credentials,
    );

    if (
      response &&
      typeof response === 'object' &&
      'token' in response &&
      'message' in response
    ) {
      const token = response.token;
      const message = response.message;

      if (typeof token === 'string') {
        setAuthToken(token);

        return {
          success: true,
          token,
          message:
            typeof message === 'string' ? message : 'Đăng nhập thành công',
        };
      }
    }

    return {
      success: false,
      message: 'Không nhận được token',
    };
  } catch (error) {
    return Promise.reject(error);
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

    const response = await axiosInstance.get(`${AUTH_ENDPOINT}/test`, {
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
    return Promise.reject(error);
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
