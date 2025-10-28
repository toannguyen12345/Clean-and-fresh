import { axiosInstance } from '@/lib';
import type { ApiResponse } from '@/types/api';
import type { Discount } from '@/types/discount';
import { handleApiError } from '@/utils/api';
import { isDiscountResponse, isDiscountArrayResponse } from '@/utils/discount';

export type { Discount as DiscountInfo };

type DiscountListResponse = ApiResponse<Discount[]>;

const listDiscounts = async (): Promise<DiscountListResponse> => {
  try {
    const response = await axiosInstance.get('/API/discount/list');
    const discounts = isDiscountArrayResponse(response)
      ? response.foundDiscounts
      : [];

    return {
      success: true,
      message: 'Lấy danh sách mã giảm giá thành công',
      data: discounts,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

const getDiscountById = async (
  discountId: string,
): Promise<Discount | null> => {
  try {
    const response = await axiosInstance.get(
      `/API/discount/findByID/${discountId}`,
    );
    // Type guard validates response structure, returns null if invalid
    return isDiscountResponse(response) ? response.discount : null;
  } catch (error) {
    handleApiError(error, 'Lấy mã giảm giá thất bại');
    return Promise.reject(error);
  }
};

const searchDiscountByName = async (name: string): Promise<Discount[]> => {
  try {
    const response = await axiosInstance.get(
      `/API/discount/findByName/${encodeURIComponent(name)}`,
    );
    return isDiscountArrayResponse(response) ? response.foundDiscounts : [];
  } catch (error) {
    handleApiError(error, 'Tìm mã giảm giá thất bại');
    return Promise.reject(error);
  }
};

const searchDiscountByCode = async (code: string): Promise<Discount[]> => {
  try {
    const response = await axiosInstance.get(
      `/API/discount/findByCode/${encodeURIComponent(code)}`,
    );
    return isDiscountArrayResponse(response) ? response.foundDiscounts : [];
  } catch (error) {
    handleApiError(error, 'Tìm mã giảm giá thất bại');
    return Promise.reject(error);
  }
};

const createDiscount = async (
  discountData: Partial<Discount>,
): Promise<Discount | null> => {
  try {
    const response = await axiosInstance.post(
      `/API/discount/create`,
      discountData,
    );
    return isDiscountResponse(response) ? response.discount : null;
  } catch (error) {
    handleApiError(error, 'Tạo mã giảm giá thất bại');
    return Promise.reject(error);
  }
};

const updateDiscount = async (
  discountId: string,
  discountData: Partial<Discount>,
): Promise<Discount | null> => {
  try {
    const response = await axiosInstance.put(
      `/API/discount/updateByID/${discountId}`,
      discountData,
    );
    return isDiscountResponse(response) ? response.discount : null;
  } catch (error) {
    handleApiError(error, 'Cập nhật mã giảm giá thất bại');
    return Promise.reject(error);
  }
};
const deleteDiscount = async (discountId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/API/Discount/deleteByID/${discountId}`);
  } catch (error) {
    handleApiError(error, 'Xóa mã giảm giá thất bại');
    return Promise.reject(error);
  }
};

export {
  listDiscounts,
  getDiscountById,
  searchDiscountByName,
  searchDiscountByCode,
  createDiscount,
  updateDiscount,
  deleteDiscount,
};
