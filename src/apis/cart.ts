import axiosInstance from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import { handleApiError } from '@/utils/api';

export interface CartItem {
  _id?: string;
  product: string;
  user: string;
  quantity: number;
  productName?: string;
  price?: number;
}

export type CartResponse = ApiResponse<CartItem | CartItem[]>;

interface ListCartResponse {
  success: boolean;
  message: string;
  items?: CartItem[];
  error?: Record<string, unknown>;
}

const CART_ENDPOINT = '/API/cart';

const listCart = async (userId: string): Promise<ListCartResponse> => {
  try {
    const response = (await axiosInstance.get(
      `${CART_ENDPOINT}/list/${userId}`,
    )) as CartItem[] | { items?: CartItem[] };

    let items: CartItem[] = [];
    if (Array.isArray(response)) {
      items = response;
    } else if (response?.items && Array.isArray(response.items)) {
      items = response.items;
    }
    return {
      success: true,
      message: 'Lấy danh sách giỏ hàng thành công',
      items,
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Lấy danh sách giỏ hàng thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

const addCart = async (cartData: CartItem): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.post(`${CART_ENDPOINT}/add`, cartData);
    return {
      success: true,
      message: 'Thêm sản phẩm vào giỏ hàng thành công',
      data: response.data,
    };
  } catch (error) {
    const errorData = handleApiError(
      error,
      'Thêm sản phẩm vào giỏ hàng thất bại',
    );
    return {
      success: false,
      ...errorData,
    };
  }
};

const removeCart = async (cartData: CartItem): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.post(
      `${CART_ENDPOINT}/remove`,
      cartData,
    );
    return {
      success: true,
      message: 'Giảm số lượng sản phẩm thành công',
      data: response.data,
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Giảm số lượng sản phẩm thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

const cleanCart = async (cartData: CartItem): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.post(
      `${CART_ENDPOINT}/clean`,
      cartData,
    );
    return {
      success: true,
      message: response.data.message || 'Xóa sản phẩm khỏi giỏ hàng thành công',
      data: undefined,
    };
  } catch (error) {
    const errorData = handleApiError(
      error,
      'Xóa sản phẩm khỏi giỏ hàng thất bại',
    );
    return {
      success: false,
      ...errorData,
    };
  }
};

const cleanFullCart = async (userId: string): Promise<CartResponse> => {
  try {
    const response = await axiosInstance.post(
      `${CART_ENDPOINT}/cleanfull/${userId}`,
    );
    return {
      success: true,
      message: response.data.message || 'Làm sạch giỏ hàng thành công',
      data: undefined,
    };
  } catch (error) {
    const errorData = handleApiError(error, 'Làm sạch giỏ hàng thất bại');
    return {
      success: false,
      ...errorData,
    };
  }
};

export { listCart, addCart, removeCart, cleanCart, cleanFullCart };
