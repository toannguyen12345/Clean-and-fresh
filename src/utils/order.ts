import type { OrderItem } from '@/types';

export const formatOrderPrice = (price: number): string => {
  return Number(price).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
};

export const formatOrderDate = (date: string): string => {
  return new Date(date).toLocaleDateString('vi-VN');
};

export const calculateOrderTotal = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const calculateItemsCount = (items: OrderItem[]): number => {
  return items?.length || 0;
};
