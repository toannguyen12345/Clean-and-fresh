export interface Credentials {
  account: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  error?: Record<string, unknown>;
  token?: string;
  userInfo?: JwtPayload;
}

export interface JwtPayload {
  id: string;
  idAccount: string;
  account?: string;
  roles: string[];
  exp?: number;
  iat?: number;
}
