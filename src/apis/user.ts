import axiosInstance from '@/lib/axios';
import type { RoleInfo } from '@/types/common';
import type {
  UserInfo,
  CreateUserPayload,
  UpdateUserPayload,
} from '@/types/user';
import type { ApiResponse, ListApiResponse } from '@/types/api';
import {
  buildUserFormData,
  isUserInfo,
  isUserResponse,
  isUsersArrayResponse,
  isUserDataResponse,
} from '@/utils/user';
import { handleApiError } from '@/utils/api';

export type { RoleInfo, UserInfo, CreateUserPayload, UpdateUserPayload };

type UserResponse = ApiResponse<UserInfo>;
type ListUsersResponse = ListApiResponse<UserInfo[]>;

const listUsers = async (): Promise<ListUsersResponse> => {
  try {
    const response = await axiosInstance.get('/API/user/list');
    const users = isUsersArrayResponse(response) ? response.users : [];

    return {
      success: true,
      message: 'Lấy danh sách users thành công',
      users,
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
    const response = await axiosInstance.get(`/API/user/findByID/${userId}`);
    const user = isUserResponse(response) ? response.user : undefined;
    return {
      success: true,
      message: 'Lấy thông tin user thành công',
      data: user,
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
      `/API/user/findByName/${encodeURIComponent(name)}`,
    );
    const users = isUserDataResponse(response) ? response.data.users || [] : [];
    return {
      success: true,
      message: `Tìm users với tên "${name}" thành công`,
      users,
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
    const response = await axiosInstance.post('/API/user/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    const user = isUserDataResponse(response) ? response.data.user : undefined;
    return {
      success: true,
      message: 'Tạo user thành công',
      data: user,
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
      `/API/user/updateByID/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    const user = isUserDataResponse(response) ? response.data.user : undefined;
    return {
      success: true,
      message: 'Cập nhật user thành công',
      data: user,
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
    await axiosInstance.delete(`/API/user/delete/${userId}`);
    return {
      success: true,
      message: 'Xóa user thành công',
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
    const response = await axiosInstance.get('/API/user/me');

    if (response && typeof response === 'object') {
      const userData = 'user' in response ? response.user : response;

      if (userData && isUserInfo(userData)) {
        return {
          success: true,
          message: 'Lấy thông tin user hiện tại thành công',
          data: userData,
        };
      }
    }

    return {
      success: true,
      message: 'Lấy thông tin user hiện tại thành công',
      data: undefined,
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
