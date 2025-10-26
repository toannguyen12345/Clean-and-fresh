import type { UserInfo } from '@/types/user';

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
