import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { ProductFormData } from '@/schemas/product';
import { USER_ROUTES } from '@/constants/routes';
import { getProductById, updateProduct } from '@/apis/product';
import { buildProductFormData } from '@/utils/product';

import { InputForm } from '../InputForm';

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<ProductFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const product = await getProductById(id);

          if (product && Object.keys(product).length > 0) {
            setInitialData({
              productName: product.productName || '',
              productDescription: product.productDescription || '',
              productPrice: product.ProductPrice || 0,
              productQuantity: product.ProductQuantity || 0,
              category: product.category || 'Leafy',
              image: product.image || product.IMG || '',
            });
          }
        } catch (error) {
          console.error('Fetch error:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (data: ProductFormData, file?: File) => {
    setIsSubmitting(true);
    const formData = buildProductFormData(data, file);

    try {
      if (id) {
        await updateProduct(id, formData);
      }
    } catch (error) {
      // Ignore API errors
    }

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
      isLoading={isSubmitting}
    />
  );
};

export default EditProductPage;
