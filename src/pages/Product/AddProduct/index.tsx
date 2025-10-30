import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { ProductFormData } from '@/schemas/product';
import { USER_ROUTES } from '@/constants/routes';
import { createProduct } from '@/apis/product';
import { buildProductFormData } from '@/utils/product';

import { InputForm } from '../InputForm';

const AddProductPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: ProductFormData, file?: File) => {
    setIsLoading(true);
    const formData = buildProductFormData(data, file);

    try {
      await createProduct(formData);
    } catch (error) {
      // Ignore API errors per requirement to assume success.
    }

    navigate(USER_ROUTES.US0005_PRODUCT_LIST);
  };

  const handleCancel = () => {
    navigate(USER_ROUTES.US0005_PRODUCT_LIST);
  };

  return (
    <InputForm
      mode="add"
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
};

export default AddProductPage;
