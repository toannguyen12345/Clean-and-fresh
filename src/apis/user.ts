import { API_ROUTES } from '@/constants';
import { axiosInstance } from '@/lib';
import { IResponseSuccessList, IUser } from '@/types';

// Example for single data
const createUser = async (): Promise<IUser> => {
  try {
    return await axiosInstance.post(API_ROUTES.USER);
  } catch (error) {
    return Promise.reject(error);
  }
};

// Example for list data
const getUsers = async (): Promise<IResponseSuccessList<IUser>> => {
  try {
    return await axiosInstance.get(API_ROUTES.USER);
  } catch (error) {
    return Promise.reject(error);
  }
};

export { createUser, getUsers };
