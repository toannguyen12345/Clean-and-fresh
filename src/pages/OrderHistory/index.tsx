import { useState, useEffect } from 'react';
import { BsBox } from 'react-icons/bs';

import type { Order } from '@/types';
import { formatOrderPrice, formatOrderDate } from '@/utils';
import { ORDER_STATUS_CONFIGS } from '@/constants';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
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

      const mockOrders: Order[] = [
        {
          _id: '1',
          orderNumber: 'ORD-2024-001',
          deliverStatus: 'delivered',
          createdAt: '2024-10-15T10:30:00Z',
          items: [
            { productName: 'Táo Fuji Nhật Bản', quantity: 2, price: 150000 },
            { productName: 'Cam Sành Việt Nam', quantity: 3, price: 45000 },
          ],
          totalAmount: 435000,
          paymentMethod: 'Tiền mặt',
          orderToken: 'TXN-123456',
        },
        {
          _id: '2',
          orderNumber: 'ORD-2024-002',
          deliverStatus: 'pending',
          createdAt: '2024-10-18T14:20:00Z',
          items: [
            { productName: 'Nho Mỹ Không Hạt', quantity: 1, price: 120000 },
            { productName: 'Dưa Hấu Không Hạt', quantity: 2, price: 35000 },
          ],
          totalAmount: 190000,
          paymentMethod: 'Chuyển khoản',
          orderToken: 'TXN-789012',
        },
        {
          _id: '3',
          orderNumber: 'ORD-2024-003',
          deliverStatus: 'canceled',
          createdAt: '2024-10-10T09:15:00Z',
          items: [
            { productName: 'Xoài Cát Hòa Lộc', quantity: 5, price: 80000 },
          ],
          totalAmount: 400000,
          paymentMethod: 'Tiền mặt',
          orderToken: 'TXN-345678',
        },
      ];

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrders(mockOrders);
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

  const getStatusConfig = (status: Order['deliverStatus']) => {
    return ORDER_STATUS_CONFIGS[status];
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
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <BsBox className="text-gray-600" />
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-semibold text-gray-900">
                      {order.orderNumber}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <strong className="text-gray-700">
                      {statusConfig.text}:
                    </strong>
                    {statusConfig.icon}
                  </div>

                  <div className="text-gray-600">
                    Ngày mua:{' '}
                    <span className="font-medium">
                      {formatOrderDate(order.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="mb-4 text-gray-700">
                  {order.items.map((item, index) => (
                    <span key={index}>
                      {index > 0 && ', '}
                      <span className="font-medium">
                        {item.productName} (x{item.quantity})
                      </span>
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <span className="text-gray-600">Tổng tiền: </span>
                    <span className="text-[#ff5722] font-bold text-lg">
                      {formatOrderPrice(order.totalAmount)}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-600">Phương thức: </span>
                    <span className="font-semibold">{order.paymentMethod}</span>
                  </div>

                  <div>
                    <span className="text-gray-600">Mã giao dịch: </span>
                    <span className="font-medium">
                      {order.orderToken || 'Không có thông tin'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleDropdownContent(order._id)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <i className="fas fa-eye" />
                  Xem tất cả sản phẩm
                </button>

                {expandedOrders[order._id] && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                      >
                        <p className="text-gray-700">{item.productName}</p>
                        <p className="text-gray-600">x{item.quantity}</p>
                        <p className="text-[#ff5722] font-bold">
                          {formatOrderPrice(item.price)}
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
