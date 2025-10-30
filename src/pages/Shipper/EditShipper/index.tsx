import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input, Button, FormField } from '@/components';
import { editUserSchema, EditUserFormData } from '@/schemas/account';
import { USER_ROUTES } from '@/constants/routes';
import { formatDate } from '@/utils';
import { FORMAT_DATE } from '@/constants';
import { buildUserFormData } from '@/utils/user';
import userService from '@/apis/user';

interface ShipperWithImg {
  IMG?: string;
}

const EditShipperPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [_selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = formatDate(new Date(), FORMAT_DATE.INPUT);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      userName: '',
      userBirthDay: '',
      userEmail: '',
      userAddress: '',
    },
  });

  useEffect(() => {
    const fetchShipper = async () => {
      if (id) {
        try {
          const result = await userService.getUserById(id);
          const shipper = result.data;

          reset({
            userName: shipper?.userName || '',
            userBirthDay: shipper?.userBirthDay || '',
            userEmail: shipper?.userEmail || '',
            userAddress: shipper?.userAddress || '',
          });

          // BE trả về IMG field, không phải image
          const shipperImg = (shipper as ShipperWithImg)?.IMG;
          if (shipperImg) {
            setImagePreview(shipperImg);
          }
        } catch (error) {
          console.error('Fetch shipper error:', error);
        }
      }
    };
    fetchShipper();
  }, [id, reset]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);

      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }

      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const onSubmit = async (data: EditUserFormData) => {
    setIsSubmitting(true);
    try {
      if (id) {
        const formData = buildUserFormData(data, _selectedFile || undefined);
        await userService.updateUser(id, formData);
      }
    } catch (error) {
      console.error('Update shipper error:', error);
    } finally {
      setIsSubmitting(false);
      navigate(USER_ROUTES.US0016_SHIPPER_LIST);
    }
  };

  const handleCancel = () => {
    navigate(USER_ROUTES.US0016_SHIPPER_LIST);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Cập nhật shipper
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 space-y-4">
          <FormField label="Họ và Tên" isRequired>
            <Input
              type="text"
              placeholder="Nhập họ và tên"
              {...register('userName')}
              error={errors.userName?.message}
            />
          </FormField>

          <FormField label="Ngày sinh" isRequired>
            <Input
              type="date"
              max={today}
              {...register('userBirthDay')}
              error={errors.userBirthDay?.message}
            />
          </FormField>

          <FormField label="Email" isRequired>
            <Input
              type="email"
              placeholder="Nhập email"
              {...register('userEmail')}
              error={errors.userEmail?.message}
            />
          </FormField>

          <FormField label="Địa chỉ" isRequired>
            <Input
              type="text"
              placeholder="Nhập địa chỉ"
              {...register('userAddress')}
              error={errors.userAddress?.message}
            />
          </FormField>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              color="danger"
              className="flex-1"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              color="success"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật shipper'}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ảnh đại diện
              </h3>

              <div className="space-y-4">
                <label
                  htmlFor="image-upload"
                  className="block w-full px-4 py-2 text-center bg-[#28a745] text-white rounded-lg cursor-pointer hover:bg-[#218838] transition-colors"
                >
                  Thêm ảnh
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {!imagePreview && (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Chưa có ảnh</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditShipperPage;
