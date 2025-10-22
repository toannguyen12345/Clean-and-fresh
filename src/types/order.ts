export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  productId?: string;
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

export interface User {
  _id?: string;
  userName: string;
  userAddress: string;
  userEmail?: string;
  userPhone?: string;
}
