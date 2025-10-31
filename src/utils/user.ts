import type { EditUserFormData } from '@/schemas/account';
import type {
  UserInfo,
  CreateUserPayload,
  UserResponse,
  UsersArrayResponse,
  UserDataResponse,
} from '@/types/user';

export const formatUserAddress = (address: string): string => {
  return address || 'Chưa có địa chỉ';
};

export const formatUserName = (name: string): string => {
  return name || 'Khách hàng';
};

const hasUserKey = (obj: object): obj is { user: unknown } => {
  return 'user' in obj;
};

export const isUserResponse = (data: unknown): data is UserResponse => {
  return (
    data !== null &&
    typeof data === 'object' &&
    hasUserKey(data) &&
    (data.user === undefined ||
      (typeof data.user === 'object' && data.user !== null))
  );
};

const hasUsersKey = (obj: object): obj is { users: unknown } => {
  return 'users' in obj;
};

export const isUsersArrayResponse = (
  data: unknown,
): data is UsersArrayResponse => {
  return (
    data !== null &&
    typeof data === 'object' &&
    hasUsersKey(data) &&
    Array.isArray(data.users)
  );
};

const hasDataKey = (obj: object): obj is { data: unknown } => {
  return 'data' in obj;
};

export const isUserDataResponse = (data: unknown): data is UserDataResponse => {
  return (
    data !== null &&
    typeof data === 'object' &&
    hasDataKey(data) &&
    typeof data.data === 'object' &&
    data.data !== null
  );
};

export const isUserInfo = (data: unknown): data is UserInfo => {
  return (
    data !== null &&
    typeof data === 'object' &&
    '_id' in data &&
    'roles' in data
  );
};

export const filterUsersByRole = (
  roleName: string,
  users: UserInfo[],
): UserInfo[] => {
  return users.filter((user) => {
    if (!user.roles || user.roles.length === 0) return false;
    return user.roles.some((role) => role.roleName === roleName);
  });
};

export const filterUsersByRoleCode = (
  roleCode: number,
  users: UserInfo[],
): UserInfo[] => {
  return users.filter((user) => {
    if (!user.roles || user.roles.length === 0) return false;
    return user.roles.some((role) => role.roleCode === roleCode);
  });
};

export const getUserPrimaryRole = (user: UserInfo): string | null => {
  if (!user.roles || user.roles.length === 0) return null;
  return user.roles[0].roleName;
};

export const userHasRole = (user: UserInfo, roleName: string): boolean => {
  if (!user.roles || user.roles.length === 0) return false;
  return user.roles.some((role) => role.roleName === roleName);
};

export const sortUsersByName = (
  users: UserInfo[],
  ascending: boolean = true,
): UserInfo[] => {
  return [...users].sort((a, b) => {
    const comparison = a.userName.localeCompare(b.userName);
    return ascending ? comparison : -comparison;
  });
};

export const sortUsersByEmail = (
  users: UserInfo[],
  ascending: boolean = true,
): UserInfo[] => {
  return [...users].sort((a, b) => {
    const comparison = (a.userEmail || '').localeCompare(b.userEmail || '');
    return ascending ? comparison : -comparison;
  });
};

export const paginateUsers = (
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

export const findUserByEmail = (
  email: string,
  users: UserInfo[],
): UserInfo | null => {
  return users.find((user) => user.userEmail === email) || null;
};

export const isEmailExists = (email: string, users: UserInfo[]): boolean => {
  return users.some((user) => user.userEmail === email);
};

export const buildUserFormData = (
  userData: EditUserFormData | CreateUserPayload,
  imageFile?: File,
): FormData => {
  const formData = new FormData();

  if (userData.userName) {
    formData.append('userName', userData.userName);
  }
  if ('userEmail' in userData && userData.userEmail) {
    formData.append('userEmail', userData.userEmail);
  }
  if ('userBirthDay' in userData && userData.userBirthDay) {
    formData.append('userBirthDay', userData.userBirthDay);
  }
  if ('userAddress' in userData && userData.userAddress) {
    formData.append('userAddress', userData.userAddress);
  }

  if (imageFile) {
    formData.append('IMG', imageFile);
  }

  return formData;
};
