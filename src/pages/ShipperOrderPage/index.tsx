import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import type { ShipperOrderStatus, OrderInfo, OrderUser } from '@/types/order';
import {
  calculateItemsCount,
  mapOrdersToShipperOrders,
  mapUIStatusToAPIStatus,
} from '@/utils/order';
import { SHIPPER_ORDER_STATUS_OPTIONS } from '@/constants';
import { InfiniteScroll, Select } from '@/components';
import { getAllOrders, updateDeliverStatus } from '@/apis/order';
import parcelIcon from '@/assets/parcel_icon.png';

interface ShipperOrder extends OrderInfo {
  paymentStatus: ShipperOrderStatus;
}

const ShipperOrderPage = () => {
  const [allOrders, setAllOrders] = useState<ShipperOrder[]>([]);
  const [displayedOrders, setDisplayedOrders] = useState<ShipperOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getAllOrders();

        if (response.success && response.orders && response.orders.length > 0) {
          const orders = mapOrdersToShipperOrders(
            response.orders,
          ) as ShipperOrder[];
          setAllOrders(orders);
          setDisplayedOrders(orders.slice(0, itemsPerPage));
          setHasMore(orders.length > itemsPerPage);
        } else {
          toast.error(
            response.message || 'Không có đơn hàng hoặc lấy danh sách thất bại',
          );
          setAllOrders([]);
          setDisplayedOrders([]);
          setHasMore(false);
        }
        setLoading(false);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi lấy danh sách đơn hàng');
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
    newStatus: ShipperOrderStatus,
  ) => {
    try {
      const apiStatus = mapUIStatusToAPIStatus(newStatus);
      if (!apiStatus) {
        toast.error('Trạng thái không hợp lệ');
        return;
      }

      const response = await updateDeliverStatus(orderId, apiStatus);

      if (response.success) {
        // Update local state - update both paymentStatus and deliverStatus
        const updatedAllOrders = allOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                paymentStatus: newStatus,
                deliverStatus: apiStatus,
              }
            : order,
        );
        const updatedDisplayedOrders = displayedOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                paymentStatus: newStatus,
                deliverStatus: apiStatus,
              }
            : order,
        );

        setAllOrders(updatedAllOrders);
        setDisplayedOrders(updatedDisplayedOrders);
        toast.success('Cập nhật trạng thái đơn hàng thành công');
      } else {
        toast.error(response.message || 'Cập nhật trạng thái thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const getStatusConfig = (status: ShipperOrderStatus | string) => {
    const configs: Record<
      string,
      { bg: string; hoverBg: string; selectBg: string; text: string }
    > = {
      pending: {
        bg: 'bg-yellow-100 border-yellow-300',
        hoverBg: 'hover:bg-yellow-200',
        selectBg: 'bg-yellow-400 border-yellow-500 text-black',
        text: 'Chờ xác nhận',
      },
      processing: {
        bg: 'bg-yellow-100 border-yellow-300',
        hoverBg: 'hover:bg-yellow-200',
        selectBg: 'bg-yellow-400 border-yellow-500 text-black',
        text: 'Đang xử lý',
      },
      shipped: {
        bg: 'bg-blue-100 border-blue-300',
        hoverBg: 'hover:bg-blue-200',
        selectBg: 'bg-blue-500 border-blue-600 text-white',
        text: 'Đang giao hàng',
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
      cancelled: {
        bg: 'bg-red-100 border-red-300',
        hoverBg: 'hover:bg-red-200',
        selectBg: 'bg-red-500 border-red-600 text-white',
        text: 'Đơn hàng bị hủy',
      },
      canceled: {
        bg: 'bg-red-100 border-red-300',
        hoverBg: 'hover:bg-red-200',
        selectBg: 'bg-red-500 border-red-600 text-white',
        text: 'Đơn hàng bị hủy',
      },
    };
    return configs[status] || configs['pending']; // Default to pending if not found
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
                    <img src={parcelIcon} alt="Parcel" className="w-8 h-8" />
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
                    {typeof order.userId === 'string'
                      ? order.userId
                      : (order.userId as OrderUser)?.userName || 'N/A'}
                  </p>
                  <p className="text-gray-600 text-sm">
                    <strong>Địa chỉ:</strong>{' '}
                    {typeof order.userId !== 'string'
                      ? (order.userId as OrderUser)?.userAddress || 'N/A'
                      : 'N/A'}
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
                        order._id!,
                        value as ShipperOrderStatus,
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
