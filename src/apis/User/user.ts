import axios, { AxiosError } from 'axios';

export interface RoleInfo {
  roleName: string;
  roleCode: number;
}

export interface UserInfo {
  _id: string;
  userName: string;
  userEmail: string;
  userBirthDay?: string;
  userAddress?: string;
  IMG?: string;
  accountId?: string;
  roles?: RoleInfo[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserPayload {
  userName: string;
  userEmail: string;
  userBirthDay?: string;
  userAddress?: string;
  IMG?: string;
}

export interface UpdateUserPayload {
  userName?: string;
  userEmail?: string;
  userBirthDay?: string;
  userAddress?: string;
  IMG?: string;
}

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

const listUsers = async (): Promise<ListUsersResponse> => {
  try {
    const response = await axios.get(`${USER_ENDPOINT}/list`);
    return {
      success: true,
      message: 'Lấy danh sách users thành công',
      users: response.data.users || [],
    };
  } catch (error) {
    const axiosError = error as AxiosError<Record<string, unknown>>;
    return {
      success: false,
      message:
        ((axiosError.response?.data as Record<string, unknown>)
          ?.message as string) || 'Lấy danh sách users thất bại',
      error: axiosError.response?.data,
    };
  }
};

const getUserById = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await axios.get(`${USER_ENDPOINT}/findByID/${userId}`);
    return {
      success: true,
      message: 'Lấy thông tin user thành công',
      data: response.data.user,
    };
  } catch (error) {
    const axiosError = error as AxiosError<Record<string, unknown>>;
    return {
      success: false,
      message:
        ((axiosError.response?.data as Record<string, unknown>)
          ?.message as string) || 'Lấy thông tin user thất bại',
      error: axiosError.response?.data,
    };
  }
};

const searchUserByName = async (name: string): Promise<ListUsersResponse> => {
  try {
    const response = await axios.get(
      `${USER_ENDPOINT}/findByName/${encodeURIComponent(name)}`,
    );
    return {
      success: true,
      message: `Tìm users với tên "${name}" thành công`,
      users: response.data.users || [],
    };
  } catch (error) {
    const axiosError = error as AxiosError<Record<string, unknown>>;
    return {
      success: false,
      message:
        ((axiosError.response?.data as Record<string, unknown>)
          ?.message as string) || 'Tìm user thất bại',
      error: axiosError.response?.data,
    };
  }
};

const createUser = async (
  userData: CreateUserPayload,
  imageFile?: File,
): Promise<UserResponse> => {
  try {
    const formData = new FormData();
    formData.append('userName', userData.userName);
    formData.append('userEmail', userData.userEmail);

    if (userData.userBirthDay) {
      formData.append('userBirthDay', userData.userBirthDay);
    }
    if (userData.userAddress) {
      formData.append('userAddress', userData.userAddress);
    }
    if (imageFile) {
      formData.append('IMG', imageFile);
    }

    const response = await axios.post(`${USER_ENDPOINT}/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      message: 'Tạo user thành công',
      data: response.data.user,
    };
  } catch (error) {
    const axiosError = error as AxiosError<Record<string, unknown>>;
    return {
      success: false,
      message:
        ((axiosError.response?.data as Record<string, unknown>)
          ?.message as string) || 'Tạo user thất bại',
      error: axiosError.response?.data,
    };
  }
};

const updateUser = async (
  userId: string,
  updates: UpdateUserPayload,
  imageFile?: File,
): Promise<UserResponse> => {
  try {
    const formData = new FormData();

    formData.append('userName', updates.userName || '');
    formData.append('userEmail', updates.userEmail || '');
    formData.append('userBirthDay', updates.userBirthDay || '');
    formData.append('userAddress', updates.userAddress || '');

    if (imageFile) {
      formData.append('IMG', imageFile);
    }

    const response = await axios.put(
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
    const axiosError = error as AxiosError<Record<string, unknown>>;
    return {
      success: false,
      message:
        ((axiosError.response?.data as Record<string, unknown>)
          ?.message as string) || 'Cập nhật user thất bại',
      error: axiosError.response?.data,
    };
  }
};

const deleteUser = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await axios.delete(`${USER_ENDPOINT}/delete/${userId}`);
    return {
      success: true,
      message: response.data.message || 'Xóa user thành công',
      data: undefined,
    };
  } catch (error) {
    const axiosError = error as AxiosError<Record<string, unknown>>;
    return {
      success: false,
      message:
        ((axiosError.response?.data as Record<string, unknown>)
          ?.message as string) || 'Xóa user thất bại',
      error: axiosError.response?.data,
    };
  }
};

const filterUsersByRole = (roleName: string, users: UserInfo[]): UserInfo[] => {
  return users.filter((user) => {
    if (!user.roles || user.roles.length === 0) return false;
    return user.roles.some((role) => role.roleName === roleName);
  });
};

const filterUsersByRoleCode = (
  roleCode: number,
  users: UserInfo[],
): UserInfo[] => {
  return users.filter((user) => {
    if (!user.roles || user.roles.length === 0) return false;
    return user.roles.some((role) => role.roleCode === roleCode);
  });
};

const getUserPrimaryRole = (user: UserInfo): string | null => {
  if (!user.roles || user.roles.length === 0) return null;
  return user.roles[0].roleName;
};

const userHasRole = (user: UserInfo, roleName: string): boolean => {
  if (!user.roles || user.roles.length === 0) return false;
  return user.roles.some((role) => role.roleName === roleName);
};

const sortUsersByName = (
  users: UserInfo[],
  ascending: boolean = true,
): UserInfo[] => {
  return [...users].sort((a, b) => {
    const comparison = a.userName.localeCompare(b.userName);
    return ascending ? comparison : -comparison;
  });
};

const sortUsersByEmail = (
  users: UserInfo[],
  ascending: boolean = true,
): UserInfo[] => {
  return [...users].sort((a, b) => {
    const comparison = (a.userEmail || '').localeCompare(b.userEmail || '');
    return ascending ? comparison : -comparison;
  });
};

const paginateUsers = (
  users: UserInfo[],
  page: number = 1,
  pageSize: number = 10,
) => {
  const totalUsers = users.length;
  const totalPages = Math.ceil(totalUsers / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return {
    data: paginatedUsers,
    pagination: {
      currentPage: page,
      pageSize,
      totalUsers,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const findUserByEmail = (email: string, users: UserInfo[]): UserInfo | null => {
  return users.find((user) => user.userEmail === email) || null;
};

const isEmailExists = (email: string, users: UserInfo[]): boolean => {
  return users.some((user) => user.userEmail === email);
};

const userService = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUserByName,
  filterUsersByRole,
  filterUsersByRoleCode,
  findUserByEmail,
  isEmailExists,
  getUserPrimaryRole,
  userHasRole,
  sortUsersByName,
  sortUsersByEmail,
  paginateUsers,
};

export default userService;

export {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUserByName,
  filterUsersByRole,
  filterUsersByRoleCode,
  findUserByEmail,
  isEmailExists,
  getUserPrimaryRole,
  userHasRole,
  sortUsersByName,
  sortUsersByEmail,
  paginateUsers,
};
