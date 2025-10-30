import { axiosInstance } from '@/lib';
import type { ApiResponse } from '@/types/api';
import type { Discount } from '@/types/discount';
import { handleApiError } from '@/utils/api';
import { isDiscountArrayResponse } from '@/utils/discount';

export type { Discount as DiscountInfo };
type DiscountListResponse = ApiResponse<Discount[]>;

const listDiscounts = async (): Promise<DiscountListResponse> => {
  try {
    const response = await axiosInstance.get('/API/discount/list');

    // Handle both formats: array directly or object with discounts key
    let discounts: Discount[] = [];
    if (Array.isArray(response)) {
      discounts = response;
    } else if (isDiscountArrayResponse(response)) {
      discounts = response.discounts;
    }
    return {
      success: true,
      message: 'Lấy danh sách mã giảm giá thành công',
      data: discounts,
    };
  } catch (error) {
    console.error('listDiscounts error:', error);
    return Promise.reject(error);
  }
};

const getDiscountById = async (
  discountId: string,
): Promise<Discount | null> => {
  try {
    const response = (await axiosInstance.get(
      `/API/discount/findByID/${discountId}`,
    )) as { discount?: Discount };
    return response.discount ?? null;
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
    return isDiscountArrayResponse(response) ? response.discounts : [];
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
    return isDiscountArrayResponse(response) ? response.discounts : [];
  } catch (error) {
    handleApiError(error, 'Tìm mã giảm giá thất bại');
    return Promise.reject(error);
  }
};

const createDiscount = async (
  discountData: Partial<Discount>,
): Promise<Discount | null> => {
  try {
    const response = (await axiosInstance.post(
      `/API/discount/create`,
      discountData,
    )) as { discount?: Discount };
    return response.discount ?? null;
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
    const response = (await axiosInstance.put(
      `/API/discount/updateByID/${discountId}`,
      discountData,
    )) as { discount?: Discount };
    return response.discount ?? null;
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
