import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { ProductFormData } from '@/schemas/product';
import { USER_ROUTES } from '@/constants/routes';

import { InputForm } from '../InputForm';

const AddProductPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: ProductFormData, _file?: File) => {
    toast.success(
      `Thêm sản phẩm thành công!\nTên: ${data.productName}\nGiá: ${data.productPrice.toLocaleString('vi-VN')} VNĐ`,
    );
    navigate(USER_ROUTES.US0005_PRODUCT_LIST);
  };

  const handleCancel = () => {
    navigate(USER_ROUTES.US0005_PRODUCT_LIST);
  };

  return (
    <InputForm mode="add" onSubmit={handleSubmit} onCancel={handleCancel} />
  );
};

export default AddProductPage;
