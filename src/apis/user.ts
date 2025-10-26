import { AxiosError } from 'axios';

import axiosInstance from '@/lib/axios';
import type { RoleInfo } from '@/types/common';
import type {
  UserInfo,
  CreateUserPayload,
  UpdateUserPayload,
} from '@/types/user';

export type { RoleInfo, UserInfo, CreateUserPayload, UpdateUserPayload };

interface UserResponse {
  success: boolean;
  message: string;
  data?: UserInfo | UserInfo[];
  error?: Record<string, unknown>;
}

interface ListUsersResponse {
  success: boolean;
  message: string;
  users?: UserInfo[];
  error?: Record<string, unknown>;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888';
const USER_ENDPOINT = `${API_BASE_URL}/API/user`;

// Utility function to handle API errors
const handleApiError = (
  error: unknown,
  defaultMessage: string,
): { message: string; error?: Record<string, unknown> } => {
  if (error instanceof AxiosError) {
    return {
      message:
        ((error.response?.data as Record<string, unknown>)
          ?.message as string) || defaultMessage,
      error: error.response?.data,
    };
  }
  return {
    message: defaultMessage,
    error: undefined,
  };
};

const listUsers = async (): Promise<ListUsersResponse> => {
  try {
    const response = (await axiosInstance.get(
      `${USER_ENDPOINT}/list`,
    )) as Record<string, unknown>;
    return {
      success: true,
      message: 'Lấy danh sách users thành công',
      users: (response.users as UserInfo[]) || [],
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Lấy danh sách users thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

const getUserById = async (userId: string): Promise<UserResponse> => {
  try {
    const response = (await axiosInstance.get(
      `${USER_ENDPOINT}/findByID/${userId}`,
    )) as Record<string, unknown>;
    return {
      success: true,
      message: 'Lấy thông tin user thành công',
      data: response.user as UserInfo | undefined,
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Lấy thông tin user thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

const searchUserByName = async (name: string): Promise<ListUsersResponse> => {
  try {
    const response = (await axiosInstance.get(
      `${USER_ENDPOINT}/findByName/${encodeURIComponent(name)}`,
    )) as Record<string, unknown>;
    return {
      success: true,
      message: `Tìm users với tên "${name}" thành công`,
      users: (response.users as UserInfo[]) || [],
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Tìm user thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

const createUser = async (
  userData: CreateUserPayload,
  imageFile?: File,
): Promise<UserResponse> => {
  try {
    const formData = new FormData();
    if (userData.userName) {
      formData.append('userName', userData.userName);
    }
    if (userData.userEmail) {
      formData.append('userEmail', userData.userEmail);
    }

    if (userData.userBirthDay) {
      formData.append('userBirthDay', userData.userBirthDay);
    }
    if (userData.userAddress) {
      formData.append('userAddress', userData.userAddress);
    }
    if (imageFile) {
      formData.append('IMG', imageFile);
    }

    const response = (await axiosInstance.post(
      `${USER_ENDPOINT}/create`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )) as Record<string, unknown>;

    return {
      success: true,
      message: 'Tạo user thành công',
      data: response.user as UserInfo | undefined,
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Tạo user thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

const updateUser = async (
  userId: string,
  formData: FormData,
): Promise<UserResponse> => {
  try {
    const response = (await axiosInstance.put(
      `${USER_ENDPOINT}/updateByID/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )) as Record<string, unknown>;

    return {
      success: true,
      message: 'Cập nhật user thành công',
      data: response.user as UserInfo | undefined,
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Cập nhật user thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

const deleteUser = async (userId: string): Promise<UserResponse> => {
  try {
    const response = (await axiosInstance.delete(
      `${USER_ENDPOINT}/delete/${userId}`,
    )) as Record<string, unknown>;
    return {
      success: true,
      message: (response.message as string) || 'Xóa user thành công',
      data: undefined,
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Xóa user thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

/**
 * Lấy thông tin user hiện tại từ token
 * Decode token và trả về data user
 */
const getMe = async (): Promise<UserResponse> => {
  try {
    const response = (await axiosInstance.get(`${USER_ENDPOINT}/me`)) as Record<
      string,
      unknown
    >;
    return {
      success: true,
      message: 'Lấy thông tin user hiện tại thành công',
      data: response.user as UserInfo | undefined,
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Lấy thông tin user thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

const userService = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUserByName,
  getMe,
};

export default userService;

export {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUserByName,
  getMe,
};
