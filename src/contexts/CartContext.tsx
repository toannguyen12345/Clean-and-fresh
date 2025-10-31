import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

import { listCart } from '@/apis/cart';
import { useUser } from '@/contexts/UserContext';
import type { CartItem } from '@/types/cart';

interface CartContextType {
  cartItems: CartItem[];
  getProductQuantity: (productId: string) => number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { userId } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!userId) {
      setCartItems([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await listCart(userId);
      if (response.success && response.items) {
        setCartItems(response.items as unknown as CartItem[]);
      }
    } catch (error: unknown) {
      console.error('[CartContext] Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const getProductQuantity = (productId: string): number => {
    const item = cartItems.find((item) => {
      const itemProductId =
        typeof item.product === 'string' ? item.product : item.product?._id;
      return itemProductId === productId;
    });
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider
      value={{ cartItems, getProductQuantity, isLoading, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
