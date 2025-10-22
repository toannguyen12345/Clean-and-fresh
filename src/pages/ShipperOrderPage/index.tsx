import { useEffect, useState } from 'react';
import { BsBox } from 'react-icons/bs';

import type { ShipperOrderStatus, OrderItem, User } from '@/types';
import { calculateItemsCount } from '@/utils';
import { SHIPPER_ORDER_STATUS_OPTIONS } from '@/constants';
import { InfiniteScroll, Select } from '@/components';

interface Order {
  _id: string;
  items: OrderItem[];
  userId?: User;
  paymentStatus: ShipperOrderStatus;
}

const ShipperOrderPage = () => {
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const mockOrders: Order[] = [
          {
            _id: '1',
            items: [
              { productName: 'Táo Fuji', quantity: 2, price: 150000 },
              { productName: 'Cam Sành', quantity: 3, price: 45000 },
            ],
            userId: {
              userName: 'Nguyễn Văn A',
              userAddress: '123 Đường ABC, Quận 1, TP.HCM',
            },
            paymentStatus: 'pending',
          },
          {
            _id: '2',
            items: [{ productName: 'Nho Mỹ', quantity: 1, price: 120000 }],
            userId: {
              userName: 'Trần Thị B',
              userAddress: '456 Đường XYZ, Quận 3, TP.HCM',
            },
            paymentStatus: 'delivering',
          },
          {
            _id: '3',
            items: [{ productName: 'Xoài Cát', quantity: 5, price: 80000 }],
            userId: {
              userName: 'Lê Văn C',
              userAddress: '789 Đường DEF, Quận 5, TP.HCM',
            },
            paymentStatus: 'delivered',
          },
          {
            _id: '4',
            items: [{ productName: 'Dưa Hấu', quantity: 2, price: 35000 }],
            userId: {
              userName: 'Phạm Thị D',
              userAddress: '321 Đường GHI, Quận 7, TP.HCM',
            },
            paymentStatus: 'canceled',
          },
          {
            _id: '5',
            items: [{ productName: 'Bưởi Da Xanh', quantity: 3, price: 60000 }],
            userId: {
              userName: 'Hoàng Văn E',
              userAddress: '654 Đường JKL, Quận 10, TP.HCM',
            },
            paymentStatus: 'pending',
          },
        ];

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAllOrders(mockOrders);
        setDisplayedOrders(mockOrders.slice(0, itemsPerPage));
        setHasMore(mockOrders.length > itemsPerPage);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const newOrders = allOrders.slice(startIndex, endIndex);

      setDisplayedOrders((prev) => [...prev, ...newOrders]);
      setPage(nextPage);
      setHasMore(endIndex < allOrders.length);
      setLoadingMore(false);
    }, 500);
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: Order['paymentStatus'],
  ) => {
    try {
      const updatedAllOrders = allOrders.map((order) =>
        order._id === orderId ? { ...order, paymentStatus: newStatus } : order,
      );
      const updatedDisplayedOrders = displayedOrders.map((order) =>
        order._id === orderId ? { ...order, paymentStatus: newStatus } : order,
      );

      setAllOrders(updatedAllOrders);
      setDisplayedOrders(updatedDisplayedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusConfig = (status: Order['paymentStatus']) => {
    const configs = {
      pending: {
        bg: 'bg-yellow-100 border-yellow-300',
        hoverBg: 'hover:bg-yellow-200',
        selectBg: 'bg-yellow-400 border-yellow-500 text-black',
        text: 'Chờ xác nhận',
      },
      delivering: {
        bg: 'bg-blue-100 border-blue-300',
        hoverBg: 'hover:bg-blue-200',
        selectBg: 'bg-blue-500 border-blue-600 text-white',
        text: 'Đang giao hàng',
      },
      delivered: {
        bg: 'bg-green-100 border-green-300',
        hoverBg: 'hover:bg-green-200',
        selectBg: 'bg-green-500 border-green-600 text-white',
        text: 'Đã giao tới nơi',
      },
      canceled: {
        bg: 'bg-red-100 border-red-300',
        hoverBg: 'hover:bg-red-200',
        selectBg: 'bg-red-500 border-red-600 text-white',
        text: 'Đơn hàng bị hủy',
      },
    };
    return configs[status];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28a745] mx-auto mb-4" />
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-md">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Thông tin giao hàng
      </h1>

      <InfiniteScroll
        hasMore={hasMore}
        isLoading={loadingMore}
        onLoadMore={loadMore}
        endMessage={
          <p className="text-center text-gray-500 text-sm">
            Đã hiển thị tất cả đơn hàng
          </p>
        }
      >
        <div className="space-y-4">
          {displayedOrders.map((order) => {
            const statusConfig = getStatusConfig(order.paymentStatus);

            return (
              <div
                key={order._id}
                className={`flex items-center justify-between rounded-lg p-4 border transition-all duration-300 ${statusConfig.bg} ${statusConfig.hoverBg} shadow-sm hover:shadow-md`}
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <BsBox className="w-8 h-8 text-gray-600" />
                  </div>
                </div>

                <div className="flex-grow ml-5">
                  {order.items.length > 0 && (
                    <p className="text-gray-700 font-medium mb-1">
                      {order.items
                        .map((item) => `${item.productName} x ${item.quantity}`)
                        .join(', ')}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm">
                    <strong>Khách hàng:</strong>{' '}
                    {order.userId?.userName || 'N/A'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <strong>Địa chỉ:</strong>{' '}
                    {order.userId?.userAddress || 'N/A'}
                  </p>
                </div>

                <div className="text-right mr-5">
                  <p className="text-gray-600 text-sm">Số lượng sản phẩm:</p>
                  <p className="text-gray-900 font-bold text-lg">
                    {calculateItemsCount(order.items)}
                  </p>
                </div>

                <div className="flex-shrink-0 w-48">
                  <Select
                    value={order.paymentStatus}
                    onChange={(value) =>
                      handleStatusChange(
                        order._id,
                        value as Order['paymentStatus'],
                      )
                    }
                    options={SHIPPER_ORDER_STATUS_OPTIONS}
                    className={statusConfig.selectBg}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ShipperOrderPage;
