import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { DiscountFormData } from '@/schemas/discount';
import { USER_ROUTES } from '@/constants/routes';

import { InputForm } from '../InputForm';

const AddDiscountPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: DiscountFormData) => {
    toast.success(
      `Thêm mã giảm giá thành công!\nMã: ${data.discountCode}\nGiảm: ${data.discountValue}${data.discountType === 'percent' ? '%' : ' VNĐ'}`,
    );
    navigate(USER_ROUTES.US0008_DISCOUNT_LIST);
  };

  const handleCancel = () => {
    navigate(USER_ROUTES.US0008_DISCOUNT_LIST);
  };

  return (
    <InputForm mode="add" onSubmit={handleSubmit} onCancel={handleCancel} />
  );
};

export default AddDiscountPage;
