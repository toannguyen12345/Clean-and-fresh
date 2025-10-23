import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

interface UserContextType {
  userAvatar: string;
  setUserAvatar: (avatar: string) => void;
  refreshUserAvatar: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userAvatar, setUserAvatar] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  );

  const refreshUserAvatar = useCallback(async () => {
    const authService = (await import('@/apis/Authentication/auth')).default;
    const userService = (await import('@/apis/User/user')).default;

    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      const result = await userService.getUserById(currentUser.id);
      if (result.success && result.data) {
        const userData = (Array.isArray(result.data)
          ? result.data[0]
          : result.data) as unknown as Record<string, unknown>;
        if (userData.IMG) {
          setUserAvatar(userData.IMG as string);
        }
      }
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ userAvatar, setUserAvatar, refreshUserAvatar }}
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
