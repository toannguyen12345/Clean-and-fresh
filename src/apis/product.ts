import type { ApiResponse } from '@/types/api';
import type { Product } from '@/types/product';
import { axiosInstance } from '@/lib';
import { handleApiError } from '@/utils/api';
import { isProductResponse, isProductArray } from '@/utils/product';

export type { Product as ProductInfo };

type ProductListResponse = ApiResponse<Product[]>;

const listProducts = async (): Promise<ProductListResponse> => {
  try {
    const response = await axiosInstance.get('/API/product/list');

    if (response && typeof response === 'object' && 'products' in response) {
      const products = response.products;
      if (Array.isArray(products)) {
        return {
          success: true,
          message: 'Lấy danh sách sản phẩm thành công',
          data: products,
        };
      }
    }

    return {
      success: true,
      message: 'Lấy danh sách sản phẩm thành công',
      data: [],
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

const getProductById = async (productId: string): Promise<Product | null> => {
  try {
    const response = await axiosInstance.get(
      `/API/product/findByID/${productId}`,
    );
    return isProductResponse(response) ? response.product : null;
  } catch (error) {
    handleApiError(error, 'Lấy sản phẩm thất bại');
    return Promise.reject(error);
  }
};

const searchProductByName = async (name: string): Promise<Product[]> => {
  try {
    const response = await axiosInstance.get(
      `/API/product/findByName/${encodeURIComponent(name)}`,
    );
    return isProductArray(response) ? response.products : [];
  } catch (error) {
    handleApiError(error, 'Tìm sản phẩm thất bại');
    return Promise.reject(error);
  }
};

const createProduct = async (
  productData: FormData,
): Promise<Product | null> => {
  try {
    const response = await axiosInstance.post(
      `/API/product/create`,
      productData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return isProductResponse(response) ? response.product : null;
  } catch (error) {
    handleApiError(error, 'Tạo sản phẩm thất bại');
    return Promise.reject(error);
  }
};

const updateProduct = async (
  productId: string,
  productData: FormData,
): Promise<Product | null> => {
  try {
    const response = await axiosInstance.put(
      `/API/product/updateByID/${productId}`,
      productData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return isProductResponse(response) ? response.product : null;
  } catch (error) {
    handleApiError(error, 'Cập nhật sản phẩm thất bại');
    return Promise.reject(error);
  }
};

const deleteProduct = async (productId: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/API/product/deleteByID/${productId}`);
  } catch (error) {
    handleApiError(error, 'Xóa sản phẩm thất bại');
    return Promise.reject(error);
  }
};

const updateProductQuantity = async (
  productId: string,
  quantity: number,
): Promise<Product | null> => {
  try {
    const response = await axiosInstance.put(
      `/API/product/updateQuantity/${productId}`,
      { quantity },
    );
    return isProductResponse(response) ? response.product : null;
  } catch (error) {
    handleApiError(error, 'Cập nhật số lượng sản phẩm thất bại');
    return Promise.reject(error);
  }
};

export {
  listProducts,
  getProductById,
  searchProductByName,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductQuantity,
};
