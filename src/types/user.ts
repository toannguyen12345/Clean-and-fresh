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
  IMG?: string;
  accountId?: string;
  roles?: Array<{ roleName: string; roleCode: number }>;
  createdAt?: string;
  updatedAt?: string;
}

// Alias cho compatibility
export type User = UserInfo;

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

export interface UserData {
  account: string;
  password: string;
  userName: string;
  userEmail: string;
  roles?: string | number;
  phone?: string;
  address?: string;
  country?: string;
  IMG?: string;
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
