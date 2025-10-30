import { useState, useEffect } from 'react';
import { BsBox } from 'react-icons/bs';

import { getOrdersByUserId } from '@/apis/order';
import { getUserId } from '@/apis/user';
import {
  formatOrderPrice,
  formatOrderDate,
  getDeliveryStatusLabel,
  getDeliveryStatusColor,
} from '@/utils/order';
import type { OrderInfo } from '@/types/order';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const userId = await getUserId();
      if (!userId) {
        setError('Vui lòng đăng nhập');
        return;
      }

      const response = await getOrdersByUserId(userId);
      if (response.success && response.orders) {
        setOrders(response.orders);
      } else {
        setError(response.message || 'Không thể tải lịch sử đơn hàng');
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Không thể tải lịch sử đơn hàng',
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdownContent = (orderId: string) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const getStatusConfig = (status: OrderInfo['deliverStatus']) => {
    const label = getDeliveryStatusLabel(status);
    const color = getDeliveryStatusColor(status);
    return { text: label, color };
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method?.toUpperCase()) {
      case 'CASH':
        return 'Tiền mặt';
      case 'ONLINE':
        return 'Chuyển khoản';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28a745] mx-auto mb-4" />
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-2 bg-[#28a745] text-white rounded-lg hover:bg-[#218838] transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Lịch sử mua hàng
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <BsBox className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.deliverStatus);
            return (
              <div
                key={order._id}
                className={`rounded-lg shadow-md hover:shadow-lg transition-all p-6 ${statusConfig.color}`}
              >
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <BsBox className="text-gray-600" />
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-semibold text-gray-900">
                      {order._id}
                    </span>
                  </div>

                  <div className="text-gray-600">
                    Ngày mua:{' '}
                    <span className="font-medium">
                      {order.createdAt
                        ? formatOrderDate(order.createdAt)
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="mb-4 text-gray-700">
                  {order.items?.slice(0, 3).map((item, index: number) => (
                    <span key={index}>
                      {index > 0 && ', '}
                      <span className="font-medium">
                        {item.productName} (x{item.quantity})
                      </span>
                    </span>
                  ))}
                  {order.items && order.items.length > 3 && (
                    <span className="font-medium text-gray-600"> ...</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-gray-600">Tổng tiền: </span>
                    <span className="text-[#ff5722] font-bold text-lg">
                      {formatOrderPrice(order.totalAmount || 0)}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-600">Phương thức: </span>
                    <span className="font-semibold">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-600">Trạng thái: </span>
                    <span className="font-medium">{statusConfig.text}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleDropdownContent(order._id || '')}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <i className="fas fa-eye" />
                  Xem tất cả sản phẩm
                </button>

                {order._id && expandedOrders[order._id] && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-2">
                    {order.items?.map((item, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                      >
                        <p className="text-gray-700">{item.productName}</p>
                        <p className="text-gray-600">x{item.quantity}</p>
                        <p className="text-[#ff5722] font-bold">
                          {formatOrderPrice(item.price || 0)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
