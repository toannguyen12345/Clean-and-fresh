import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';

import type { UserInfo } from '@/types/user';
import userService from '@/apis/user';
import { getAuthToken } from '@/utils/auth';

interface UserContextType {
  userData: UserInfo | null;
  userId: string | null;
  userAvatar: string;
  isLoading: boolean;
  setUserData: (data: UserInfo | null) => void;
  setUserAvatar: (avatar: string) => void;
  loadUserData: () => Promise<UserInfo | null>;
  refreshUserAvatar: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadUserData = useCallback(async (): Promise<UserInfo | null> => {
    setIsLoading(true);
    const token = getAuthToken();
    if (!token) {
      setUserData(null);
      setUserId(null);
      setUserAvatar(
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      );
      setIsLoading(false);
      return null;
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
        setUserId(user._id);
        if (user.image) {
          setUserAvatar(user.image);
        }
        return user;
      } else {
        setUserData(null);
        setUserId(null);
        return null;
      }
    } catch (error: unknown) {
      console.error('[UserContext] Error loading user data:', error);
      setUserData(null);
      setUserId(null);
      setUserAvatar(
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      );
      return null;
    } finally {
      setIsLoading(false);
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
        userId,
        userAvatar,
        isLoading,
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
