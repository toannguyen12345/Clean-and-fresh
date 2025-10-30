import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { DiscountFormData } from '@/schemas/discount';
import { USER_ROUTES } from '@/constants/routes';
import { Loading } from '@/components';

import { InputForm } from '../InputForm';

const getDiscountById = async (
  _id: string,
): Promise<DiscountFormData | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    discountType: 'percent',
    discountName: 'Giảm giá mùa hè',
    discountCode: 'SUMMER2024',
    discountValue: 20,
    startDate: '2024-06-01',
    expiryDate: '2024-08-31',
  };
};

const EditDiscountPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState<DiscountFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiscount = async () => {
      if (id) {
        const data = await getDiscountById(id);
        setInitialData(data);
        setIsLoading(false);
      }
    };
    fetchDiscount();
  }, [id]);

  const handleSubmit = () => {
    navigate(USER_ROUTES.US0008_DISCOUNT_LIST);
  };

  const handleCancel = () => {
    navigate(USER_ROUTES.US0008_DISCOUNT_LIST);
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (!initialData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Không tìm thấy mã giảm giá</p>
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

export default EditDiscountPage;
