import { BsClock, BsCheckCircle, BsXCircle } from 'react-icons/bs';

import type { OrderStatus, ShipperOrderStatus } from '@/types';

export const ORDER_STATUS = {
  PENDING: 'pending' as const,
  DELIVERED: 'delivered' as const,
  CANCELED: 'canceled' as const,
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Đang chờ xác nhận',
  delivered: 'Đã giao hàng',
  canceled: 'Đơn hàng bị huỷ',
};

export const ORDER_STATUS_CONFIGS: Record<
  OrderStatus,
  {
    text: string;
    icon: JSX.Element;
  }
> = {
  pending: {
    text: ORDER_STATUS_LABELS.pending,
    icon: <BsClock className="text-orange-500 text-xl" />,
  },
  delivered: {
    text: ORDER_STATUS_LABELS.delivered,
    icon: <BsCheckCircle className="text-green-500 text-xl" />,
  },
  canceled: {
    text: ORDER_STATUS_LABELS.canceled,
    icon: <BsXCircle className="text-red-500 text-xl" />,
  },
};

export const SHIPPER_ORDER_STATUS_LABELS: Record<ShipperOrderStatus, string> = {
  pending: 'Chờ xác nhận',
  delivering: 'Đang giao hàng',
  delivered: 'Đã giao tới nơi',
  canceled: 'Đơn hàng bị hủy',
};

export const SHIPPER_ORDER_STATUS_OPTIONS = [
  {
    value: 'pending' as const,
    label: SHIPPER_ORDER_STATUS_LABELS.pending,
  },
  {
    value: 'delivering' as const,
    label: SHIPPER_ORDER_STATUS_LABELS.delivering,
  },
  {
    value: 'delivered' as const,
    label: SHIPPER_ORDER_STATUS_LABELS.delivered,
  },
  {
    value: 'canceled' as const,
    label: SHIPPER_ORDER_STATUS_LABELS.canceled,
  },
];
