import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { DiscountFormData } from '@/schemas/discount';
import { USER_ROUTES } from '@/constants/routes';
import { createDiscount } from '@/apis/discount';
import { createDiscountPayload } from '@/utils/discount';

import { InputForm } from '../InputForm';

const AddDiscountPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: DiscountFormData) => {
    setIsLoading(true);
    const payload = createDiscountPayload(data);

    try {
      await createDiscount(payload);
    } catch (error) {
      // Ignore API errors
    }

    navigate(USER_ROUTES.US0008_DISCOUNT_LIST);
  };

  const handleCancel = () => {
    navigate(USER_ROUTES.US0008_DISCOUNT_LIST);
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

export default AddDiscountPage;
