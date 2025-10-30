export interface IUser {
  username: string;
}

export interface UserInfo {
  _id: string;
  userName: string;
  userEmail: string;
  userBirthDay?: string;
  userAddress?: string;
  image?: string;
  accountId?: string;
  roles?: Array<{ roleName: string; roleCode: number }>;
  createdAt?: string;
  updatedAt?: string;
}

// Alias cho compatibility
export type User = UserInfo;

export interface UserPayload {
  userName?: string;
  userEmail?: string;
  userBirthDay?: string;
  userAddress?: string;
  image?: string;
}

// Alias cho backward compatibility
export type CreateUserPayload = UserPayload;
export type UpdateUserPayload = UserPayload;

export interface UserData {
  account: string;
  password: string;
  userName: string;
  userEmail: string;
  roles?: string | number;
  phone?: string;
  address?: string;
  country?: string;
  image?: string;
}

export interface UserResponse {
  user?: UserInfo;
}

export interface UsersArrayResponse {
  users: UserInfo[];
}

export interface UserDataResponse {
  data: {
    user?: UserInfo;
    users?: UserInfo[];
  };
}
