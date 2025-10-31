import { addCart } from '@/apis/cart';
import type { CartItem } from '@/types/cart';

export { hasAuthToken, isLoggedIn } from '@/utils/auth';

export const cartItemHelpers = {
  getPrice: (item: CartItem) => {
    const product = item.product;
    return typeof product === 'string' ? 0 : product?.ProductPrice || 0;
  },
  getName: (item: CartItem) => {
    const product = item.product;
    return typeof product === 'string'
      ? 'Sản phẩm'
      : product?.productName || 'Sản phẩm';
  },
  getId: (item: CartItem) => {
    const product = item.product;
    return typeof product === 'string' ? product : product?._id || '';
  },
  getMaxQuantity: (item: CartItem) => {
    const product = item.product;
    return typeof product === 'string' ? 100 : product?.ProductQuantity || 100;
  },
  getImage: (item: CartItem) => {
    const product = item.product;
    return typeof product === 'string'
      ? ''
      : product?.image || product?.IMG || '';
  },
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

// Deprecated: Use useCart().getProductQuantity() from CartContext instead
// This function is kept for backward compatibility but should not be used
// as it makes unnecessary API calls. CartContext already manages cart state globally.
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
