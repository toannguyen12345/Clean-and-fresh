import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { ProductFormData } from '@/schemas/product';
import { USER_ROUTES } from '@/constants/routes';

import { InputForm } from '../InputForm';

// Mock function to get product by ID
const getProductById = async (_id: string): Promise<ProductFormData | null> => {
  // Mock: Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock data
  return {
    productName: 'Táo Fuji Nhật Bản',
    productDescription:
      'Táo Fuji nhập khẩu trực tiếp từ Nhật Bản, giòn ngọt, giàu dinh dưỡng.',
    productPrice: 150000,
    productQuantity: 10,
    category: 'Fruiting',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
  };
};

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<ProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        const data = await getProductById(id);
        setInitialData(data);
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = (data: ProductFormData, _file?: File) => {
    toast.success(
      `Cập nhật sản phẩm thành công!\nID: ${id}\nTên: ${data.productName}\nGiá: ${data.productPrice.toLocaleString('vi-VN')} VNĐ`,
    );
    navigate(USER_ROUTES.US0005_PRODUCT_LIST);
  };

  const handleCancel = () => {
    navigate(USER_ROUTES.US0005_PRODUCT_LIST);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#28a745]" />
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  return (
    <InputForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
};

export default EditProductPage;
