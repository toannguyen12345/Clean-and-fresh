import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';

import type { UserInfo } from '@/types/user';
import authService from '@/apis/auth';
import userService from '@/apis/user';

interface UserContextType {
  userData: UserInfo | null;
  userAvatar: string;
  setUserData: (data: UserInfo | null) => void;
  setUserAvatar: (avatar: string) => void;
  loadUserData: () => Promise<void>;
  refreshUserAvatar: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [userAvatar, setUserAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  );

  const loadUserData = useCallback(async () => {
    const token = authService.getAuthToken();
    if (!token) {
      setUserData(null);
      setUserAvatar(
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      );
      return;
    }

    try {
      const result = await userService.getMe();
      if (result.success && result.data) {
        const rawData = (Array.isArray(result.data)
          ? result.data[0]
          : result.data) as unknown as Record<string, unknown>;
        const user: UserInfo = {
          ...rawData,
          image: (rawData.IMG as string) || (rawData.image as string),
        } as UserInfo;
        setUserData(user);
        if (user.image) {
          setUserAvatar(user.image);
        }
      } else {
        setUserData(null);
      }
    } catch (error) {
      setUserData(null);
      setUserAvatar(
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      );
    }
  }, []);

  const refreshUserAvatar = useCallback(async () => {
    await loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        loadUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadUserData]);

  return (
    <UserContext.Provider
      value={{
        userData,
        userAvatar,
        setUserData,
        setUserAvatar,
        loadUserData,
        refreshUserAvatar,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
