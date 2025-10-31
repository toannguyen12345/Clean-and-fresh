import { createOrder } from '@/apis/order';
import { cleanFullCart } from '@/apis/cart';
import { cartItemHelpers } from '@/utils/cart';
import type { OrderItem, OrderInfo } from '@/types/order';
import type { CartItem } from '@/types/cart';

interface OrderResponse {
  order: OrderInfo;
}

interface OrdersArray {
  orders: OrderInfo[];
}

const hasOrderKey = (obj: object): obj is { order: unknown } => {
  return 'order' in obj;
};

export const isOrderResponse = (data: unknown): data is OrderResponse => {
  return (
    data !== null &&
    typeof data === 'object' &&
    hasOrderKey(data) &&
    typeof data.order === 'object' &&
    data.order !== null
  );
};

const hasOrdersKey = (obj: object): obj is { orders: unknown } => {
  return 'orders' in obj;
};

export const isOrdersArray = (data: unknown): data is OrdersArray => {
  return (
    data !== null &&
    typeof data === 'object' &&
    hasOrdersKey(data) &&
    Array.isArray(data.orders)
  );
};

export const isOrderItem = (data: unknown): data is OrderItem => {
  return (
    data !== null &&
    typeof data === 'object' &&
    'productId' in data &&
    'quantity' in data &&
    typeof (data as Record<string, unknown>).quantity === 'number'
  );
};

// Type guard for OrderInfo
export const isOrderInfo = (data: unknown): data is OrderInfo => {
  return (
    data !== null &&
    typeof data === 'object' &&
    'userId' in data &&
    'items' in data &&
    'totalAmount' in data &&
    'paymentMethod' in data &&
    Array.isArray((data as Record<string, unknown>).items)
  );
};

export const DELIVERY_STATUS = {
  pending: 'Chờ xử lý',
  processing: 'Đang xử lý',
  shipped: 'Đã gửi',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
} as const;

export const getDeliveryStatusLabel = (
  status: OrderInfo['deliverStatus'],
): string => {
  if (!status) return 'Không xác định';
  return DELIVERY_STATUS[status] || status;
};

export const getDeliveryStatusColor = (
  status: OrderInfo['deliverStatus'],
): string => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-yellow-100 text-yellow-800';
    case 'shipped':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

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
  return items.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0,
  );
};

export const calculateItemsCount = (items: OrderItem[]): number => {
  return items?.length || 0;
};

export const calculateOrderItemsQuantity = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

export const validateOrderData = (order: OrderInfo): boolean => {
  return (
    !!order.userId &&
    Array.isArray(order.items) &&
    order.items.length > 0 &&
    order.totalAmount > 0 &&
    !!order.paymentMethod
  );
};

export const buildOrderPayload = (
  userId: string,
  items: OrderItem[],
  totalAmount: number,
  paymentMethod: string,
): OrderInfo => {
  return {
    userId,
    items,
    totalAmount,
    paymentMethod,
    deliverStatus: 'pending',
  };
};

export const mapUIStatusToAPIStatus = (
  uiStatus: string,
): 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | null => {
  const statusMap: Record<
    string,
    'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  > = {
    pending: 'pending',
    delivering: 'shipped',
    delivered: 'delivered',
    canceled: 'cancelled',
  };
  return statusMap[uiStatus] || null;
};

export const mapOrdersToShipperOrders = (orders: OrderInfo[]) => {
  return orders.map((order) => ({
    ...order,
    paymentStatus: (order.deliverStatus || 'pending') as string,
  }));
};

export interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  weeklySales: number[];
  yearlySales: number[];
}

export const calculateDashboardStats = (
  orders: OrderInfo[],
): Omit<DashboardStats, 'totalUsers'> => {
  let totalRevenue = 0;
  const weeklySales = [0, 0, 0, 0, 0, 0, 0];
  const yearlySales = [0, 0, 0, 0, 0];

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Chỉ tính các đơn hàng có status là "delivered" (đã giao)
  const deliveredOrders = orders.filter(
    (order) => order.deliverStatus === 'delivered',
  );

  deliveredOrders.forEach((order) => {
    const orderAmount = order.totalAmount || 0;
    totalRevenue += orderAmount;

    if (order.createdAt) {
      const orderDate = new Date(order.createdAt);
      const daysDiff = Math.floor(
        (currentDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysDiff >= 0 && daysDiff < 7) {
        const dayOfWeek = orderDate.getDay();
        weeklySales[dayOfWeek] += orderAmount;
      }

      const orderYear = orderDate.getFullYear();
      const yearIndex = currentYear - orderYear;
      if (yearIndex >= 0 && yearIndex < 5) {
        yearlySales[4 - yearIndex] += orderAmount;
      }
    }
  });

  return {
    totalRevenue,
    totalOrders: deliveredOrders.length,
    weeklySales,
    yearlySales,
  };
};

export const handleCheckoutOrder = async (
  cartItems: CartItem[],
  userId: string,
  totalAmount: number,
  method: 'online' | 'cash',
) => {
  const orderItems = cartItems.map((item) => ({
    productId: cartItemHelpers.getId(item),
    quantity: item.quantity,
    productName: cartItemHelpers.getName(item),
    price: cartItemHelpers.getPrice(item),
    itemTotal: cartItemHelpers.getPrice(item) * item.quantity,
  }));

  const orderData = {
    userId,
    items: orderItems,
    totalAmount,
    paymentMethod: method === 'online' ? 'ONLINE' : 'CASH',
  };

  const response = await createOrder(orderData);

  if (response.success) {
    await cleanFullCart(userId);
    return { success: true, message: 'Tạo đơn hàng thành công' };
  } else {
    return {
      success: false,
      message: response.message || 'Tạo đơn hàng thất bại',
    };
  }
};
