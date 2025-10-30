import type { ApiResponse } from './api';

export interface OrderItem {
  productId: string;
  quantity: number;
  productName?: string;
  price?: number;
  itemTotal?: number;
}

export interface OrderInfo {
  _id?: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  deliverStatus?:
    | 'pending'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export type OrderResponse = ApiResponse<OrderInfo | OrderInfo[]>;

export interface ListOrdersResponse {
  success: boolean;
  message: string;
  orders?: OrderInfo[];
  error?: Record<string, unknown>;
}

export interface Order {
  _id: string;
  orderNumber: string;
  deliverStatus: 'pending' | 'delivered' | 'canceled';
  createdAt: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  orderToken?: string;
  buyerName?: string;
  userId?: string;
  distributorId?: string;
}

export type OrderStatus = Order['deliverStatus'];

export type ShipperOrderStatus =
  | 'pending'
  | 'delivering'
  | 'delivered'
  | 'canceled';

export interface OrderUser {
  _id?: string;
  userName: string;
  userAddress: string;
  userEmail?: string;
  userPhone?: string;
}
