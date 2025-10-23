/**
 * Authentication Service cho Frontend
 * Base URL: http://localhost:8888/API/account
 *
 * Các chức năng:
 * - Đăng ký tài khoản (register)
 * - Đăng nhập (signin)
 * - Xác thực token (verify)
 * - Kiểm tra quyền user
 * - Kiểm tra quyền admin
 * - Kiểm tra quyền shipper
 */

import axios, { AxiosError } from 'axios';

// Type definitions
export type RoleType = 'user' | 'admin' | 'shipper';
export type RoleCode = 1 | 2 | 3;

export interface RoleInfo {
  roleName: RoleType;
  roleCode: RoleCode;
}

interface UserData {
  account: string;
  password: string;
  userName: string;
  userEmail: string;
  roles?: string | number; // Chấp nhận cả string ("user"/"admin"/"shipper") hoặc number (1/2/3)
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
  id: string; // User ID
  idAccount: string; // Account ID
  account?: string; // Account name/username
  roles: string[]; // Array of role names
  exp?: number;
  iat?: number;
}

// Base URL của API - Thay đổi theo môi trường của bạn
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
const AUTH_ENDPOINT = `${API_BASE_URL}/API/account`;

/**
 * Lưu token vào localStorage
 * @param {string} token - JWT token
 */
const setAuthToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('authToken', token);
    // Set default header cho tất cả request
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
  }
};

/**
 * Lấy token từ localStorage
 * @returns {string|null} token
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

/**
 * Xóa token khỏi localStorage
 */
const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
  delete axios.defaults.headers.common['Authorization'];
};

/**
 * Đăng ký tài khoản mới
 * @param {Object} userData - Thông tin đăng ký
 * @param {string} userData.account - Tên tài khoản
 * @param {string} userData.password - Mật khẩu
 * @param {string} userData.userName - Tên người dùng
 * @param {string} userData.userEmail - Email người dùng
 * @param {string|number} [userData.roles] - Role: "user"/"admin"/"shipper" hoặc 1/2/3 (mặc định: "user")
 * @param {string} [userData.phone] - Số điện thoại
 * @param {string} [userData.address] - Địa chỉ
 * @param {string} [userData.country] - Quốc gia
 * @param {string} [userData.img] - URL ảnh đại diện
 * @returns {Promise<AuthResponse>} Response data
 */
const register = async (userData: UserData): Promise<AuthResponse> => {
  // Set default role to 1 (user) if not provided
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

/**
 * Đăng nhập
 * @param {Object} credentials - Thông tin đăng nhập
 * @param {string} credentials.account - Tên tài khoản
 * @param {string} credentials.password - Mật khẩu
 * @returns {Promise<Object>} Response data với token
 */
const signin = async (credentials: Credentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${AUTH_ENDPOINT}/sigin`, credentials);

    if (response.data.token) {
      // Lưu token vào localStorage
      setAuthToken(response.data.token);

      // Decode token để lấy thông tin user (optional)
      const tokenData = parseJwt(response.data.token);

      return {
        success: true,
        data: response.data,
        token: response.data.token,
        userInfo: tokenData || undefined,
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

/**
 * Đăng xuất
 */
const logout = (): AuthResponse => {
  removeAuthToken();
  return {
    success: true,
    message: 'Đăng xuất thành công',
  };
};

/**
 * Kiểm tra token có hợp lệ không (test endpoint)
 * @returns {Promise<Object>} Response data
 */
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
    // Nếu token hết hạn hoặc không hợp lệ, xóa token
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

/**
 * Parse JWT token để lấy payload
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded token payload
 */
const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
};

/**
 * Kiểm tra token có hết hạn chưa
 * @returns {boolean} true nếu token hết hạn
 */
const isTokenExpired = (): boolean => {
  const token = getAuthToken();
  if (!token) return true;

  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;

  // exp là timestamp tính bằng giây
  const currentTime = Date.now() / 1000;
  return (decoded.exp as number) < currentTime;
};

/**
 * Lấy thông tin user từ token
 * @returns {Object|null} User info
 */
const getCurrentUser = (): JwtPayload | null => {
  const token = getAuthToken();
  if (!token) return null;

  const decoded = parseJwt(token);
  return decoded;
};

/**
 * Kiểm tra user có role cụ thể không
 * @param {string} role - Role cần kiểm tra (user/admin/shipper)
 * @returns {boolean} true nếu user có role đó
 */
const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  if (!user || !user.roles) return false;

  return user.roles.includes(role);
};

/**
 * Kiểm tra user có phải admin không
 * @returns {boolean} true nếu user là admin
 */
const isAdmin = (): boolean => {
  return hasRole('admin');
};

/**
 * Kiểm tra user có phải shipper không
 * @returns {boolean} true nếu user là shipper
 */
const isShipper = (): boolean => {
  return hasRole('shipper');
};

/**
 * Kiểm tra user có phải user thông thường không
 * @returns {boolean} true nếu user là user
 */
const isUser = (): boolean => {
  return hasRole('user');
};

/**
 * Lấy role đầu tiên của user
 * @returns {string|null}
 */
const getPrimaryRole = (): string | null => {
  const user = getCurrentUser();
  if (!user || !user.roles || user.roles.length === 0) return null;
  return user.roles[0];
};

const authService = {
  register,
  signin,
  logout,
  verifyToken,

  hasRole,
  isAdmin,
  isShipper,
  isUser,
  getPrimaryRole,

  setAuthToken,
  getAuthToken,
  removeAuthToken,
  isTokenExpired,

  getCurrentUser,
  parseJwt,
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
  parseJwt,
  hasRole,
  isAdmin,
  isShipper,
  isUser,
  getPrimaryRole,
};
