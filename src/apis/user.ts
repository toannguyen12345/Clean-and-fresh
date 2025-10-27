import { AxiosError } from 'axios';

import axiosInstance from '@/lib/axios';
import type { RoleInfo } from '@/types/common';
import type {
  UserInfo,
  CreateUserPayload,
  UpdateUserPayload,
} from '@/types/user';
import type { ApiResponse, ListApiResponse } from '@/types/api';
import { buildUserFormData } from '@/utils/userHelpers';

export type { RoleInfo, UserInfo, CreateUserPayload, UpdateUserPayload };

type UserResponse = ApiResponse<UserInfo | UserInfo[]>;
type ListUsersResponse = ListApiResponse<UserInfo[]>;

const API_BASE_URL = import.meta.env.VITE_API_URL;
const USER_ENDPOINT = `${API_BASE_URL}/API/user`;

// Utility function to handle API errors
const handleApiError = (
  error: unknown,
  defaultMessage: string,
): { message: string; error?: Record<string, unknown> } => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    return {
      message: (data?.message as string) || defaultMessage,
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
    const response = await axiosInstance.get(`${USER_ENDPOINT}/list`);
    return {
      success: true,
      message: 'Lấy danh sách users thành công',
      users: response.data.users || [],
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
    const response = await axiosInstance.get(
      `${USER_ENDPOINT}/findByID/${userId}`,
    );
    return {
      success: true,
      message: 'Lấy thông tin user thành công',
      data: response.data.user,
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
    const response = await axiosInstance.get(
      `${USER_ENDPOINT}/findByName/${encodeURIComponent(name)}`,
    );
    return {
      success: true,
      message: `Tìm users với tên "${name}" thành công`,
      users: response.data.users || [],
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
    const formData = buildUserFormData(userData, imageFile);

    const response = await axiosInstance.post(
      `${USER_ENDPOINT}/create`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return {
      success: true,
      message: 'Tạo user thành công',
      data: response.data.user,
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
    const response = await axiosInstance.put(
      `${USER_ENDPOINT}/updateByID/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return {
      success: true,
      message: 'Cập nhật user thành công',
      data: response.data.user,
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
    const response = await axiosInstance.delete(
      `${USER_ENDPOINT}/delete/${userId}`,
    );
    return {
      success: true,
      message: response.data.message || 'Xóa user thành công',
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

const getMe = async (): Promise<UserResponse> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = (await axiosInstance.get(`${USER_ENDPOINT}/me`)) as any;
    return {
      success: true,
      message: 'Lấy thông tin user hiện tại thành công',
      data: response.user || response.data?.user,
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
