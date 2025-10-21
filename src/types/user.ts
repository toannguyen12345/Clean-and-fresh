export interface IUser {
  username: string;
}

export interface User extends Record<string, unknown> {
  _id: string;
  userName: string;
  userBirthDay: string;
  userEmail: string;
  userAddress: string;
  IMG?: string;
}
