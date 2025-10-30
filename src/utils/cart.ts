import axiosInstance from '@/lib/axios';
import { addCart } from '@/apis/cart';
import { hasAuthToken } from '@/utils/auth';
import { getUserId } from '@/apis/user';
import type { CartItem } from '@/types/cart';

export { hasAuthToken, isLoggedIn } from '@/utils/auth';

export const cartItemHelpers = {
  getPrice: (item: CartItem) => item.product?.ProductPrice || 0,
  getName: (item: CartItem) => item.product?.productName || 'Sản phẩm',
  getId: (item: CartItem) => item.product?._id || '',
  getMaxQuantity: (item: CartItem) => item.product?.ProductQuantity || 100,
  getImage: (item: CartItem) => item.product?.image || item.product?.IMG || '',
};

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    const itemPrice = cartItemHelpers.getPrice(item);
    return total + itemPrice * item.quantity;
  }, 0);
};

export const calculateCartItemsCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export const formatCartPrice = (price: number): string => {
  return Number(price).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

export const formatCartItemPrice = (item: CartItem): string => {
  const itemTotal = cartItemHelpers.getPrice(item) * item.quantity;
  return formatCartPrice(itemTotal);
};

export const validateCartItem = (item: CartItem): boolean => {
  return (
    !!item.product && item.quantity > 0 && typeof item.quantity === 'number'
  );
};

export const buildCartItemData = (
  productId: string,
  userId: string,
  quantity: number,
  productName?: string,
  price?: number,
) => {
  return {
    product: productId,
    user: userId,
    quantity,
    ...(productName && { productName }),
    ...(price && { price }),
  };
};

export const fetchCartItems = async (userId: string) => {
  try {
    const cartResponse = await axiosInstance.get(`/API/cart/list/${userId}`);
    return Array.isArray(cartResponse) ? cartResponse : cartResponse.data || [];
  } catch (error) {
    console.error('[cartUtils] Error fetching cart items:', error);
    return [];
  }
};
export const getProductQuantityInCart = async (
  productId: string,
): Promise<number> => {
  if (!hasAuthToken()) return 0;

  try {
    const userId = await getUserId();
    if (!userId) return 0;

    const cartItems = await fetchCartItems(userId);
    interface CartItemType {
      product?: { _id: string };
      quantity: number;
    }
    const cartItem = (cartItems as CartItemType[]).find(
      (item) => item.product?._id === productId,
    );
    return cartItem ? cartItem.quantity : 0;
  } catch (error) {
    console.error('[cartUtils] Error getting product quantity:', error);
    return 0;
  }
};
export const addProductToCart = async (
  productId: string,
  userId: string,
  quantity: number,
  productName: string,
  price: number,
) => {
  return addCart({
    product: productId,
    user: userId,
    quantity,
    productName,
    price,
  });
};
