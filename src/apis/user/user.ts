import { axiosInstance } from '@/lib';

const createUser = async () => {
  try {
    await axiosInstance.post('/user');
  } catch (error) {
    return Promise.reject(error);
  }
};

export { createUser };
