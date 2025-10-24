import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';

import type { UserInfo } from '@/apis/user';

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
    const authService = (await import('@/apis/auth')).default;
    const userService = (await import('@/apis/user')).default;

    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      const result = await userService.getUserById(currentUser.id);
      if (result.success && result.data) {
        const user = (
          Array.isArray(result.data) ? result.data[0] : result.data
        ) as UserInfo;
        setUserData(user);
        if (user.IMG) {
          setUserAvatar(user.IMG);
        }
      }
    } else {
      // Nếu không có user, reset
      setUserData(null);
      setUserAvatar(
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      );
    }
  }, []);

  const refreshUserAvatar = useCallback(async () => {
    await loadUserData();
  }, [loadUserData]);

  // Load user data khi component mount
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Listen to storage changes (login/logout từ tab khác hoặc cùng tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        // Delay một chút để đảm bảo token đã được update
        setTimeout(() => {
          loadUserData();
        }, 100);
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
