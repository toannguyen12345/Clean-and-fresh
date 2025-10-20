export interface User {
  _id?: string;
  userName: string;
  userAddress: string;
  userEmail?: string;
  userPhone?: string;
}

export const formatUserAddress = (address: string): string => {
  return address || 'Chưa có địa chỉ';
};

export const formatUserName = (name: string): string => {
  return name || 'Khách hàng';
};
