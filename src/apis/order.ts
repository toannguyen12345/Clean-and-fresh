import axiosInstance from '@/lib/axios';
import { handleApiError } from '@/utils/api';
import type {
  OrderInfo,
  OrderResponse,
  ListOrdersResponse,
} from '@/types/order';

const ORDER_ENDPOINT = '/API/order';

const getAllOrders = async (): Promise<ListOrdersResponse> => {
  try {
    const response = await axiosInstance.get(`${ORDER_ENDPOINT}/all`);

    return {
      success: true,
      message: 'Lấy danh sách tất cả đơn hàng thành công',
      orders: Array.isArray(response) ? response : [],
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Lấy danh sách đơn hàng thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

const getOrdersByUserId = async (
  userId: string,
): Promise<ListOrdersResponse> => {
  try {
    const url = `${ORDER_ENDPOINT}/list/${userId}`;
    const response = await axiosInstance.get(url);

    const orders = Array.isArray(response)
      ? response
      : Array.isArray(response.data)
        ? response.data
        : response.data?.orders || [];
    return {
      success: true,
      message: 'Lấy danh sách đơn hàng của người dùng thành công',
      orders,
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Lấy danh sách đơn hàng thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

const createOrder = async (orderData: OrderInfo): Promise<OrderResponse> => {
  try {
    const response = await axiosInstance.post(
      `${ORDER_ENDPOINT}/create`,
      orderData,
    );
    return {
      success: true,
      message: 'Tạo đơn hàng thành công',
      data: response.data,
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Tạo đơn hàng thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

const updateDeliverStatus = async (
  orderId: string,
  newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
): Promise<OrderResponse> => {
  try {
    const response = await axiosInstance.put(
      `${ORDER_ENDPOINT}/update-status/${orderId}`,
      {
        newStatus,
      },
    );
    return {
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: response.data,
    };
  } catch (error) {
    const errorData = handleApiError(
      error,
      'Cập nhật trạng thái đơn hàng thất bại',
    );
    return {
      success: false,
      ...errorData,
    };
  }
};

export { getAllOrders, getOrdersByUserId, createOrder, updateDeliverStatus };

export type { OrderInfo, OrderResponse, ListOrdersResponse };
